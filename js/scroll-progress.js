(function(){
  "use strict";

  var bar = document.querySelector(".site-scroll-progress");
  if(!bar) return;
  var panel = document.querySelector(".project-detail-copy");
  var scroller = panel || document.scrollingElement;
  var scrollTarget = panel || window;
  var pending = false;
  var distance = 0;
  var refreshing = false;

  function update(){
    if(refreshing){
      pending = false;
      return;
    }
    var progress = distance > 0 ? scroller.scrollTop / distance : 1;
    bar.style.setProperty("--site-scroll-progress", Math.max(0, Math.min(1, progress)));
    pending = false;
  }

  function measure(){
    if(refreshing) return;
    distance = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    scheduleUpdate();
  }

  function scheduleUpdate(){
    if(pending) return;
    pending = true;
    requestAnimationFrame(update);
  }

  scrollTarget.addEventListener("scroll", scheduleUpdate, {passive:true});
  window.addEventListener("resize", measure);
  window.addEventListener("pageshow", measure);
  document.addEventListener("load", measure, true);
  if(window.ResizeObserver){
    var observer = new ResizeObserver(measure);
    observer.observe(panel || document.body);
    if(panel){
      Array.prototype.forEach.call(panel.children, function(child){ observer.observe(child); });
    }
  }
  if(document.fonts) document.fonts.ready.then(measure);
  if(window.ScrollTrigger){
    // Keep the full-page range while pinned sections rebuild their spacing.
    window.ScrollTrigger.addEventListener("refreshInit", function(){ refreshing = true; });
    window.ScrollTrigger.addEventListener("refresh", function(){
      refreshing = false;
      measure();
    });
  }
  measure();
})();
