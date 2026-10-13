// The proposed site and its alternative: everything that depends on "today", in Prague time.
// Opening hours come from cafeadastra.cz (Po–St 11–22, Čt–Pá 11–23, So 10–23, Ne zavřeno) and
// are always live. The preview only carries one week of the lunch menu, 12.–16. 10. 2026
// (src/data/tydenni-menu.json): on those days the pages show that day's dishes as today's. On any
// other day the static HTML stays as it is: no old week, a line that this week's menu comes once
// the café publishes it, and dishes from the all-day menu.
(function () {
  var hours = { 0: null, 1: [11, 22], 2: [11, 22], 3: [11, 22], 4: [11, 23], 5: [11, 23], 6: [10, 23] };
  var names = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
  var months = [
    'ledna',
    'února',
    'března',
    'dubna',
    'května',
    'června',
    'července',
    'srpna',
    'září',
    'října',
    'listopadu',
    'prosince',
  ];
  var week = ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16'];
  // Per day: the soup, then the two main dishes, each [name, allergens, price].
  var dishes = [
    [
      ['Zelňačka s klobásou', '1, 7', 45],
      ['150 g Grilovaný tuňák s květákovým pyré a pečenou brokolicí, bylinkový dip', '1, 4, 7', 189],
      ['150 g Kuřecí závitek plněný sušenými rajčaty, pečené brambory a pepřová omáčka', '1, 3, 7', 179],
    ],
    [
      ['Mrkvová se zázvorem', '7', 45],
      ['150 g Holandský řízek s máslovou bramborovou kaší, kyselá okurka', '1, 3, 7', 179],
      ['300 g Špagety s drcenými rajčaty, lilkem a bazalkou, sypané tvrdým sýrem', '1, 3, 7', 169],
    ],
    [
      ['Bramboračka s houbami', '1, 3, 7', 45],
      ['150 g Srbské žebírko s hráškovou rýží', '', 179],
      ['Smažený camembert a šťouchané brambory s cibulkou', '1, 3, 7', 169],
    ],
    [
      ['Francouzská cibulačka se sýrem a krutony', '1, 3, 7', 45],
      ['150 g Steak z lososa na dušeném smetanovém špenátu a baby brambory', '1, 7', 189],
      ['150 g Grilovaná vepřová panenka a bramborové noky s houbami', '1, 3, 7', 179],
    ],
    [
      ['Krůtí vývar s masem a kapáním', '1, 3, 7', 45],
      ['150 g Hovězí guláš s houskovým knedlíkem, zdobený cibulkou', '1, 3, 7', 189],
      ['Wrap plněný ledovým salátem, fazolemi, čedarem a rukola s cherry rajčaty', '1, 7', 169],
    ],
  ];
  // "v pondělí", "ve středu": the day a closed café opens next.
  var onDay = ['v neděli', 'v pondělí', 'v úterý', 've středu', 've čtvrtek', 'v pátek', 'v sobotu'];

  var p = {};
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(new Date())
    .forEach(function (x) {
      p[x.type] = x.value;
    });
  var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday];
  var ymd = p.year + '-' + p.month + '-' + p.day;
  var h = +p.hour + +p.minute / 60;
  var open = hours[wd];
  var day = +p.day,
    month = +p.month;

  var set = function (key, text) {
    document.querySelectorAll('[data-d="' + key + '"]').forEach(function (el) {
      el.textContent = text;
    });
  };
  set('name', names[wd]);
  set('name-lc', names[wd].toLowerCase());
  set('date', day + '. ' + months[month - 1]);
  set('short', day + '. ' + month + '.');
  set('today', 'Dnes, ' + names[wd].toLowerCase() + ' ' + day + '. ' + month + '.');
  set('hours', open ? open[0] + '–' + open[1] : 'zavřeno');

  var state;
  if (!open) state = 'dnes zavřeno';
  else if (h < open[0]) state = 'otevíráme v ' + open[0] + '.00';
  else if (h < open[1]) state = 'otevřeno do ' + open[1] + '.00';
  else state = 'dnes už zavřeno';
  set('state', state);

  // The short live line on the homepage: "Teď otevřeno · do 23:00" / "Teď zavřeno · otevíráme v 11:00".
  var now;
  if (open && h >= open[0] && h < open[1]) now = 'Teď otevřeno · do ' + open[1] + ':00';
  else if (open && h < open[0]) now = 'Teď zavřeno · otevíráme v ' + open[0] + ':00';
  else
    for (var k = 1; k < 8; k++) {
      var next = hours[(wd + k) % 7];
      if (!next) continue;
      now = 'Teď zavřeno · otevíráme ' + (k === 1 ? 'zítra' : onDay[(wd + k) % 7]) + ' v ' + next[0] + ':00';
      break;
    }
  set('now', now);
  document.querySelectorAll('[data-open-now]').forEach(function (el) {
    el.classList.toggle('is-open', !!(open && h >= open[0] && h < open[1]));
  });

  // The 24-hour bar: today's opening as a band, "now" as a line, and the time left.
  document.querySelectorAll('[data-daybar]').forEach(function (bar) {
    var band = bar.querySelector('[data-open]'),
      now = bar.querySelector('[data-now]'),
      label = bar.querySelector('[data-nowlab]'),
      left = bar.querySelector('[data-left]');
    now.hidden = false;
    now.style.left = (h / 24) * 100 + '%';
    label.textContent = 'teď ' + +p.hour + '.' + p.minute;
    bar.classList.toggle('late', h > 16);
    if (!open) {
      band.hidden = true;
      left.textContent = 'Dnes zavřeno';
      return;
    }
    band.style.left = (open[0] / 24) * 100 + '%';
    band.style.width = ((open[1] - open[0]) / 24) * 100 + '%';
    if (h < open[0]) left.textContent = 'Otevíráme v ' + open[0] + '.00';
    else if (h < open[1]) {
      var m = Math.round((open[1] - h) * 60);
      left.textContent = 'Otevřeno ještě ' + Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
    } else left.textContent = 'Dnes už zavřeno';
  });

  // Today's row in a list of opening hours.
  document.querySelectorAll('[data-hours-day]').forEach(function (el) {
    el.classList.toggle('today', +el.dataset.hoursDay === wd);
  });

  // Events that already took place drop out of the programme; today's event, if any, is
  // "tonight" (shown in the evening look).
  var tonight;
  document.querySelectorAll('[data-event]').forEach(function (el) {
    if (el.dataset.event < ymd) el.hidden = true;
    if (el.dataset.event === ymd && !tonight) tonight = el;
  });
  document.querySelectorAll('[data-tonight]').forEach(function (el) {
    if (!tonight) return;
    var title = tonight.querySelector('h3').textContent.trim();
    el.textContent = 'Dnes večer: ' + title + (tonight.dataset.cas ? ', ' + tonight.dataset.cas : '') + '.';
  });

  // The lunch menu: only during its own week can it be "today's".
  var i = week.indexOf(ymd);
  if (i < 0) return;
  document.querySelectorAll('[data-menu-today]').forEach(function (el) {
    el.hidden = false;
  });
  document.querySelectorAll('[data-menu-week]').forEach(function (el) {
    el.hidden = true;
  });
  document.querySelectorAll('[data-dish]').forEach(function (el) {
    var dish = dishes[i][+el.dataset.dish];
    el.querySelector('[data-name]').textContent = dish[0];
    var al = el.querySelector('[data-al]');
    if (al) {
      al.textContent = dish[1] ? 'Alergeny ' + dish[1] : '';
      al.hidden = !dish[1];
    }
    var price = el.querySelector('[data-price]');
    if (price) price.textContent = dish[2] + ' Kč';
  });
  document.querySelectorAll('[data-weekday]').forEach(function (el) {
    var n = +el.dataset.weekday;
    el.classList.toggle('today', n === i);
    el.classList.toggle('past', n < i);
    var tag = el.querySelector('[data-today-tag]');
    if (tag) tag.textContent = n === i ? 'Dnes' : '';
  });
})();
