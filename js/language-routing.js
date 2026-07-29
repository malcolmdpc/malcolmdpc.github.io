(function(){
  "use strict";
  var supported = {es:true,en:true,it:true};
  var pageLanguage = (document.documentElement.lang || "es").toLowerCase().split("-")[0];
  if(!supported[pageLanguage]) pageLanguage = "es";
  window.PL_STATIC_MULTILINGUAL = true;
  window.plPageLanguage = pageLanguage;
  window.plGetLanguage = function(){ return pageLanguage; };
  window.plCurrentLanguageForContact = window.plGetLanguage;
  try{ localStorage.setItem("patronesLabLanguage", pageLanguage); }catch(e){}

  function route(event){
    var target = event.target && event.target.closest ? event.target.closest("[data-language-url]") : null;
    if(!target) return;
    var url = target.getAttribute("data-language-url");
    if(!url) return;
    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation) event.stopImmediatePropagation();
    window.location.href = url;
  }

  document.addEventListener("click", route, true);
  document.addEventListener("keydown", function(event){
    if(event.key !== "Enter" && event.key !== " ") return;
    var target = event.target && event.target.closest ? event.target.closest("[data-language-url]") : null;
    if(!target) return;
    event.preventDefault();
    var url = target.getAttribute("data-language-url");
    if(url) window.location.href = url;
  }, true);
})();
