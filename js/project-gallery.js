/* P20 gallery: static HTML images remain available without JavaScript. */
(function(){
  'use strict';
  function init(){
    var gallery=document.querySelector('[data-project-gallery]');
    var dialog=document.querySelector('[data-project-lightbox]');
    if(!gallery||!dialog)return;
    var links=Array.from(gallery.querySelectorAll('[data-gallery-src]'));
    var items=links.map(function(link){var img=link.querySelector('img');return {link:link,src:link.dataset.gallerySrc,alt:img.alt,ratio:Number(img.width)/Number(img.height)};});
    if(!items.length)return;
    var grid=gallery.querySelector('[data-project-gallery-grid]');
    var ratios=items.map(function(item){return item.ratio;});
    grid.classList.toggle('is-masonry',Math.max.apply(null,ratios)-Math.min.apply(null,ratios)>.08);
    var image=dialog.querySelector('[data-lightbox-image]');
    var counter=dialog.querySelector('[data-lightbox-counter]');
    var closeButton=dialog.querySelector('[data-lightbox-close]');
    var prevButton=dialog.querySelector('[data-lightbox-prev]');
    var nextButton=dialog.querySelector('[data-lightbox-next]');
    var copy=document.querySelector('.project-detail-copy');
    var current=0,lastFocus=null,bodyOverflow='',copyOverflow='',touchX=0,touchY=0;
    function update(){
      image.src=items[current].src;image.alt=items[current].alt;
      counter.textContent=(current+1)+' / '+items.length;
      prevButton.hidden=nextButton.hidden=items.length<2;
    }
    function open(index){
      current=index;lastFocus=document.activeElement;
      bodyOverflow=document.body.style.overflow;copyOverflow=copy?copy.style.overflow:'';
      update();dialog.hidden=false;dialog.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';if(copy)copy.style.overflow='hidden';
      closeButton.focus({preventScroll:true});
    }
    function close(){
      dialog.hidden=true;dialog.setAttribute('aria-hidden','true');image.removeAttribute('src');image.alt='';
      document.body.style.overflow=bodyOverflow;if(copy)copy.style.overflow=copyOverflow;
      if(lastFocus)lastFocus.focus({preventScroll:true});
    }
    function move(step){current=(current+step+items.length)%items.length;update();}
    items.forEach(function(item,index){
      item.link.setAttribute('role','button');item.link.setAttribute('aria-haspopup','dialog');
      item.link.addEventListener('click',function(event){event.preventDefault();open(index);});
      item.link.addEventListener('keydown',function(event){if(event.key===' '){event.preventDefault();open(index);}});
    });
    closeButton.addEventListener('click',close);
    prevButton.addEventListener('click',function(){move(-1);});nextButton.addEventListener('click',function(){move(1);});
    dialog.addEventListener('click',function(event){if(event.target===dialog)close();});
    dialog.addEventListener('touchstart',function(event){touchX=event.changedTouches[0].clientX;touchY=event.changedTouches[0].clientY;},{passive:true});
    dialog.addEventListener('touchend',function(event){var dx=event.changedTouches[0].clientX-touchX,dy=event.changedTouches[0].clientY-touchY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);},{passive:true});
    document.addEventListener('keydown',function(event){
      if(dialog.hidden)return;
      if(event.key==='Escape'){event.preventDefault();close();}
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();move(1);}
      if(event.key==='Tab'){
        var controls=Array.from(dialog.querySelectorAll('button')).filter(function(button){return !button.hidden&&!button.disabled;});
        var first=controls[0],last=controls[controls.length-1];
        if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus();}
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
