(function(){
  "use strict";

  var languageKey = "patronesLabLanguage";
  var modeKey = "patrones-lab-color-mode";
  var pageLanguage = (document.documentElement.lang || "es").toLowerCase().split("-")[0];
  var supportedLanguages = {es:true,en:true,it:true,fr:true};
  if(!supportedLanguages[pageLanguage]) pageLanguage = "es";

  var mobileRepoLabels = {
    es: "Entrar al Repo",
    en: "Open Repo",
    it: "Apri il repo",
    fr: "Ouvrir le dépôt"
  };
  var mobileRepoMedia = window.matchMedia("(max-width: 767px)");

  window.plPageLanguage = pageLanguage;
  window.plGetLanguage = function(){ return pageLanguage; };
  window.plCurrentLanguageForContact = window.plGetLanguage;
  try{ localStorage.setItem(languageKey, pageLanguage); }catch(error){}

  function applyResponsiveRepoLabels(){
    var compact = mobileRepoMedia.matches;
    document.querySelectorAll('[data-mobile-repo-label="true"]').forEach(function(el){
      if(!el.dataset.desktopLabel) el.dataset.desktopLabel = el.textContent;
      el.textContent = compact ? mobileRepoLabels[pageLanguage] : el.dataset.desktopLabel;
    });
  }

  function setLanguageMenu(open){
    var selector = document.querySelector(".project-language-selector");
    var toggle = document.querySelector(".project-language-toggle");
    if(!selector || !toggle) return;
    selector.classList.toggle("is-open", !!open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function applyMode(mode){
    var light = mode === "light";
    document.body.classList.toggle("project-light-mode", light);
    document.body.classList.toggle("dark-mode", !light);
    try{ localStorage.setItem(modeKey, light ? "light" : "dark"); }catch(error){}
  }

  function setupGallery(){
    var scroller = document.querySelector("[data-infinite-gallery]");
    if(!scroller) return;
    var inner = scroller.querySelector(".project-gallery-inner");
    var sourceSet = scroller.querySelector("[data-gallery-set]");
    if(!inner || !sourceSet) return;

    var sourceImages = Array.prototype.slice.call(sourceSet.querySelectorAll("img"));
    if(!sourceImages.length) return;

    function gcd(a, b){
      while(b){
        var t = b;
        b = a % b;
        a = t;
      }
      return Math.abs(a);
    }

    function buildGalleryOrders(total){
      if(total <= 1) return [[0]];
      var candidates = [7, 11, 5, 13, 17, 19, 23, 3];
      var orders = [];

      for(var seed = 0; seed < 4; seed++){
        var step = candidates[seed % candidates.length];
        var guard = 0;
        while(gcd(step, total) !== 1 && guard < candidates.length){
          step = candidates[(seed + guard + 1) % candidates.length];
          guard++;
        }
        if(gcd(step, total) !== 1) step = 1;

        var start = (seed * Math.max(1, Math.floor(total / 4) + 1)) % total;
        var order = [];
        for(var i = 0; i < total; i++){
          order.push((start + i * step) % total);
        }
        orders.push(order);
      }

      return orders;
    }

    var orders = buildGalleryOrders(sourceImages.length);
    var eagerBudget = Math.min(6, sourceImages.length);
    function createImageFromSource(index, isFirstVisibleSet){
      var img = sourceImages[index].cloneNode(true);
      img.removeAttribute("data-gallery-fill");
      img.setAttribute("draggable", "false");
      if(isFirstVisibleSet && eagerBudget > 0){
        img.setAttribute("loading", "eager");
        eagerBudget--;
      }else{
        img.setAttribute("loading", "lazy");
      }
      return img;
    }

    function createGallery(order, isFirstVisibleSet){
      var gallery = document.createElement("div");
      gallery.className = "project-masonry-gallery";
      gallery.setAttribute("data-gallery-set", "true");
      order.forEach(function(index){
        gallery.appendChild(createImageFromSource(index, isFirstVisibleSet));
      });
      return gallery;
    }

    function createSegment(isFirstVisibleSet){
      var sequence = document.createElement("div");
      sequence.className = "project-gallery-sequence";
      orders.forEach(function(order, orderIndex){
        sequence.appendChild(createGallery(order, isFirstVisibleSet && orderIndex === 0));
      });
      return sequence;
    }

    inner.innerHTML = "";
    var beforeSegment = createSegment(false);
    var mainSegment = createSegment(true);
    var afterSegment = createSegment(false);
    inner.appendChild(beforeSegment);
    inner.appendChild(mainSegment);
    inner.appendChild(afterSegment);

    function segmentHeight(){
      return mainSegment.offsetHeight || beforeSegment.offsetHeight || 0;
    }

    var userInteracted = false;
    var programmaticScroll = false;
    var resizeTimer = 0;

    function setMiddle(){
      if(userInteracted) return;
      var h = segmentHeight();
      if(h <= 0) return;
      programmaticScroll = true;
      scroller.scrollTop = h;
      window.setTimeout(function(){ programmaticScroll = false; }, 40);
    }

    function loop(){
      var h = segmentHeight();
      if(h <= 0) return;
      if(scroller.scrollTop < h * 0.5){
        programmaticScroll = true;
        scroller.scrollTop += h;
        window.setTimeout(function(){ programmaticScroll = false; }, 40);
      }else if(scroller.scrollTop > h * 1.5){
        programmaticScroll = true;
        scroller.scrollTop -= h;
        window.setTimeout(function(){ programmaticScroll = false; }, 40);
      }
    }

    function markUserScroll(){
      if(!programmaticScroll) userInteracted = true;
    }

    var isDragging = false;
    var dragStartY = 0;
    var dragStartScroll = 0;

    scroller.addEventListener("pointerdown", function(event){
      if(event.pointerType && event.pointerType !== "mouse") return;
      if(typeof event.button === "number" && event.button !== 0) return;
      userInteracted = true;
      isDragging = true;
      dragStartY = event.clientY;
      dragStartScroll = scroller.scrollTop;
      scroller.classList.add("is-dragging");
      if(scroller.setPointerCapture) scroller.setPointerCapture(event.pointerId);
    });

    scroller.addEventListener("pointermove", function(event){
      if(!isDragging) return;
      var deltaY = event.clientY - dragStartY;
      scroller.scrollTop = dragStartScroll - deltaY;
      loop();
      event.preventDefault();
    });

    function stopDrag(event){
      if(!isDragging) return;
      isDragging = false;
      scroller.classList.remove("is-dragging");
      if(event && scroller.releasePointerCapture){
        try{ scroller.releasePointerCapture(event.pointerId); }catch(error){}
      }
    }

    scroller.addEventListener("wheel", markUserScroll, {passive:true});
    scroller.addEventListener("touchstart", markUserScroll, {passive:true});
    scroller.addEventListener("pointerup", stopDrag);
    scroller.addEventListener("pointercancel", stopDrag);
    scroller.addEventListener("pointerleave", stopDrag);
    scroller.addEventListener("scroll", function(){
      if(!programmaticScroll) userInteracted = true;
      loop();
    }, {passive:true});

    function scheduleInitialMiddle(){
      window.requestAnimationFrame(function(){
        setMiddle();
        window.setTimeout(setMiddle, 120);
      });
    }

    function handleResize(){
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function(){
        if(!userInteracted) setMiddle();
      }, 120);
    }

    scheduleInitialMiddle();
    window.addEventListener("resize", handleResize);
  }

  function setupTechPopover(){
    document.querySelectorAll("[data-tech-popover]").forEach(function(popover){
      var trigger = popover.querySelector(".project-tech-trigger");
      var panel = popover.querySelector(".project-tech-sheet");
      if(!trigger || !panel) return;
      var pinned = false;

      function openPopover(lockOpen){
        if(lockOpen) pinned = true;
        popover.classList.add("is-open");
        popover.classList.toggle("is-pinned", pinned);
        trigger.setAttribute("aria-expanded", "true");
        panel.setAttribute("aria-hidden", "false");
      }

      function closePopover(){
        pinned = false;
        popover.classList.remove("is-open", "is-pinned");
        trigger.setAttribute("aria-expanded", "false");
        panel.setAttribute("aria-hidden", "true");
      }

      trigger.addEventListener("click", function(event){
        event.preventDefault();
        event.stopPropagation();
        if(pinned){
          closePopover();
        }else{
          openPopover(true);
        }
      });

      trigger.addEventListener("pointerenter", function(event){
        if(event.pointerType !== "touch" && !pinned) openPopover(false);
      });

      popover.addEventListener("pointerleave", function(event){
        if(event.pointerType !== "touch" && !pinned) closePopover();
      });

      panel.addEventListener("click", function(event){
        event.stopPropagation();
      });

      document.addEventListener("click", function(event){
        if(!popover.contains(event.target)) closePopover();
      });

      document.addEventListener("keydown", function(event){
        if(event.key === "Escape") closePopover();
      });
    });
  }


  document.addEventListener("DOMContentLoaded", function(){
    applyMode((function(){ try{return localStorage.getItem(modeKey) || "dark";}catch(error){return "dark";} })());
    applyResponsiveRepoLabels();

    var languageToggle = document.querySelector(".project-language-toggle");
    if(languageToggle){
      languageToggle.addEventListener("click", function(event){
        event.preventDefault();
        var selector = document.querySelector(".project-language-selector");
        setLanguageMenu(!(selector && selector.classList.contains("is-open")));
      });
    }

    document.addEventListener("click", function(event){
      var selector = document.querySelector(".project-language-selector");
      if(selector && !selector.contains(event.target)) setLanguageMenu(false);
    });

    document.addEventListener("keydown", function(event){
      if(event.key === "Escape") setLanguageMenu(false);
    });

    var toggle = document.querySelector(".project-theme-toggle");
    if(toggle){
      toggle.addEventListener("click", function(){
        applyMode(document.body.classList.contains("project-light-mode") ? "dark" : "light");
      });
    }

    if(mobileRepoMedia.addEventListener){
      mobileRepoMedia.addEventListener("change", applyResponsiveRepoLabels);
    }else if(mobileRepoMedia.addListener){
      mobileRepoMedia.addListener(applyResponsiveRepoLabels);
    }

    setupGallery();
    setupTechPopover();
  });
})();
