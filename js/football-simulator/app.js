(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('simulador');
  if (!root) return;
  const language = document.documentElement.lang.split('-')[0];
  const locale = language === 'es' ? 'es-AR' : language;
  const copy = window.FootballI18n[language] || window.FootballI18n.es;
  const t = (key, values = {}) => copy[key].replace(/\{(\w+)\}/g, (_, name) => values[name]);
  const crestBase = new URL('../../images/patrones/projects/modelo-binomial-probabilidades-goles/simulator/crests/', document.currentScript.src).href;
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const percentFormat = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });
  const percent = value => value > 0 && value < 0.0005 ? '<' + percentFormat.format(0.001) : percentFormat.format(value);
  const svgPercent = value => percent(value).replace('<', '&lt;');
  const advantageText = value => value.toFixed(1);
  const tooltipPercent = value => (value * 100).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
  const clubs = window.FootballClubs.map(club => ({ ...club, nombre: copy.clubNames?.[club.id] || club.nombre }));
  // Orden visual fijo aportado por el usuario. No interviene en el modelo.
  const clubOrder = ['arsenal','bayern','barcelona','city','madrid','psg','inter','liverpool','atletico','dortmund','villa','sporting','roma','united','brugge','como','porto','leipzig','galatasaray','betis','stuttgart','napoli','villarreal','lens','psv','bodo','lille','fenerbahce','slavia','feyenoord','viking','aek','shakhtar','lask','sabah','slovan'];
  const orderedClubs = clubOrder.map(id => clubs.find(club => club.id === id));
  function profile(id) {
    const club = clubs.find(club => club.id === id);
    return { club: id, n: Math.round(club.remates / club.partidos), p: Math.round(club.goles / club.remates * 10000) / 10000, adjusted: false };
  }
  const localityConfig = window.FootballLocality;
  const localityReference = localityConfig.referencias[localityConfig.referenciaInicial];
  const initialAdvantage = Math.round((localityReference.rematesLocales / localityReference.rematesVisitantes - 1) * 1000) / 10;
  const state = { a: profile('barcelona'), b: profile('psg'), mode: 'exact', selected: 0, locality: false, advantage: initialAdvantage };
  let results = {};
  let bins = [];
  let chartGeometry = {};

  function createClubs() {
    for (const team of ['a', 'b']) {
      $('clubs-' + team).innerHTML = orderedClubs.map(club => `<button type="button" class="club-button" data-team="${team}" data-club="${club.id}" aria-label="${club.nombre} ${team === 'a' ? t('asHome') : t('asAway')}" aria-pressed="false" title="${club.nombre}"><img src="${crestBase}${club.id}.png" width="72" height="72" alt=""><span>${club.nombre}</span></button>`).join('');
    }
  }

  const horizontalClubs = window.matchMedia('(max-width: 1200px)');
  function updateRail(team) {
    const list = $('clubs-' + team);
    const horizontal = horizontalClubs.matches;
    const position = horizontal ? list.scrollLeft : list.scrollTop;
    const maximum = horizontal ? list.scrollWidth - list.clientWidth : list.scrollHeight - list.clientHeight;
    document.querySelector(`.rail-scroll-start[data-rail="${team}"]`).hidden = position <= 1;
    document.querySelector(`.rail-scroll-end[data-rail="${team}"]`).hidden = maximum - position <= 1;
  }

  function initializeRails() {
    const observer = new ResizeObserver(() => ['a', 'b'].forEach(updateRail));
    for (const team of ['a', 'b']) {
      const list = $('clubs-' + team);
      list.addEventListener('scroll', () => updateRail(team), { passive: true });
      observer.observe(list);
      updateRail(team);
    }
    root.querySelectorAll('[data-rail]').forEach(button => button.addEventListener('click', () => {
      const list = $('clubs-' + button.dataset.rail);
      const horizontal = horizontalClubs.matches;
      const distance = (horizontal ? list.clientWidth : list.clientHeight) * 0.75 * Number(button.dataset.direction);
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      list.scrollBy(horizontal ? { left: distance, behavior } : { top: distance, behavior });
    }));
    horizontalClubs.addEventListener('change', () => ['a', 'b'].forEach(updateRail));
  }

  function syncControls(editing) {
    for (const team of ['a', 'b']) {
      const current = state[team];
      const club = clubs.find(item => item.id === current.club);
      const other = state[team === 'a' ? 'b' : 'a'];
      $('title-' + team).textContent = club ? club.nombre : t('chooseClub');
      $('parameters-' + team).hidden = !club;
      $('expectation-' + team).hidden = !club;
      $('prompt-' + team).hidden = Boolean(club);
      root.querySelectorAll(`[data-team="${team}"]`).forEach(button => {
        button.disabled = button.dataset.club === other.club;
        button.setAttribute('aria-pressed', String(button.dataset.club === current.club));
        button.title = clubs.find(item => item.id === button.dataset.club).nombre + (button.disabled ? ' · ' + t('otherSide') : '');
      });
      for (const type of ['n', 'p']) for (const id of [type + '-' + team, type + '-range-' + team]) {
        $(id).disabled = !club;
        if ($(id) !== editing) $(id).value = club ? (type === 'n' ? current.n : Number((current.p * 100).toFixed(2))) : ($(id).type === 'range' ? 0 : '');
      }
    }
    $('exact').setAttribute('aria-pressed', String(state.mode === 'exact'));
    $('atleast').setAttribute('aria-pressed', String(state.mode === 'atleast'));
  }

  function setClub(team, id) {
    const club = clubs.find(item => item.id === id);
    if (!club || state[team === 'a' ? 'b' : 'a'].club === id) return;
    if (club.goles / club.remates > 0.5) {
      $('input-status').textContent = `${club.nombre}: ${t('conversionLimit')}`;
      return;
    }
    state[team] = profile(id);
    $('input-status').textContent = '';
    root.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
    syncControls(); render();
  }

  function readInput(input, type, team, commit) {
    if (!state[team].club) return;
    const value = input.valueAsNumber;
    if (!Number.isFinite(value)) {
      input.setAttribute('aria-invalid', 'true');
      $('input-status').textContent = t('invalidNumber');
      if (commit) { syncControls(); input.removeAttribute('aria-invalid'); $('input-status').textContent = ''; }
      return;
    }
    input.removeAttribute('aria-invalid');
    const max = type === 'n' ? 40 : 50;
    let adjusted = Math.max(0, Math.min(max, value));
    adjusted = type === 'n' ? Math.round(adjusted) : Math.round(adjusted * 100) / 100;
    $('input-status').textContent = adjusted !== value ? t('rangeAdjusted', { value: adjusted, max, unit: type === 'n' ? t('shotsUnit') : ' %' }) : '';
    state[team][type] = type === 'p' ? adjusted / 100 : adjusted;
    state[team].adjusted = true;
    syncControls(!commit && adjusted === value && input.type === 'number' ? input : null);
    render();
  }

  function probability(team, k, cumulative) {
    return cumulative ? (results[team]?.tail[k] || 0) : (results[team]?.pmf[k] || 0);
  }

  function goalLabel(k) {
    if (k === 1) return t('goal');
    if (language === 'pl' && k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14)) return t('goalsFew');
    return t('goals');
  }

  function selectBin(k) {
    state.selected = k;
    const bin = bins.find(bin => bin.k === k);
    if (!bin) return;
    const grouped = state.mode === 'exact' && bin.tail;
    const cumulative = state.mode === 'atleast' || grouped;
    const description = `${t(cumulative ? 'atleast' : 'exact')} ${k}`;
    $('chart-selection').textContent = `${description[0].toUpperCase() + description.slice(1)} ${goalLabel(k)}: ${t('home')} ${results.a ? percent(probability('a', k, cumulative)) : '—'} · ${t('away')} ${results.b ? percent(probability('b', k, cumulative)) : '—'}.`;
    root.querySelectorAll('[data-indicator]').forEach(line => { line.style.opacity = Number(line.dataset.indicator) === k ? '1' : '0'; });
    root.querySelectorAll('[data-point]').forEach(point => {
      const selected = Number(point.dataset.point) === k;
      point.setAttribute('r', selected ? '7.5' : '5.5');
      point.classList.toggle('is-selected', selected);
    });
    root.querySelectorAll('[data-goal]').forEach(hit => hit.setAttribute('aria-pressed', String(Number(hit.dataset.goal) === k)));
    const index = bins.findIndex(bin => bin.k === k);
    const { width, left, step } = chartGeometry;
    const x = left + step * (index + 0.5);
    // A dedicated band above the plot keeps the tooltip clear of both curves.
    const tx = Math.max(4, Math.min(width - 164, x - 80));
    $('chart-tooltip').setAttribute('transform', `translate(${tx} 5)`);
    $('tooltip-local').textContent = tooltipPercent(probability('a', k, cumulative));
    $('tooltip-away').textContent = tooltipPercent(probability('b', k, cumulative));
  }

  function bezierPath(points, top, bottom) {
    if (!points.length) return '';
    let path = `M${points[0].x} ${points[0].y}`;
    if (points.length === 1) return path;
    const slopes = points.slice(1).map((point, i) => (point.y - points[i].y) / (point.x - points[i].x));
    const directions = points.map((point, i) => {
      if (i === 0) return slopes[0];
      if (i === points.length - 1) return slopes[i - 1];
      const before = slopes[i - 1], after = slopes[i];
      if (before * after <= 0) return (before + after) / 2;
      return Math.sign(before) * Math.min(Math.abs((before + after) / 2), 2 * Math.abs(before), 2 * Math.abs(after));
    });
    for (let i = 1; i < points.length; i += 1) {
      const previous = points[i - 1], current = points[i];
      // El giro sigue la dirección vecina, sin imponer una meseta en cada máximo.
      const reach = (current.x - previous.x) * 0.3;
      const controlY = value => Math.max(top, Math.min(bottom, value));
      path += ` C${previous.x + reach} ${controlY(previous.y + directions[i - 1] * reach)} ${current.x - reach} ${controlY(current.y - directions[i] * reach)} ${current.x} ${current.y}`;
    }
    return path;
  }

  function chart() {
    const active = ['a', 'b'].filter(team => state[team].club);
    if (!active.length) {
      $('chart').innerHTML = '<div class="chart-empty"><span aria-hidden="true">⚽</span><p>' + t('empty') + '</p></div>';
      $('chart-selection').textContent = '';
      return;
    }
    const maxN = Math.max(...active.map(team => results[team].pmf.length - 1));
    const cumulative = state.mode === 'atleast';
    const end = Math.max(cumulative ? 1 : 0, Math.min(maxN, 10));
    bins = Array.from({ length: end + 1 }, (_, k) => ({ k, tail: k === 10 && maxN > 10 })).filter(bin => !cumulative || bin.k > 0);
    const values = bins.map(bin => ['a', 'b'].map(team => probability(team, bin.k, cumulative || bin.tail)));
    const max = Math.max(...values.flat());
    const ceiling = Math.min(1, Math.max(0.1, Math.ceil(max * 10) / 10));
    const width = Math.max(320, $('chart').clientWidth);
    const fitHeight = getComputedStyle($('chart')).getPropertyValue('--goal-chart-fit').trim() === '1';
    const height = fitHeight ? Math.max(230, $('chart').clientHeight) : Math.max(230, Math.min(290, width * 0.54));
    const left = 48, right = 16, top = 51, bottom = height - 55;
    const plotHeight = bottom - top;
    const step = (width - left - right) / bins.length;

    chartGeometry = { width, left, top, bottom, step, ceiling };
    const layout = bins.map(bin => bin.k).join(',') + ':' + width + ':' + height;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" data-layout="${layout}" viewBox="0 0 ${width} ${height}" role="group" aria-label="${t('chartGroup')}">`;
    const maximumPercent = Math.round(ceiling * 100);
    const tickStep = Math.ceil(maximumPercent / 4);
    const ticks = [];
    for (let value = 0; value < maximumPercent; value += tickStep) ticks.push(value);
    ticks.push(maximumPercent);
    for (const tick of ticks) {
      const y = bottom - tick / maximumPercent * plotHeight;
      svg += `<path class="gridline" d="M${left} ${y}H${width - right}"/><text class="axis-value" x="${left - 9}" y="${y + 4}" text-anchor="end">${tick}%</text>`;
    }
    svg += '<defs><linearGradient id="area-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--a)" stop-opacity=".26"/><stop offset="55%" stop-color="var(--a)" stop-opacity=".09"/><stop offset="100%" stop-color="var(--a)" stop-opacity="0"/></linearGradient><linearGradient id="area-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--b)" stop-opacity=".26"/><stop offset="55%" stop-color="var(--b)" stop-opacity=".09"/><stop offset="100%" stop-color="var(--b)" stop-opacity="0"/></linearGradient></defs>';
    const centerX = i => left + step * (i + 0.5);
    const pointY = value => bottom - value / ceiling * plotHeight;
    let areas = '', curves = '', points = '';
    for (const [j, team] of ['a', 'b'].entries()) {
      if (!results[team]) continue;
      const path = bezierPath(values.map((pair, i) => ({ x: centerX(i), y: pointY(pair[j]) })), top, bottom);
      areas += `<path class="goal-area" fill="url(#area-${team})" d="${path} L${centerX(values.length - 1)} ${bottom} L${centerX(0)} ${bottom} Z"/>`;
      curves += `<path class="goal-curve curve-${team}" d="${path}"/>`;
      values.forEach((pair, i) => {
        points += `<circle class="goal-point point-${team}" data-point="${bins[i].k}" cx="${centerX(i)}" cy="${pointY(pair[j])}" r="5.5"/>`;
      });
    }
    svg += areas + curves + points;
    bins.forEach((bin, i) => {
      const center = centerX(i);
      const label = bin.tail ? '10+' : String(bin.k);
      const description = t(cumulative || bin.tail ? 'atleast' : 'exact');
      svg += `<path class="goal-indicator" data-indicator="${bin.k}" d="M${center} ${top}V${bottom}"/><text class="axis-value" x="${center}" y="${bottom + 22}" text-anchor="middle">${label}</text><rect class="hit" data-goal="${bin.k}" role="button" tabindex="0" aria-label="${description} ${bin.k} ${goalLabel(bin.k)}: ${t('home')} ${results.a ? svgPercent(values[i][0]) : t('unselected')}, ${t('away')} ${results.b ? svgPercent(values[i][1]) : t('unselected')}" x="${left + step * i}" y="${top}" width="${step}" height="${plotHeight + 28}"/>`;
    });
    svg += `<text x="${width - right}" class="x-axis-title" y="${height - 4}" text-anchor="end">${t('axis')}</text><g id="chart-tooltip" class="chart-tooltip" aria-hidden="true"><rect width="160" height="32" rx="5"/><text id="tooltip-local" class="tooltip-local" x="9" y="22"></text><text id="tooltip-away" class="tooltip-away" x="86" y="22"></text></g></svg>`;
    updateChartSvg(svg);
    $('chart-description').textContent = t(cumulative ? 'atleastDesc' : 'exactDesc');
    $('exact').setAttribute('aria-pressed', String(!cumulative));
    $('atleast').setAttribute('aria-pressed', String(cumulative));
    state.selected = Math.max(cumulative ? 1 : 0, Math.min(state.selected, end));
    selectBin(state.selected);
  }

  function updateChartSvg(markup) {
    const current = $('chart').querySelector('svg');
    const next = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
    // Retain geometry nodes for CSS transitions and keyboard focus when bins stay unchanged.
    if (current && current.dataset.layout === next.dataset.layout) {
      const oldNodes = current.querySelectorAll('*'), newNodes = next.querySelectorAll('*');
      if (oldNodes.length === newNodes.length) {
        oldNodes.forEach((node, index) => {
          const replacement = newNodes[index];
          for (const name of node.getAttributeNames()) if (!replacement.hasAttribute(name)) node.removeAttribute(name);
          for (const attribute of replacement.attributes) if (node.getAttribute(attribute.name) !== attribute.value) node.setAttribute(attribute.name, attribute.value);
          if (!node.children.length && node.textContent !== replacement.textContent) node.textContent = replacement.textContent;
        });
        return;
      }
    }
    $('chart').innerHTML = markup;
  }

  function matrix() {
    const ready = Boolean(results.a && results.b);
    $('match-summary').hidden = !ready;
    if (!ready) { $('matrix-body').innerHTML = ''; return; }
    const cells = window.FootballModel.scoreMatrix(results.a.pmf, results.b.pmf);
    const maximum = Math.max(...cells.flat());
    const match = window.FootballModel.outcomes(results.a.pmf, results.b.pmf);
    for (const key of ['home', 'draw', 'away']) {
      $('outcome-' + key).value = Math.round(match[key] * 100) + ' %';
      $('outcome-' + key).dataset.probability = match[key];
    }
    const label = k => k === 7 ? '7+' : k;
    const homeClub = clubs.find(c => c.id === state.a.club);
    const awayClub = clubs.find(c => c.id === state.b.club);
    $('matrix-caption').innerHTML = '<span><strong>' + t('rows') + ':</strong> ' + homeClub.nombre + '</span><span aria-hidden="true"> · </span><span><strong>' + t('columns') + ':</strong> ' + awayClub.nombre + '</span>';
    $('outcome-crest-home').src = crestBase + homeClub.id + '.png';
    $('outcome-crest-away').src = crestBase + awayClub.id + '.png';
    $('matrix-body').innerHTML = cells.map((row, i) => '<tr><th scope="row" data-matrix-row="' + i + '"><span>' + label(i) + '</span></th>' + row.map((value, j) => {
      const color = heatColor(value, maximum);
      const size = Math.sqrt(value / maximum);
      return `<td tabindex="${i === 0 && j === 0 ? 0 : -1}" data-row="${i}" data-col="${j}" style="background-color:${color.background};color:${color.text};--prob-size:${size}" data-probability="${value}" title="${t('home')} ${label(i)} · ${t('away')} ${label(j)}: ${Math.round(value * 100)} %"><span>${Math.round(value * 100)}%</span></td>`;
    }).join('') + '</tr>').join('');
    highlightMatrixCell(null);
  }

  function highlightMatrixCell(cell) {
    root.querySelectorAll('[data-matrix-row],[data-matrix-col]').forEach(header => {
      const active = cell && (header.dataset.matrixRow === cell.dataset.row || header.dataset.matrixCol === cell.dataset.col);
      header.classList.toggle('axis-active', Boolean(active));
    });
  }

  function heatColor(value, maximum) {
    const stops = [
      { at: 0, rgb: [17, 33, 58] },
      { at: 0.25, rgb: [32, 94, 114] },
      { at: 0.58, rgb: [29, 157, 136] },
      { at: 0.81, rgb: [149, 201, 79] },
      { at: 1, rgb: [223, 242, 90] }
    ];
    const t = Math.pow(value / maximum, 0.72);
    let upper = 1;
    while (upper < stops.length - 1 && t > stops[upper].at) upper += 1;
    const from = stops[upper - 1], to = stops[upper];
    const weight = (t - from.at) / (to.at - from.at);
    const rgb = from.rgb.map((channel, i) => Math.round(channel + (to.rgb[i] - channel) * weight));
    const linear = rgb.map(channel => { const v = channel / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    return { background: 'rgb(' + rgb.join(',') + ')', text: luminance > 0.179 ? '#000' : '#fff' };
  }

  function readAdvantage(commit) {
    const input = $('locality-percentage');
    const value = input.valueAsNumber;
    if (!Number.isFinite(value)) {
      input.setAttribute('aria-invalid', 'true');
      $('locality-status').textContent = t('invalidAdvantage');
      if (commit) { input.value = advantageText(state.advantage); input.removeAttribute('aria-invalid'); }
      return;
    }
    const adjusted = Math.round(Math.max(0, Math.min(40, value)) * 10) / 10;
    state.advantage = adjusted;
    input.removeAttribute('aria-invalid');
    if (commit || adjusted !== value) input.value = advantageText(adjusted);
    render();
    if (adjusted !== value) $('locality-status').textContent += ' ' + t('advantageAdjusted', { value: number.format(adjusted) });
  }

  function render() {
    results = {};
    const factors = state.locality ? window.FootballModel.localityFactors(1 + state.advantage / 100) : { home: 1, away: 1 };
    const limits = [];
    for (const team of ['a', 'b']) {
      const current = state[team];
      if (!current.club) continue;
      const factor = team === 'a' ? factors.home : factors.away;
      const effective = window.FootballModel.effectiveDistribution(current.n, current.p, factor);
      const pmf = effective.pmf;
      results[team] = { pmf, tail: window.FootballModel.tails(pmf) };
      $('xg-' + team).value = number.format(effective.shots * current.p);
      if (effective.limited) limits.push(`${t(team === 'a' ? 'home' : 'away')}: ${t('effectiveLimit')}`);
    }
    $('locality-status').textContent = limits.join(' ');
    matrix();
    chart();
  }

  $('locality-percentage').value = advantageText(initialAdvantage);
  $('locality-enabled').addEventListener('change', event => { state.locality = event.target.checked; render(); });
  $('locality-percentage').addEventListener('input', event => readAdvantage(!event.inputType));
  $('locality-percentage').addEventListener('blur', () => readAdvantage(true));
  createClubs();
  initializeRails();
  for (const team of ['a', 'b']) for (const type of ['n', 'p']) for (const id of [type + '-' + team, type + '-range-' + team]) {
    $(id).addEventListener('input', event => readInput(event.target, type, team, false));
    $(id).addEventListener('change', event => readInput(event.target, type, team, true));
    if ($(id).type === 'number') $(id).addEventListener('blur', event => readInput(event.target, type, team, true));
  }
  root.querySelectorAll('[data-club]').forEach(button => button.addEventListener('click', () => setClub(button.dataset.team, button.dataset.club)));
  function initializeScenario() {
    state.a = profile('barcelona'); state.b = profile('psg'); state.mode = 'exact'; state.selected = 0;
    state.locality = false; state.advantage = initialAdvantage;
    $('locality-enabled').checked = false;
    $('locality-percentage').value = advantageText(initialAdvantage);
    $('locality-status').textContent = '';
    $('input-status').textContent = '';
    root.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
    syncControls(); render();
  }
  $('swap-teams').addEventListener('click', () => {
    [state.a, state.b] = [state.b, state.a];
    $('input-status').textContent = '';
    root.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
    syncControls(); render();
  });
  for (const mode of ['exact', 'atleast']) $(mode).addEventListener('click', () => { state.mode = mode; syncControls(); chart(); });
  $('chart').addEventListener('click', event => { const hit = event.target.closest('[data-goal]'); if (hit) selectBin(Number(hit.dataset.goal)); });
  $('chart').addEventListener('pointermove', event => {
    const hit = event.target.closest('[data-goal]');
    if (hit && event.pointerType === 'mouse') selectBin(Number(hit.dataset.goal));
  });
  $('chart').addEventListener('keydown', event => {
    const hit = event.target.closest('[data-goal]');
    if (!hit) return;
    const k = Number(hit.dataset.goal);
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectBin(k); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const index = bins.findIndex(bin => bin.k === k);
      const next = bins[Math.max(0, Math.min(bins.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)))].k;
      selectBin(next); $('chart').querySelector(`[data-goal="${next}"]`).focus();
    }
  });
  const matrixTable = root.querySelector('.heatmap');
  matrixTable.addEventListener('pointerover', event => {
    if (event.pointerType === 'mouse') highlightMatrixCell(event.target.closest('td[data-row]'));
  });
  matrixTable.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') highlightMatrixCell(null);
  });
  matrixTable.addEventListener('click', event => highlightMatrixCell(event.target.closest('td[data-row]')));
  matrixTable.addEventListener('focusin', event => {
    const cell = event.target.closest('td[data-row]');
    if (!cell) return;
    matrixTable.querySelectorAll('td').forEach(td => { td.tabIndex = td === cell ? 0 : -1; });
    highlightMatrixCell(cell);
  });
  matrixTable.addEventListener('focusout', event => {
    if (!matrixTable.contains(event.relatedTarget)) highlightMatrixCell(null);
  });
  matrixTable.addEventListener('keydown', event => {
    const cell = event.target.closest('td[data-row]');
    if (!cell) return;
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const row = Math.max(0, Math.min(7, Number(cell.dataset.row) + move[0]));
    const col = Math.max(0, Math.min(7, Number(cell.dataset.col) + move[1]));
    matrixTable.querySelector(`[data-row="${row}"][data-col="${col}"]`).focus();
  });
  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(chart);
  });
  initializeScenario();
})();
