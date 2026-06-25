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
      back: "⮌ Volver",
      nextProject: "Siguiente ➜",
      nextProjectAria: "Ir al siguiente proyecto",
      kicker: "Proyecto 01 · Analítica de datos",
      title: "Análisis de Vuelos en las Islas Baleares",
      status: "✅ publicado",
      dataLabel: "datos:",
      lead: "Análisis de tráfico aéreo en España con datos públicos de AENA, con foco en volúmenes, patrones por aeropuerto y diferencias entre categorías.",
      tagPython: "Python",
      tagDataStorytelling: "Narrativa de datos",
      tagAviation: "Aviación",
      tagDataAnalysis: "Análisis de datos",
      tagBI: "BI",
      techPython: "Python",
      techPandas: "Pandas",
      techPlotly: "Plotly",
      techSPSS: "SPSS",
      techScikitLearn: "Scikit-learn",
      techLookerStudio: "Looker Studio",
      techPowerBI: "Power BI",
      techAirbnb: "Airbnb",
      techDataAnalysis: "Análisis de datos",
      techAviation: "Aviación",
      techBI: "BI",
      techDataScience: "Ciencia de datos",
      techClassification: "Clasificación",
      techClustering: "Clustering",
      techDashboard: "Dashboard",
      techDataStorytelling: "Narrativa de datos",
      techDBSCAN: "DBSCAN",
      techFraud: "Fraude",
      techFootball: "Fútbol",
      techGeospatial: "Geoespacial",
      techKMeans: "K-means",
      techKNN: "KNN",
      techMachineLearning: "Machine Learning",
      techUnsupervisedModel: "Modelo no supervisado",
      techSupervisedModel: "Modelo supervisado",
      techLogisticRegression: "Regresión logística",
      techTaxi: "Taxi",
      techSheetTitle: "FICHA TÉCNICA",
      techSheetAria: "Ficha técnica del proyecto",
      techSheetButton: "Ver ficha técnica",
      techSheetButtonAria: "Ver ficha técnica del proyecto",
      techTypeLabel: "Tipo de análisis",
      techTypeValue: "Analítica de datos · Visualización · Data storytelling",
      techSourceLabel: "Fuente de datos",
      techSourceValue: "Datos públicos de AENA",
      techPeriodLabel: "Período analizado",
      techPeriodValue: "2024 y 2025",
      techUnitLabel: "Unidad de análisis",
      techUnitValue: "Pasajeros aéreos vinculados a aeropuertos de Baleares",
      techTerritoryLabel: "Territorio",
      techTerritoryValue: "Palma de Mallorca · Ibiza · Menorca",
      techVariablesLabel: "Variables principales",
      techVariablesValue: "Pasajeros, aeropuertos, países, ciudades, aerolíneas, meses y temporada",
      techAxisLabel: "Eje de análisis",
      techAxisValue: "Demanda aérea, estacionalidad, conectividad internacional y distribución territorial del tráfico en Baleares",
      techTreatmentLabel: "Tratamiento aplicado",
      techTreatmentValue: "Limpieza de datos, agregación temporal, comparación entre temporadas, análisis por aeropuertos, países, ciudades y aerolíneas",
      techToolsLabel: "Herramientas",
      techToolsValue: "Python · Pandas · Plotly · GitHub",
      techOutputLabel: "Salida del proyecto",
      techOutputValue: "Notebook analítico, gráficos y publicación en LinkedIn",
      techStatusLabel: "Estado",
      techStatusValue: "Publicado",
      questionTitle: "CONTEXTO Y OBJETIVO",
      questionText: "¿Qué patrones aparecen en el tráfico aéreo de las Islas Baleares cuando se miran los datos por aeropuerto, volumen y tipo de tráfico?",
      approachTitle: "DATOS Y DIAGNÓSTICO",
      approachOne: "Uso de datos públicos de AENA como fuente principal.",
      approachTwo: "Comparación de aeropuertos, categorías y variaciones de tráfico.",
      approachThree: "Construcción de visuales para convertir datos operativos en lectura territorial.",
      outputTitle: "ENTREGA Y APRENDIZAJE",
      outputText: "El proyecto queda presentado como análisis reproducible en GitHub y como pieza editorial en LinkedIn, manteniendo una narrativa visual orientada a patrones y contexto.",
      repoButton: "Ver repo",
      linkedinButton: "Leer en LinkedIn",
      signature: "Patrones Lab® · Generando conocimiento a partir de los datos · por Malcolm Di Pietro Cagliari",
      languageLabel: "Cambiar idioma",
      themeLabel: "Cambiar modo visual",
      pageAria: "Página de proyecto",
      galleryPanelAria: "Imagen principal del proyecto",
      galleryScrollAria: "Galería de imágenes con desplazamiento interno",
      infoPanelAria: "Información del proyecto",
      tagsAria: "Tecnologías y temas",
      linksAria: "Enlaces del proyecto",
      languageMenuAria: "Idiomas disponibles",
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
      back: "⮌ Back",
      nextProject: "Next ➜",
      nextProjectAria: "Go to next project",
      kicker: "Project 01 · Data analytics",
      title: "Balearic Islands Flight Analysis",
      status: "✅ published",
      dataLabel: "data:",
      lead: "Analysis of air traffic in Spain using public AENA data, focused on volume, airport-level patterns and differences across traffic categories.",
      tagPython: "Python",
      tagDataStorytelling: "Data storytelling",
      tagAviation: "Aviation",
      tagDataAnalysis: "Data analysis",
      tagBI: "BI",
      techPython: "Python",
      techPandas: "Pandas",
      techPlotly: "Plotly",
      techSPSS: "SPSS",
      techScikitLearn: "Scikit-learn",
      techLookerStudio: "Looker Studio",
      techPowerBI: "Power BI",
      techAirbnb: "Airbnb",
      techDataAnalysis: "Data analysis",
      techAviation: "Aviation",
      techBI: "BI",
      techDataScience: "Data science",
      techClassification: "Classification",
      techClustering: "Clustering",
      techDashboard: "Dashboard",
      techDataStorytelling: "Data storytelling",
      techDBSCAN: "DBSCAN",
      techFraud: "Fraud",
      techFootball: "Football",
      techGeospatial: "Geospatial",
      techKMeans: "K-means",
      techKNN: "KNN",
      techMachineLearning: "Machine Learning",
      techUnsupervisedModel: "Unsupervised model",
      techSupervisedModel: "Supervised model",
      techLogisticRegression: "Logistic regression",
      techTaxi: "Taxi",
      techSheetTitle: "TECHNICAL SHEET",
      techSheetAria: "Project technical sheet",
      techSheetButton: "View technical sheet",
      techSheetButtonAria: "View project technical sheet",
      techTypeLabel: "Analysis type",
      techTypeValue: "Data analytics · Visualization · Data storytelling",
      techSourceLabel: "Data source",
      techSourceValue: "Public AENA data",
      techPeriodLabel: "Period analyzed",
      techPeriodValue: "2024 and 2025",
      techUnitLabel: "Unit of analysis",
      techUnitValue: "Air passengers linked to Balearic Islands airports",
      techTerritoryLabel: "Territory",
      techTerritoryValue: "Palma de Mallorca · Ibiza · Menorca",
      techVariablesLabel: "Main variables",
      techVariablesValue: "Passengers, airports, countries, cities, airlines, months and season",
      techAxisLabel: "Analysis axis",
      techAxisValue: "Air demand, seasonality, international connectivity and territorial distribution of traffic in the Balearic Islands",
      techTreatmentLabel: "Treatment applied",
      techTreatmentValue: "Data cleaning, temporal aggregation, comparison between seasons, analysis by airports, countries, cities and airlines",
      techToolsLabel: "Tools",
      techToolsValue: "Python · Pandas · Plotly · GitHub",
      techOutputLabel: "Project output",
      techOutputValue: "Analytical notebook, charts and LinkedIn publication",
      techStatusLabel: "Status",
      techStatusValue: "Published",
      questionTitle: "CONTEXT AND OBJECTIVE",
      questionText: "What patterns appear in Balearic Islands air traffic when the data is read by airport, volume and traffic type?",
      approachTitle: "DATA AND DIAGNOSIS",
      approachOne: "Public AENA data is used as the main source.",
      approachTwo: "Airports, categories and traffic variations are compared.",
      approachThree: "Visuals are built to turn operational data into a territorial reading.",
      outputTitle: "DELIVERY AND LEARNING",
      outputText: "The project is presented as a reproducible analysis on GitHub and as an editorial piece on LinkedIn, with a visual narrative focused on patterns and context.",
      repoButton: "View repo",
      linkedinButton: "Read on LinkedIn",
      signature: "Patrones Lab® · Generating knowledge from data · by Malcolm Di Pietro Cagliari",
      languageLabel: "Change language",
      themeLabel: "Change visual mode",
      pageAria: "Project page",
      galleryPanelAria: "Project main image",
      galleryScrollAria: "Image gallery with internal scrolling",
      infoPanelAria: "Project information",
      tagsAria: "Technologies and topics",
      linksAria: "Project links",
      languageMenuAria: "Available languages",
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
      back: "⮌ Indietro",
      nextProject: "Avanti ➜",
      nextProjectAria: "Vai al progetto successivo",
      kicker: "Progetto 01 · Analisi dei dati",
      title: "Analisi del traffico aereo nelle Isole Baleari",
      status: "✅ pubblicato",
      dataLabel: "dati:",
      lead: "Analisi del traffico aereo in Spagna con dati pubblici AENA, con focus su volumi, pattern per aeroporto e differenze tra categorie di traffico.",
      tagPython: "Python",
      tagDataStorytelling: "Storytelling dei dati",
      tagAviation: "Aviazione",
      tagDataAnalysis: "Analisi dei dati",
      tagBI: "BI",
      techPython: "Python",
      techPandas: "Pandas",
      techPlotly: "Plotly",
      techSPSS: "SPSS",
      techScikitLearn: "Scikit-learn",
      techLookerStudio: "Looker Studio",
      techPowerBI: "Power BI",
      techAirbnb: "Airbnb",
      techDataAnalysis: "Analisi dei dati",
      techAviation: "Aviazione",
      techBI: "BI",
      techDataScience: "Scienza dei dati",
      techClassification: "Classificazione",
      techClustering: "Clustering",
      techDashboard: "Dashboard",
      techDataStorytelling: "Storytelling dei dati",
      techDBSCAN: "DBSCAN",
      techFraud: "Frode",
      techFootball: "Calcio",
      techGeospatial: "Geospaziale",
      techKMeans: "K-means",
      techKNN: "KNN",
      techMachineLearning: "Machine Learning",
      techUnsupervisedModel: "Modello non supervisionato",
      techSupervisedModel: "Modello supervisionato",
      techLogisticRegression: "Regressione logistica",
      techTaxi: "Taxi",
      techSheetTitle: "SCHEDA TECNICA",
      techSheetAria: "Scheda tecnica del progetto",
      techSheetButton: "Vedi scheda tecnica",
      techSheetButtonAria: "Vedi la scheda tecnica del progetto",
      techTypeLabel: "Tipo di analisi",
      techTypeValue: "Analisi dei dati · Visualizzazione · Storytelling dei dati",
      techSourceLabel: "Fonte dei dati",
      techSourceValue: "Dati pubblici AENA",
      techPeriodLabel: "Periodo analizzato",
      techPeriodValue: "2024 e 2025",
      techUnitLabel: "Unità di analisi",
      techUnitValue: "Passeggeri aerei collegati agli aeroporti delle Baleari",
      techTerritoryLabel: "Territorio",
      techTerritoryValue: "Palma di Maiorca · Ibiza · Minorca",
      techVariablesLabel: "Variabili principali",
      techVariablesValue: "Passeggeri, aeroporti, Paesi, città, compagnie aeree, mesi e stagione",
      techAxisLabel: "Asse di analisi",
      techAxisValue: "Domanda aerea, stagionalità, connettività internazionale e distribuzione territoriale del traffico nelle Baleari",
      techTreatmentLabel: "Trattamento applicato",
      techTreatmentValue: "Pulizia dei dati, aggregazione temporale, confronto tra stagioni, analisi per aeroporti, Paesi, città e compagnie aeree",
      techToolsLabel: "Strumenti",
      techToolsValue: "Python · Pandas · Plotly · GitHub",
      techOutputLabel: "Output del progetto",
      techOutputValue: "Notebook analitico, grafici e pubblicazione su LinkedIn",
      techStatusLabel: "Stato",
      techStatusValue: "Pubblicato",
      questionTitle: "CONTESTO E OBIETTIVO",
      questionText: "Quali pattern emergono nel traffico aereo delle Isole Baleari quando i dati vengono letti per aeroporto, volume e tipo di traffico?",
      approachTitle: "DATI E DIAGNOSI",
      approachOne: "I dati pubblici AENA sono usati come fonte principale.",
      approachTwo: "Si confrontano aeroporti, categorie e variazioni di traffico.",
      approachThree: "Si costruiscono visual per trasformare dati operativi in una lettura territoriale.",
      outputTitle: "CONSEGNA E APPRENDIMENTO",
      outputText: "Il progetto è presentato come analisi riproducibile su GitHub e come contenuto editoriale su LinkedIn, con una narrazione visuale orientata a pattern e contesto.",
      repoButton: "Vedi repo",
      linkedinButton: "Leggi su LinkedIn",
      signature: "Patrones Lab® · Generare conoscenza a partire dai dati · di Malcolm Di Pietro Cagliari",
      languageLabel: "Cambia lingua",
      themeLabel: "Cambia modalità visiva",
      pageAria: "Pagina del progetto",
      galleryPanelAria: "Immagine principale del progetto",
      galleryScrollAria: "Galleria di immagini con scorrimento interno",
      infoPanelAria: "Informazioni sul progetto",
      tagsAria: "Tecnologie e temi",
      linksAria: "Link del progetto",
      languageMenuAria: "Lingue disponibili",
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

  if(window.PATRONES_PROJECT_DETAIL_TEXT && window.PATRONES_PROJECT_DETAIL_TEXT.es && window.PATRONES_PROJECT_DETAIL_TEXT.en && window.PATRONES_PROJECT_DETAIL_TEXT.it){
    text = window.PATRONES_PROJECT_DETAIL_TEXT;
  }

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

  function setBackLinkLabel(el, value){
    var label = value.replace(/^[^\s]+\s*/, "");
    el.innerHTML = '<span class="back-arrow-desktop" aria-hidden="true">⮌</span><span class="back-arrow-mobile" aria-hidden="true">➜</span><span class="back-label"></span>';
    var labelNode = el.querySelector(".back-label");
    if(labelNode) labelNode.textContent = label;
    el.setAttribute("aria-label", label);
  }

  function applyLanguage(lang){
    lang = validLanguage(lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if(text[lang][key]){
        if(key === "back" && el.classList.contains("back-to-projects")){
          setBackLinkLabel(el, text[lang][key]);
        }else{
          el.textContent = text[lang][key];
        }
      }
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

      popover.addEventListener("pointerenter", function(event){
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
    setupTechPopover();
  });
})();
