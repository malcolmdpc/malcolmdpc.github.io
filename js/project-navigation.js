(function(){
 'use strict';
 var crumb=document.querySelector('.project-breadcrumb');
 if(crumb){
  var items=Array.from(crumb.querySelectorAll('.project-breadcrumb__item'));
  function fitBreadcrumb(){
   crumb.dataset.levels='4';
   var widths=items.map(function(item){
    var text=item.querySelector('a,span'),range=document.createRange();range.selectNodeContents(text);
    var before=getComputedStyle(item,'::before');
    return range.getBoundingClientRect().width+(before.content==='none'?0:(parseFloat(before.marginLeft)||0)+(parseFloat(before.marginRight)||0)+8);
   });
   var available=crumb.clientWidth-2,total=widths.reduce(function(a,b){return a+b;},0);
   crumb.dataset.levels=total<=available?'4':widths.slice(0,3).reduce(function(a,b){return a+b;},0)<=available?'3':'2';
  }
  fitBreadcrumb();
  if(window.ResizeObserver)new ResizeObserver(fitBreadcrumb).observe(crumb);
  else window.addEventListener('resize',fitBreadcrumb);
  if(document.fonts)document.fonts.ready.then(fitBreadcrumb);
 }
 var languageToggle=document.querySelector('.project-language-toggle');
 var languageMenu=document.querySelector('.project-language-menu');
 function fitLanguageMenu(){
  if(!languageMenu)return;
  languageMenu.style.right='0px';
  var rect=languageMenu.getBoundingClientRect(),offset=0;
  if(rect.left<8)offset=rect.left-8;
  else if(rect.right>window.innerWidth-8)offset=rect.right-window.innerWidth+8;
  languageMenu.style.right=offset+'px';
 }
 if(languageToggle)languageToggle.addEventListener('click',fitLanguageMenu);
 window.addEventListener('resize',fitLanguageMenu);
 var wrap=document.querySelector('.project-site-navigation');if(!wrap)return;
 var button=wrap.querySelector('button'),menu=wrap.querySelector('nav'),links=Array.from(menu.querySelectorAll('a'));
 function fitSiteMenu(){
  if(menu.hidden)return;
  var anchor=button.getBoundingClientRect(),height=menu.getBoundingClientRect().height;
  var top=anchor.bottom+10;
  if(top+height>window.innerHeight-8)top=anchor.top-height-10;
  menu.style.top=Math.max(8,Math.min(top,window.innerHeight-height-8))+'px';
  menu.style.right=Math.max(8,window.innerWidth-anchor.right)+'px';
 }
 window.addEventListener('resize',fitSiteMenu);
 function setOpen(open,focusFirst){
  button.setAttribute('aria-expanded',String(open));menu.hidden=!open;fitSiteMenu();
  if(open){var selector=document.querySelector('.project-language-selector');if(selector){selector.classList.remove('is-open');selector.querySelector('button').setAttribute('aria-expanded','false');}}
  if(open&&focusFirst)links[0].focus();
 }
 button.addEventListener('click',function(){setOpen(menu.hidden,false);});
 button.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();e.stopPropagation();setOpen(true,true);}});
 document.addEventListener('click',function(e){if(!wrap.contains(e.target))setOpen(false,false);});
 document.addEventListener('focusin',function(e){if(!wrap.contains(e.target))setOpen(false,false);});
 document.addEventListener('keydown',function(e){
  if(menu.hidden)return;
  if(e.key==='Escape'){e.preventDefault();setOpen(false,false);button.focus();}
  var i=links.indexOf(document.activeElement);
  if(i>=0&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();links[(i+(e.key==='ArrowDown'?1:-1)+links.length)%links.length].focus();}
 });
})();
