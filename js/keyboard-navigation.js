(function(){
  "use strict";

  var panel = document.querySelector(".project-detail-copy");
  if(panel && !panel.hasAttribute("tabindex")) panel.setAttribute("tabindex", "0");

  function readingScroller(target){
    var element = target;
    while(element && element !== document.body && element !== document.documentElement){
      var overflow = getComputedStyle(element).overflowY;
      if(/^(auto|scroll)$/.test(overflow) && element.scrollHeight > element.clientHeight + 1) return element;
      element = element.parentElement;
    }
    return panel || document.scrollingElement;
  }

  document.addEventListener("keydown", function(event){
    if(event.defaultPrevented || event.altKey || event.metaKey) return;
    var key = event.key;
    var keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    var loader = document.querySelector(".pl-scroll-loader");
    if(loader && document.body.classList.contains("pl-scroll-loader-active")){
      if(["Enter", " ", "ArrowDown", "ArrowRight", "PageDown", "End"].indexOf(key) !== -1){
        event.preventDefault();
        loader.click();
      }
      return;
    }
    if(keys.indexOf(key) === -1) return;
    if(event.ctrlKey && key !== "Home" && key !== "End") return;
    var target = event.target;
    if(target.closest && target.closest("input, textarea, select, [contenteditable]:not([contenteditable=\"false\"]), [role=\"slider\"], [role=\"spinbutton\"], [role=\"menu\"], [role=\"listbox\"], [role=\"tree\"], [role=\"grid\"], [role=\"tablist\"]")) return;
    if(target.closest && target.closest("dialog, [role=\"dialog\"], .modal, .project-gallery-lightbox")) return;
    if(document.querySelector("dialog[open], .modal.show")) return;

    var scroller = readingScroller(target);
    var max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    var page = scroller.clientHeight * 0.9;
    var steps = {ArrowDown:40, ArrowUp:-40, PageDown:page, PageUp:-page};
    var top = key === "Home" ? 0 : key === "End" ? max : scroller.scrollTop + steps[key];
    event.preventDefault();
    scroller.scrollTo({top:Math.max(0, Math.min(max, top)), behavior:"instant"});
    if(typeof window.plSmoothScrollSync === "function") window.plSmoothScrollSync();
  });
})();
