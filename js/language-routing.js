(function(){
  "use strict";

  var supported = {es:true,en:true,it:true,fr:true};
  var storageKey = "patronesLabLanguage";
  var pageLanguage = (document.documentElement.lang || "es").toLowerCase().split("-")[0];
  if(!supported[pageLanguage]) pageLanguage = "es";

  window.PL_STATIC_MULTILINGUAL = true;
  window.plPageLanguage = pageLanguage;
  window.plGetLanguage = function(){ return pageLanguage; };
  window.plCurrentLanguageForContact = window.plGetLanguage;
  try{ localStorage.setItem(storageKey, pageLanguage); }catch(error){}

  function selectors(){
    return Array.prototype.slice.call(document.querySelectorAll(".language-selector"));
  }

  function closeMenus(except){
    selectors().forEach(function(selector){
      if(except && selector === except) return;
      selector.classList.remove("is-open");
      var toggle = selector.querySelector(".language-select-toggle");
      if(toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

  function setMenu(selector, open){
    if(!selector) return;
    closeMenus(selector);
    selector.classList.toggle("is-open", !!open);
    var toggle = selector.querySelector(".language-select-toggle");
    if(toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function syncCurrentLanguage(){
    selectors().forEach(function(selector){
      var active = null;
      selector.querySelectorAll(".language-option").forEach(function(option){
        var isActive = option.getAttribute("data-lang") === pageLanguage;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-current", isActive ? "page" : "false");
        if(isActive) active = option;
      });
      var current = selector.querySelector(".language-select-current-img");
      var activeImg = active && active.querySelector("img");
      if(current && activeImg && activeImg.getAttribute("src")){
        current.setAttribute("src", activeImg.getAttribute("src"));
      }
    });
  }

  function routeTo(target, event){
    var url = target && target.getAttribute("data-language-url");
    if(!url) return false;
    if(event){
      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation) event.stopImmediatePropagation();
    }
    var targetLanguage = (target.getAttribute("data-lang") || "").toLowerCase();
    if(supported[targetLanguage]){
      try{ localStorage.setItem(storageKey, targetLanguage); }catch(error){}
    }
    closeMenus();
    window.location.assign(url);
    return true;
  }

  document.addEventListener("click", function(event){
    var target = event.target && event.target.closest ? event.target : null;
    if(!target) return;

    var toggle = target.closest(".language-select-toggle");
    if(toggle){
      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation) event.stopImmediatePropagation();
      var selector = toggle.closest(".language-selector");
      var willOpen = !(selector && selector.classList.contains("is-open"));
      setMenu(selector, willOpen);
      return;
    }

    var option = target.closest("[data-language-url]");
    if(option && routeTo(option, event)) return;

    if(!target.closest(".language-selector")) closeMenus();
  }, true);

  document.addEventListener("keydown", function(event){
    if(event.key === "Escape"){
      closeMenus();
      return;
    }
    if(event.key !== "Enter" && event.key !== " ") return;
    var target = event.target && event.target.closest ? event.target : null;
    if(!target) return;
    var toggle = target.closest(".language-select-toggle");
    if(toggle){
      event.preventDefault();
      var selector = toggle.closest(".language-selector");
      setMenu(selector, !(selector && selector.classList.contains("is-open")));
    }
  }, true);

  syncCurrentLanguage();
})();
