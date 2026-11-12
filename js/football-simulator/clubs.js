// Editá solo partidos, remates y goles: son TOTALES acumulados, no promedios.
// Actualizá también FootballDataDate cuando cambies los datos.
// Conservá id y nombre. Usá números sin comillas y mantené las comas.
// Fuente: https://querostats.com/en/ranking/uefa.champions/shots
// Fuente: https://querostats.com/en/ranking/uefa.champions/goals
// Champions 2026/27, fase de liga. Consulta: 06/11/2026, tras la jornada 4.
// La página calcula remates/partido, goles/partido y goles/remates automáticamente.
window.FootballDataDate = "06/11/2026";
window.FootballClubs = [
  {"id":"aek","nombre":"AEK Atenas","partidos":4,"remates":51,"goles":5},
  {"id":"arsenal","nombre":"Arsenal","partidos":4,"remates":68,"goles":8},
  {"id":"villa","nombre":"Aston Villa","partidos":4,"remates":71,"goles":12},
  {"id":"atletico","nombre":"Atlético de Madrid","partidos":4,"remates":39,"goles":4},
  {"id":"dortmund","nombre":"Borussia Dortmund","partidos":4,"remates":64,"goles":7},
  {"id":"barcelona","nombre":"Barcelona","partidos":4,"remates":80,"goles":14},
  {"id":"bayern","nombre":"Bayern Múnich","partidos":4,"remates":82,"goles":12},
  {"id":"bodo","nombre":"Bodø/Glimt","partidos":4,"remates":33,"goles":4},
  {"id":"brugge","nombre":"Club Brugge","partidos":4,"remates":53,"goles":11},
  {"id":"como","nombre":"Como","partidos":4,"remates":54,"goles":19},
  {"id":"fenerbahce","nombre":"Fenerbahçe","partidos":4,"remates":58,"goles":6},
  {"id":"feyenoord","nombre":"Feyenoord","partidos":4,"remates":40,"goles":4},
  {"id":"galatasaray","nombre":"Galatasaray","partidos":4,"remates":38,"goles":8},
  {"id":"inter","nombre":"Inter de Milán","partidos":4,"remates":75,"goles":8},
  {"id":"lask","nombre":"LASK Linz","partidos":4,"remates":63,"goles":10},
  {"id":"leipzig","nombre":"RB Leipzig","partidos":4,"remates":58,"goles":5},
  {"id":"lens","nombre":"Lens","partidos":4,"remates":77,"goles":4},
  {"id":"lille","nombre":"Lille","partidos":4,"remates":34,"goles":4},
  {"id":"liverpool","nombre":"Liverpool","partidos":4,"remates":84,"goles":14},
  {"id":"city","nombre":"Manchester City","partidos":4,"remates":76,"goles":12},
  {"id":"united","nombre":"Manchester United","partidos":4,"remates":58,"goles":8},
  {"id":"napoli","nombre":"Napoli","partidos":4,"remates":44,"goles":6},
  {"id":"psg","nombre":"PSG","partidos":4,"remates":94,"goles":20},
  {"id":"porto","nombre":"FC Porto","partidos":4,"remates":49,"goles":6},
  {"id":"psv","nombre":"PSV Eindhoven","partidos":4,"remates":66,"goles":3},
  {"id":"betis","nombre":"Real Betis","partidos":4,"remates":71,"goles":8},
  {"id":"madrid","nombre":"Real Madrid","partidos":4,"remates":74,"goles":13},
  {"id":"roma","nombre":"AS Roma","partidos":4,"remates":55,"goles":10},
  {"id":"slovan","nombre":"Slovan Bratislava","partidos":4,"remates":32,"goles":1},
  {"id":"sabah","nombre":"Sabah FK","partidos":4,"remates":53,"goles":4},
  {"id":"shakhtar","nombre":"Shakhtar Donetsk","partidos":4,"remates":46,"goles":4},
  {"id":"slavia","nombre":"Slavia Praga","partidos":4,"remates":69,"goles":5},
  {"id":"sporting","nombre":"Sporting CP","partidos":4,"remates":46,"goles":8},
  {"id":"stuttgart","nombre":"VfB Stuttgart","partidos":4,"remates":64,"goles":7},
  {"id":"viking","nombre":"Viking FK","partidos":4,"remates":48,"goles":9},
  {"id":"villarreal","nombre":"Villarreal","partidos":4,"remates":58,"goles":8}
];
