(function(){
  'use strict';
  window.addEventListener('DOMContentLoaded', function(){
    var simulator=document.getElementById('simulador');
    if(simulator && document.body.classList.contains('project21-detail-page')){
      var labels={
        es:['Ampliar simulador','Volver','Simulador de goles','Ampliar gráfico de goles','Ampliar mapa de marcadores y resultados','Mostrar todos los gráficos'],
        en:['Expand simulator','Back','Goal simulator','Expand goal chart','Expand score matrix and match outcomes','Show all charts'],
        it:['Ingrandisci simulatore','Indietro','Simulatore di gol','Ingrandisci grafico dei gol','Ingrandisci matrice e risultati','Mostra tutti i grafici'],
        fr:['Agrandir le simulateur','Retour','Simulateur de buts','Agrandir le graphique des buts','Agrandir la matrice des scores et les résultats','Afficher tous les graphiques'],
        de:['Simulator vergrößern','Zurück','Torsimulator','Torverteilung vergrößern','Ergebnismatrix und Spielausgang vergrößern','Alle Diagramme anzeigen'],
        pt:['Ampliar simulador','Voltar','Simulador de golos','Ampliar gráfico de golos','Ampliar marcadores e resultados do jogo','Mostrar todos os gráficos']
      };
      var copy=labels[document.documentElement.lang.split('-')[0]] || labels.es;
      var desktop=window.matchMedia('(min-width:1201px)');
      var parent=simulator.parentNode;
      var next=simulator.nextSibling;
      var scrollTop=0;
      var reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
      var dialog=document.createElement('dialog');
      dialog.id='project21-simulator-dialog';
      dialog.className='project21-simulator-dialog';
      dialog.setAttribute('aria-labelledby','project21-simulator-title');
      if(typeof dialog.showModal==='function'){
        var expandIcon='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>';
        var returnIcon='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 8h5V3m8 0v5h5M3 16h5v5m8 0v-5h5"/></svg>';
        var open=document.createElement('button');
        open.type='button';
        open.className='project21-expand-button';
        open.setAttribute('aria-haspopup','dialog');
        open.setAttribute('aria-controls',dialog.id);
        open.innerHTML=expandIcon;
        open.appendChild(document.createTextNode(copy[0]));
        var toolbar=document.createElement('div');
        toolbar.className='project21-simulator-toolbar';
        var title=document.createElement('span');
        title.id='project21-simulator-title';
        title.textContent=copy[2];
        var close=document.createElement('button');
        close.type='button';
        close.className='project21-restore-button';
        close.innerHTML=returnIcon;
        close.appendChild(document.createTextNode(copy[1]));
        close.autofocus=true;
        toolbar.append(title,close);
        var content=document.createElement('div');
        content.className='project21-simulator-content';
        dialog.append(toolbar,content);
        parent.insertBefore(open,simulator);
        document.body.appendChild(dialog);
        var controls=simulator.querySelector('.team-matchup');
        var controlsParent=controls.parentNode;
        var locality=simulator.querySelector('.locality-controls');
        var localityParent=locality.parentNode;
        var localityNext=locality.nextSibling;
        var dock=document.createElement('div');
        dock.className='project21-parameter-dock';
        var trigger=open;
        var closing=false;
        var graphButtons=[];

        function redraw(){window.dispatchEvent(new Event('resize'));}
        new ResizeObserver(function(){
          if(dialog.open && dialog.dataset.view==='curves') redraw();
        }).observe(simulator.querySelector('#chart'));
        function setView(view){
          dialog.dataset.view=view;
          graphButtons.forEach(function(button){
            var selected=button.dataset.focusView===view;
            var label=selected ? copy[5] : copy[button.dataset.focusView==='curves' ? 3 : 4];
            button.setAttribute('aria-pressed',String(selected));
            button.setAttribute('aria-label',label);
            button.title=label;
            button.innerHTML=selected ? returnIcon : expandIcon;
          });
          content.scrollTop=0;
          redraw();
        }
        function show(view,source){
          if(!desktop.matches) return;
          if(dialog.open){
            setView(dialog.dataset.view===view ? 'all' : view);
            return;
          }
          trigger=source;
          scrollTop=parent.scrollTop;
          controlsParent.insertBefore(dock,controls);
          dock.append(controls,locality);
          content.appendChild(simulator);
          setView(view);
          dialog.showModal();
          redraw();
          if(!reduceMotion.matches){
            dialog.animate([{opacity:0,transform:'translateY(10px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:190,easing:'cubic-bezier(.2,.8,.2,1)'});
          }
        }
        function hide(){
          if(!dialog.open || closing) return;
          if(reduceMotion.matches){dialog.close();return;}
          closing=true;
          dialog.getAnimations().forEach(function(animation){animation.cancel();});
          dialog.classList.add('is-closing');
          dialog.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.98)'}],{duration:150,easing:'ease-in'}).finished.catch(function(){}).then(function(){
            if(dialog.open) dialog.close();
          });
        }
        function addGraphButton(headingId,view,labelIndex){
          var heading=document.getElementById(headingId);
          var holder=document.createElement('div');
          holder.className='project21-chart-title';
          heading.replaceWith(holder);
          var button=document.createElement('button');
          button.type='button';
          button.className='project21-graph-expand';
          button.dataset.focusView=view;
          button.setAttribute('aria-label',copy[labelIndex]);
          button.setAttribute('aria-haspopup','dialog');
          button.setAttribute('aria-controls',dialog.id);
          button.setAttribute('aria-pressed','false');
          button.title=copy[labelIndex];
          button.innerHTML=expandIcon;
          holder.append(heading,button);
          graphButtons.push(button);
          button.addEventListener('click',function(){show(view,button);});
        }
        addGraphButton('chart-title','curves',3);
        addGraphButton('matrix-title','matrix',4);
        open.addEventListener('click',function(){show('all',open);});
        close.addEventListener('click',hide);
        dialog.addEventListener('cancel',function(event){
          event.preventDefault();
          hide();
        });
        dialog.addEventListener('close',function(){
          controlsParent.insertBefore(controls,dock);
          localityParent.insertBefore(locality,localityNext);
          dock.remove();
          parent.insertBefore(simulator,next);
          parent.scrollTop=scrollTop;
          closing=false;
          dialog.classList.remove('is-closing');
          setView('all');
          trigger.focus({preventScroll:true});
          redraw();
        });
        desktop.addEventListener('change',function(){
          if(!desktop.matches && dialog.open) dialog.close();
        });
      }
    }
    function renderProject21Math(){
      if(!window.katex) return false;
      document.querySelectorAll('.project21-detail-page .project-katex').forEach(function(element){
        window.katex.render(element.dataset.expression, element, {displayMode:true,throwOnError:false,strict:'ignore'});
      });
      return true;
    }
    if(renderProject21Math()) return;
    var attempts=0;
    var timer=setInterval(function(){
      attempts+=1;
      if(renderProject21Math() || attempts>=40) clearInterval(timer);
    },100);
  });
})();
