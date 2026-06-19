(function(){
  var languageKey = "patronesLabLanguage";
  var modeKey = "patrones-lab-color-mode";
  var flagPaths = {
    es: "../images/patrones/language-flags/flag-es.svg",
    en: "../images/patrones/language-flags/flag-us.svg",
    it: "../images/patrones/language-flags/flag-it.svg"
  };
  var text = {
    es: {
      back: "← Volver a proyectos",
      kicker: "Proyecto 01 · Analítica de datos",
      title: "Análisis de Vuelos en las Islas Baleares",
      status: "✅ publicado",
      dataLabel: "datos:",
      lead: "Análisis de tráfico aéreo en España con datos públicos de AENA, con foco en volúmenes, patrones por aeropuerto y diferencias entre categorías.",
      tagAviation: "Aviación",
      questionTitle: "Pregunta de trabajo",
      questionText: "¿Qué patrones aparecen en el tráfico aéreo de las Islas Baleares cuando se miran los datos por aeropuerto, volumen y tipo de tráfico?",
      approachTitle: "Enfoque",
      approachOne: "Uso de datos públicos de AENA como fuente principal.",
      approachTwo: "Comparación de aeropuertos, categorías y variaciones de tráfico.",
      approachThree: "Construcción de visuales para convertir datos operativos en lectura territorial.",
      outputTitle: "Salida del proyecto",
      outputText: "El proyecto queda presentado como análisis reproducible en GitHub y como pieza editorial en LinkedIn, manteniendo una narrativa visual orientada a patrones y contexto.",
      repoButton: "Ver repo",
      linkedinButton: "Leer en LinkedIn",
      signature: "Patrones Lab® · Generando conocimiento a partir de los datos · por Malcolm Di Pietro Cagliari",
      languageLabel: "Cambiar idioma",
      themeLabel: "Cambiar modo visual",
      repoAria: "Abrir repositorio del proyecto en GitHub",
      linkedinAria: "Abrir publicación del proyecto en LinkedIn",
      galleryAltCover: "Portada del análisis de tráfico aéreo en las Islas Baleares",
      galleryAltIslandShare: "Distribución de pasajeros por isla en Baleares en 2025",
      galleryAltSeasonVariation: "Variación de pasajeros entre temporada alta y baja en Baleares",
      galleryAltTopCities: "Top 10 ciudades por pasajeros hacia Baleares",
      galleryAltTopCountries: "Top 10 países por pasajeros hacia Baleares",
      galleryAltTopAirlines: "Top aerolíneas por pasajeros hacia Baleares",
      galleryAltIslandTime: "Distribución temporal de pasajeros entre Mallorca, Menorca e Ibiza",
      galleryAltHighSeasonKpi: "Indicador de variación de temporada alta 2025 frente a 2024",
      galleryAltTotalPassengersKpi: "Indicador de pasajeros totales llegados a Baleares",
      galleryAltLowSeasonKpi: "Indicador de variación de temporada baja 2025 frente a 2024",
      galleryAltCountryMap: "Mapa de países de escala con llegadas a Baleares",
      galleryAltSpainCompanies: "Comparación de llegadas a Baleares por compañía desde España",
      galleryAltAirportDonut: "Distribución de pasajeros por aeropuerto base en Baleares",
      galleryAltCountryIncrease: "Países con mayor incremento de llegadas a Baleares",
      galleryAltCompanyTimeSeries: "Serie temporal mensual de pasajeros por principales compañías",
      galleryAltCountryDecrease: "Países con mayor caída de llegadas a Baleares",
      galleryAltSeasonHeatmap: "Mapa de calor de estacionalidad mensual por aeropuerto base",
      galleryAltAirportBubbleMap: "Mapa de burbujas de aeropuertos de escala hacia Baleares"
    },
    en: {
      back: "← Back to projects",
      kicker: "Project 01 · Data analytics",
      title: "Balearic Islands Flight Analysis",
      status: "✅ published",
      dataLabel: "data:",
      lead: "Analysis of air traffic in Spain using public AENA data, focused on volume, airport-level patterns and differences across traffic categories.",
      tagAviation: "Aviation",
      questionTitle: "Working question",
      questionText: "What patterns appear in Balearic Islands air traffic when the data is read by airport, volume and traffic type?",
      approachTitle: "Approach",
      approachOne: "Public AENA data is used as the main source.",
      approachTwo: "Airports, categories and traffic variations are compared.",
      approachThree: "Visuals are built to turn operational data into a territorial reading.",
      outputTitle: "Project output",
      outputText: "The project is presented as a reproducible analysis on GitHub and as an editorial piece on LinkedIn, with a visual narrative focused on patterns and context.",
      repoButton: "View repo",
      linkedinButton: "Read on LinkedIn",
      signature: "Patrones Lab® · Generating knowledge from data · by Malcolm Di Pietro Cagliari",
      languageLabel: "Change language",
      themeLabel: "Change visual mode",
      repoAria: "Open project repository on GitHub",
      linkedinAria: "Open project post on LinkedIn",
      galleryAltCover: "Cover image for the Balearic Islands air traffic analysis",
      galleryAltIslandShare: "Passenger distribution by island in the Balearic Islands in 2025",
      galleryAltSeasonVariation: "Passenger variation between high and low season in the Balearic Islands",
      galleryAltTopCities: "Top 10 cities by passengers to the Balearic Islands",
      galleryAltTopCountries: "Top 10 countries by passengers to the Balearic Islands",
      galleryAltTopAirlines: "Top airlines by passengers to the Balearic Islands",
      galleryAltIslandTime: "Time distribution of passengers between Mallorca, Menorca and Ibiza",
      galleryAltHighSeasonKpi: "High-season variation indicator for 2025 versus 2024",
      galleryAltTotalPassengersKpi: "Total passenger arrivals indicator for the Balearic Islands",
      galleryAltLowSeasonKpi: "Low-season variation indicator for 2025 versus 2024",
      galleryAltCountryMap: "Map of stopover countries with arrivals to the Balearic Islands",
      galleryAltSpainCompanies: "Comparison of arrivals to the Balearic Islands by company from Spain",
      galleryAltAirportDonut: "Passenger distribution by base airport in the Balearic Islands",
      galleryAltCountryIncrease: "Countries with the largest increase in arrivals to the Balearic Islands",
      galleryAltCompanyTimeSeries: "Monthly passenger time series for the leading companies",
      galleryAltCountryDecrease: "Countries with the largest drop in arrivals to the Balearic Islands",
      galleryAltSeasonHeatmap: "Monthly seasonality heatmap by base airport",
      galleryAltAirportBubbleMap: "Bubble map of stopover airports to the Balearic Islands"
    },
    it: {
      back: "← Torna ai progetti",
      kicker: "Progetto 01 · Analisi dei dati",
      title: "Analisi del traffico aereo nelle Isole Baleari",
      status: "✅ pubblicato",
      dataLabel: "dati:",
      lead: "Analisi del traffico aereo in Spagna con dati pubblici AENA, con focus su volumi, pattern per aeroporto e differenze tra categorie di traffico.",
      tagAviation: "Aviazione",
      questionTitle: "Domanda di lavoro",
      questionText: "Quali pattern emergono nel traffico aereo delle Isole Baleari quando i dati vengono letti per aeroporto, volume e tipo di traffico?",
      approachTitle: "Approccio",
      approachOne: "I dati pubblici AENA sono usati come fonte principale.",
      approachTwo: "Si confrontano aeroporti, categorie e variazioni di traffico.",
      approachThree: "Si costruiscono visual per trasformare dati operativi in una lettura territoriale.",
      outputTitle: "Output del progetto",
      outputText: "Il progetto è presentato come analisi riproducibile su GitHub e come contenuto editoriale su LinkedIn, con una narrazione visuale orientata a pattern e contesto.",
      repoButton: "Vedi repo",
      linkedinButton: "Leggi su LinkedIn",
      signature: "Patrones Lab® · Generare conoscenza a partire dai dati · di Malcolm Di Pietro Cagliari",
      languageLabel: "Cambia lingua",
      themeLabel: "Cambia modalità visiva",
      repoAria: "Aprire il repository del progetto su GitHub",
      linkedinAria: "Aprire il post del progetto su LinkedIn",
      galleryAltCover: "Copertina dell’analisi del traffico aereo nelle Isole Baleari",
      galleryAltIslandShare: "Distribuzione dei passeggeri per isola nelle Baleari nel 2025",
      galleryAltSeasonVariation: "Variazione dei passeggeri tra alta e bassa stagione nelle Baleari",
      galleryAltTopCities: "Top 10 città per passeggeri verso le Isole Baleari",
      galleryAltTopCountries: "Top 10 Paesi per passeggeri verso le Isole Baleari",
      galleryAltTopAirlines: "Principali compagnie aeree per passeggeri verso le Isole Baleari",
      galleryAltIslandTime: "Distribuzione temporale dei passeggeri tra Maiorca, Minorca e Ibiza",
      galleryAltHighSeasonKpi: "Indicatore di variazione dell’alta stagione 2025 rispetto al 2024",
      galleryAltTotalPassengersKpi: "Indicatore dei passeggeri totali arrivati nelle Baleari",
      galleryAltLowSeasonKpi: "Indicatore di variazione della bassa stagione 2025 rispetto al 2024",
      galleryAltCountryMap: "Mappa dei Paesi di scalo con arrivi alle Baleari",
      galleryAltSpainCompanies: "Confronto degli arrivi alle Baleari per compagnia dalla Spagna",
      galleryAltAirportDonut: "Distribuzione dei passeggeri per aeroporto base nelle Baleari",
      galleryAltCountryIncrease: "Paesi con il maggiore incremento di arrivi alle Baleari",
      galleryAltCompanyTimeSeries: "Serie temporale mensile dei passeggeri per le principali compagnie",
      galleryAltCountryDecrease: "Paesi con la maggiore diminuzione di arrivi alle Baleari",
      galleryAltSeasonHeatmap: "Mappa di calore della stagionalità mensile per aeroporto base",
      galleryAltAirportBubbleMap: "Mappa a bolle degli aeroporti di scalo verso le Baleari"
    }
  };

  function validLanguage(lang){
    return text[lang] ? lang : "es";
  }

  function setLanguageMenu(open){
    var selector = document.querySelector(".project-language-selector");
    var toggle = document.querySelector(".project-language-toggle");
    if(!selector || !toggle) return;
    selector.classList.toggle("is-open", !!open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function applyLanguage(lang){
    lang = validLanguage(lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if(text[lang][key]) el.textContent = text[lang][key];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function(el){
      var key = el.getAttribute("data-i18n-aria");
      if(text[lang][key]) el.setAttribute("aria-label", text[lang][key]);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function(el){
      var key = el.getAttribute("data-i18n-alt");
      if(text[lang][key]) el.setAttribute("alt", text[lang][key]);
    });

    document.querySelectorAll(".project-language-option").forEach(function(btn){
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    var currentFlag = document.querySelector(".project-language-current-img");
    if(currentFlag) currentFlag.setAttribute("src", flagPaths[lang]);

    localStorage.setItem(languageKey, lang);
  }

  function applyMode(mode){
    var light = mode === "light";
    document.body.classList.toggle("project-light-mode", light);
    document.body.classList.toggle("dark-mode", !light);
    localStorage.setItem(modeKey, light ? "light" : "dark");
  }

  function setupGallery(){
    var scroller = document.querySelector("[data-infinite-gallery]");
    if(!scroller) return;
    var inner = scroller.querySelector(".project-gallery-inner");
    var sourceSet = scroller.querySelector("[data-gallery-set]");
    if(!inner || !sourceSet) return;

    var sourceImages = Array.prototype.slice.call(sourceSet.querySelectorAll("img"));
    if(!sourceImages.length) return;

    var orders = [
      [0, 6, 1, 12, 4, 8, 14, 2, 10, 16, 5, 9, 13, 3, 11, 17, 7, 15],
      [11, 3, 15, 0, 13, 5, 9, 2, 17, 7, 12, 4, 16, 1, 8, 14, 6, 10],
      [4, 10, 0, 16, 6, 13, 2, 9, 15, 5, 11, 7, 14, 3, 12, 8, 1, 17],
      [13, 1, 7, 11, 5, 15, 3, 8, 0, 12, 16, 4, 10, 6, 14, 2, 17, 9]
    ];

    function createImageFromSource(index, isFirstVisibleSet){
      var img = sourceImages[index].cloneNode(true);
      img.removeAttribute("data-gallery-fill");
      img.setAttribute("draggable", "false");
      img.setAttribute("loading", isFirstVisibleSet ? "eager" : "lazy");
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

    function setMiddle(){
      var h = segmentHeight();
      if(h > 0) scroller.scrollTop = h;
    }

    function loop(){
      var h = segmentHeight();
      if(h <= 0) return;
      if(scroller.scrollTop < h * 0.5) scroller.scrollTop += h;
      if(scroller.scrollTop > h * 1.5) scroller.scrollTop -= h;
    }

    var isDragging = false;
    var dragStartY = 0;
    var dragStartScroll = 0;

    scroller.addEventListener("pointerdown", function(event){
      if(event.pointerType && event.pointerType !== "mouse") return;
      if(typeof event.button === "number" && event.button !== 0) return;
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

    scroller.addEventListener("pointerup", stopDrag);
    scroller.addEventListener("pointercancel", stopDrag);
    scroller.addEventListener("pointerleave", stopDrag);
    scroller.addEventListener("scroll", loop, {passive:true});

    var pendingMiddle = 0;
    function scheduleMiddle(){
      window.clearTimeout(pendingMiddle);
      pendingMiddle = window.setTimeout(setMiddle, 80);
    }

    Array.prototype.slice.call(inner.querySelectorAll("img")).forEach(function(img){
      if(!img.complete) img.addEventListener("load", scheduleMiddle, {once:true});
    });

    window.setTimeout(setMiddle, 80);
    window.setTimeout(setMiddle, 350);
    window.addEventListener("resize", scheduleMiddle);
  }

  document.addEventListener("DOMContentLoaded", function(){
    applyLanguage(localStorage.getItem(languageKey) || "es");
    applyMode(localStorage.getItem(modeKey) || "dark");

    var languageToggle = document.querySelector(".project-language-toggle");
    if(languageToggle){
      languageToggle.addEventListener("click", function(){
        var selector = document.querySelector(".project-language-selector");
        setLanguageMenu(!(selector && selector.classList.contains("is-open")));
      });
    }

    document.querySelectorAll(".project-language-option").forEach(function(btn){
      btn.addEventListener("click", function(){
        applyLanguage(btn.getAttribute("data-lang"));
        setLanguageMenu(false);
      });
    });

    document.addEventListener("click", function(event){
      var selector = document.querySelector(".project-language-selector");
      if(selector && !selector.contains(event.target)) setLanguageMenu(false);
    });

    var toggle = document.querySelector(".project-theme-toggle");
    if(toggle){
      toggle.addEventListener("click", function(){
        applyMode(document.body.classList.contains("project-light-mode") ? "dark" : "light");
      });
    }

    setupGallery();
  });
})();
