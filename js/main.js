/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'pianob-milano',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si chiama (380 432 9559) o si prenota su yhop
      message: '',
      ids: [],
    },
    /* Google (28/9/2026): il locale dal lunedì al giovedì 18–1, venerdì e sabato 18–1:30, domenica chiuso (la chiusura
       oltre la mezzanotte si scrive 25:00 / 25:30: il plumbing la gestisce come «coda» della sera prima) */
    hours: {
      0: [],
      1: [['18:00', '25:00']],
      2: [['18:00', '25:00']],
      3: [['18:00', '25:00']],
      4: [['18:00', '25:00']],
      5: [['18:00', '25:30']],
      6: [['18:00', '25:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1120,
    EN: {
      "m.salta": "Skip to the flowchart",
      "m.top": "Piano B, back to the top",
      "m.nav": "The questions of the flowchart",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.capitoli": "The questions",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.sete": "Thirsty?",
      "n.fame": "Hungry?",
      "n.partita": "Match?",
      "n.tavoli": "Tables",
      "n.asporto": "Takeaway",
      "n.serate": "Nights",
      "n.dove": "Where",
      "n.recensioni": "Reviews",
      "v.sete": "The taps",
      "v.fame": "The kitchen",
      "v.partita": "Two big screens",
      "v.tavoli": "Book a table",
      "v.asporto": "The fridge and the four-pack",
      "v.serate": "Breweries and birthdays",
      "v.recensioni": "Who chose Piano B",
      "v.dove": "Address and hours",
      "t.chiama": "Call",
      "h.targa": "Craft beer pub with kitchen · Via Moncucco 26, Milan",
      "h.titolo": "Your Piano&nbsp;B.",
      "h.lede": "Beer on tap, in cans and in bottles, “constantly rotating, just so you never get tired of the usual beer”. And a kitchen of fried bites and burgers. (In Italian, <i>piano B</i> means plan B.)",
      "h.chiama": "Call",
      "h.lista": "Tonight’s beer list",
      "h.strada": "Where we are",
      "h.dal": "the first day",
      "h.google": "on Google · 595 reviews",
      "h.cap": "Either way.",
      "h.rifai": "Run the plan again",
      "f.titolo": "The Plan B diagram",
      "f.desc": "A pipe diagram: from the Plan A keg the beer runs down into a valve asking “Working?”. Two pipes come out of the valve, “yes” and “no”: the no takes a long detour through a coil, but both end in the same copper letter B, which lights up.",
      "f.pianoa": "PLAN A",
      "f.funziona": "WORKING?",
      "f.si": "YES",
      "f.no": "NO",
      "d.inizio": "What’s the plan tonight?",
      "d.istruzioni": "A flowchart to decide: at each question, yes or no. Yes goes right, no goes down to the next valve.",
      "d.si": "Yes",
      "d.no": "No",
      "d.fine": "End: Piano B.",
      "c1.q": "Thirsty?",
      "c1.t": "Twelve taps and a hand pump.",
      "c1.p1": "The list keeps changing: Italian and foreign beers, from pils to porter, each time “a few new ones along with some absolute certainties”. If you can’t choose, ask at the bar.",
      "c1.p2": "And then the fridge: cans and bottles to look at one by one, to drink here or take home.",
      "c1.f1": "12 taps + 1 hand pump",
      "c1.f2": "Cans and bottles in the fridge",
      "c1.f3": "Brewery nights",
      "c1.cta": "Tonight’s beer list",
      "c1.cap1": "The taps, with the house handles.",
      "c1.cap2": "You can also order from your table.",
      "c2.q": "Hungry?",
      "c2.t": "Fried bites and burgers without equal.",
      "c2.p1": "The kitchen stays open until midnight, until 12:30 am on Fridays and Saturdays. Burgers, sandwiches and pinsa, arrosticini (the lamb skewers of Abruzzo), boards, and fried food to share: fries, nachos, fried bites.",
      "c2.p2": "For parties there is the Birramisù, made for you and your celebrations: by reservation only.",
      "c2.f1": "Kitchen until midnight",
      "c2.f2": "Friday and Saturday until 12:30 am",
      "c3.q": "Is there a match on?",
      "c3.t": "Two big screens.",
      "c3.p1": "Matches are on two big screens, with a beer in hand and the kitchen open. For the big nights, better book.",
      "c4.q": "A big group?",
      "c4.t": "Book a table.",
      "c4.p1": "Inside the room, outside the tables under the portico. You can also order and pay from your table: just scan the code with your phone.",
      "c4.p2": "For a birthday, a team dinner or a night out with colleagues, book online or call.",
      "c4.cta": "Book",
      "c4.cap1": "The portico on Via Moncucco, at night.",
      "c4.cap2": "Every table has its own code.",
      "c5.q": "To take away?",
      "c5.t": "The fridge and the four-pack.",
      "c5.p1": "The cans and bottles in the fridge go home with you: four in the carrier with the yellow sticker.",
      "c5.p2": "And the kitchen also does takeaway and delivery.",
      "c5.cap1": "The fridges.",
      "c5.cap2": "The four-pack.",
      "c5.f1": "Cans and bottles to take away",
      "c5.f2": "The four-pack",
      "c5.f3": "Kitchen: takeaway and delivery",
      "c6.q": "What’s new?",
      "c6.t": "The nights.",
      "c6.p1": "Every now and then a brewery comes with its beers and puts them on tap for a night. Then the tastings, St Patrick’s Day, the pub’s birthday. And VFX, a New Zealand IPA made together with the Wild Raccoon brewery.",
      "c6.p2": "The dates go up on Instagram.",
      "c6.cta": "Follow @piano_bir",
      "c6.cap1": "The fifth birthday.",
      "c7.q": "None of the above?",
      "c7.t": "Come anyway.",
      "c7.p1": "Since 15 September 2017 we have been under the portico of Via Moncucco 26, three hundred metres from the Famagosta metro stop. Come and see us at least once: you might really find your Piano B.",
      "c7.cit": "«Decisamente un ottimo piano A.» <span class=\"cit-tr\">— “Definitely a great plan A.”</span>",
      "c7.cap1": "The blackboard from the first day.",
      "c7.cap2": "The shutter, when we’re closed.",
      "a.spine": "The taps at the bar, with black and gold handles bearing the Piano B logo.",
      "a.pinte": "Two amber pints on the table, one with the Piano B logo, next to the red card for ordering from the table.",
      "a.hamburger": "A burger with melted cheese, bacon, tomato and lettuce on a slate, on the yellow placemat with the logo.",
      "a.patatine": "Fries in a paper tray on the yellow placemat with the drawn hops.",
      "a.arrosticini": "Arrosticini on the grill, lined up on their wooden skewers.",
      "a.coccio": "The terracotta pot with “Arrosticini” written by hand, where the skewers go.",
      "a.portico": "The portico at night: the string lights, the red window with the Piano B logo lit up and the round sign.",
      "a.tavolo": "The orange card of table 10B: “Order and pay from here”.",
      "a.frigo": "The three fridges of cans and bottles, with black tops and the Piano B logo lit up.",
      "a.cartone": "The black four-can carrier with the yellow Piano B sticker, next to the glass and the coaster with the logo.",
      "a.compleanno": "A copper-coloured balloon shaped like a 5 in front of the Piano B sign: the fifth birthday.",
      "a.lavagna": "The blackboard behind the bar: “15 September 2017, Welcome to Piano B”, with the copper tap tower in front.",
      "a.serranda": "The painted shutter with green hops, wheat, a beer mug and the words Piano B.",
      "a.bancone": "The black bar with the Piano B logo lit up, the tap tower and the shelves of glasses.",
      "r.t": "Who chose Piano&nbsp;B.",
      "r.voto": "on Google · 595 reviews",
      "r.google": "on Google",
      "r.nota": "From the Google reviews, as they were written (in Italian).",
      "w.t": "Where and when.",
      "w.mezzi": "Under the portico. The M2 metro at Famagosta is three hundred metres away; buses 95, 46, 71 and 59 stop nearby, and the NM2 at night. Parking in the area is easy.",
      "w.orari": "Opening hours",
      "w.locale": "Pub",
      "w.cucina": "Kitchen",
      "w.tel": "Phone",
      "w.strada": "Directions",
      "w.mappa": "Map: Piano B, Via Moncucco 26, Milan",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "q.t": "Questions",
      "q.1": "Can I book?",
      "q.1r": "Yes: online, from the Book button, or by phone: +39 380 432 9559.",
      "q.2": "Until what time can I eat?",
      "q.2r": "The kitchen closes at midnight Monday to Thursday, at 12:30 am on Fridays and Saturdays. The pub closes at 1 am, at 1:30 am on Fridays and Saturdays.",
      "q.3": "Which beers are on tonight?",
      "q.3r": "The tap list keeps changing: tonight’s is online, from the “Tonight’s beer list” button.",
      "q.4": "Can I watch the match?",
      "q.4r": "Yes, on two big screens.",
      "q.5": "Can I take things away?",
      "q.5r": "Yes: cans and bottles from the fridge, and the kitchen for takeaway and delivery.",
      "q.6": "On Sundays?",
      "q.6r": "Closed on Sundays. Monday to Saturday we open at 6 pm.",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · photos from the Google listing (by the pub, by Glovo and by customers), reviews from Google, their words from Google, Facebook and Instagram (September 2026). The pipe diagram is drawn.",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PIANO B — «Il vostro Piano B.» ══════════
     La pagina è il diagramma di flusso della serata: un solo tubo, sette valvole; il sì entra nel serbatoio della risposta,
     il no scende alla valvola dopo. Qualunque cosa rispondi, finisci al Piano B.
     la FIRMA — l'impianto del piano: dal fusto PIANO A la birra scende nella valvola FUNZIONA?; il volantino esita e poi
     gira di un raggio (72°: con cinque raggi è di nuovo la posizione dell'HTML, niente scatto alla fine); la birra si
     divide nei due tubi insieme, il sì arriva subito, il no fa il giro della serpentina; tutti e due finiscono nella B di
     rame, e le lampadine si accendono in fila dalla bocca d'entrata di ciascun tubo (il sì l'asta, il no le pance).
     Stato finale = l'HTML/SVG (tubi pieni, B accesa). Senza JS e con reduced-motion: lo stato finale. L'attesa è la
     classe firma-attesa dell'head (tubi vuoti, lampadine spente, via CSS), tolta dall'head dopo 2,5 s se il codice non
     arriva. Un rAF a tempo: la firma non dipende da GSAP. I dati vengono da _pbm_impianto.mjs. */
  var DATI = {"tubi":{"p0":{"L":50},"si":{"L":182},"no":{"L":688.5}},"tempi":{"volantino":[250,1050],"p0":950,"p0Fine":1106,"siFine":1675,"noFine":3258,"passoLampada":90,"fine":4718},"lampade":[{"ramo":"si","t":1675},{"ramo":"si","t":1765},{"ramo":"si","t":1855},{"ramo":"si","t":1945},{"ramo":"no","t":3258},{"ramo":"no","t":3438},{"ramo":"no","t":3348},{"ramo":"no","t":3528},{"ramo":"no","t":3618},{"ramo":"no","t":3708},{"ramo":"no","t":3798},{"ramo":"no","t":3888},{"ramo":"no","t":3978},{"ramo":"no","t":4068}]};
  var figuraI = document.getElementById('impianto');
  var svgI = figuraI && figuraI.querySelector('.impianto__svg');
  var TUBI = ['p0', 'si', 'no'];
  var birre = {}, schiume = {};
  TUBI.forEach(function (id) { birre[id] = svgI && svgI.querySelector('#birra-' + id); schiume[id] = svgI && svgI.querySelector('#schiuma-' + id); });
  var volantino = svgI && svgI.querySelector('#volantino');
  var lampadeEl = svgI ? [].slice.call(svgI.querySelectorAll('.lampada')) : [];
  var faccia = svgI && svgI.querySelector('.lettera__faccia');
  var rifai = document.getElementById('rifaiPiano');
  var TI = DATI.tempi;
  var VCX = volantino ? volantino.getAttribute('data-cx') : '0', VCY = volantino ? volantino.getAttribute('data-cy') : '0';
  var faseI = 'fatta', rafI = 0, guardiaI = 0, larghezzaAvvio = 0;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var hex = function (h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; };
  var mix = function (a, b, t) { return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')'; };
  var SPENTA = hex('#6E5238'), BIANCA = hex('#FFFFFF'), ACCESA = hex('#FFF1C4');

  /* la birra in un tubo: il tratto pieno avanza da t0 a t1, la schiuma sta sulla testa */
  function flusso(id, t0, t1, t) {
    var el = birre[id], L = DATI.tubi[id].L, u = c01((t - t0) / (t1 - t0));
    el.style.strokeDasharray = L + ' ' + L;
    el.style.strokeDashoffset = (L * (1 - u)).toFixed(2);
    var sc = schiume[id];
    if (!sc) return;
    if (u > 0 && u < 1) {
      var p = el.getPointAtLength(L * u);
      sc.setAttribute('cx', p.x.toFixed(1)); sc.setAttribute('cy', p.y.toFixed(1));
      sc.style.opacity = '1';
    } else sc.style.opacity = '0';
  }
  /* il volantino: esita avanti e indietro, poi gira di un raggio (72°) e si ferma */
  function mettiVolantino(t) {
    var a0 = TI.volantino[0], a1 = TI.volantino[1], a = 0;
    if (t > a0 && t < a1) {
      var u = (t - a0) / (a1 - a0);
      a = u < 0.62 ? 34 * Math.sin(u / 0.62 * Math.PI * 2) * (1 - u / 0.62 * 0.4) : 72 * (1 - Math.pow(1 - (u - 0.62) / 0.38, 3));
    } else if (t >= a1) a = 72;
    volantino.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' ' + VCX + ' ' + VCY + ')');
  }
  /* le lampadine: ognuna al suo tempo, un lampo bianco e poi il giallo caldo; la faccia della B si scalda con loro */
  function mettiLampade(t) {
    var accese = 0;
    for (var i = 0; i < lampadeEl.length; i++) {
      var g = lampadeEl[i], u = t < 0 ? 0 : c01((t - DATI.lampade[i].t) / 200);
      var alone = g.querySelector('.lampada__alone'), vetro = g.querySelector('.lampada__vetro'), rifl = g.querySelector('.lampada__riflesso');
      alone.style.opacity = u.toFixed(3);
      vetro.style.fill = u <= 0 ? mix(SPENTA, SPENTA, 0) : (u < 0.4 ? mix(SPENTA, BIANCA, u / 0.4) : mix(BIANCA, ACCESA, (u - 0.4) / 0.6));
      rifl.style.opacity = (0.35 + 0.55 * u).toFixed(3);
      accese += u;
    }
    if (faccia) faccia.style.filter = 'brightness(' + (0.7 + 0.3 * accese / lampadeEl.length).toFixed(3) + ')';
  }
  function chiudiImpianto() {
    cancelAnimationFrame(rafI); rafI = 0;
    clearTimeout(guardiaI);
    TUBI.forEach(function (id) {
      if (birre[id]) { birre[id].style.removeProperty('stroke-dasharray'); birre[id].style.removeProperty('stroke-dashoffset'); }
      if (schiume[id]) schiume[id].style.removeProperty('opacity');
    });
    if (volantino) volantino.removeAttribute('transform');
    lampadeEl.forEach(function (g) { [].forEach.call(g.querySelectorAll('circle'), function (c) { c.style.removeProperty('opacity'); c.style.removeProperty('fill'); }); });
    if (faccia) faccia.style.removeProperty('filter');
    if (figuraI) figuraI.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseI = 'fatta';
    if (rifai) rifai.disabled = false;
  }
  function avviaImpianto() {
    /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: prima i tubi vuoti e le lampadine spente in linea,
       poi via la classe */
    TUBI.forEach(function (id) { flusso(id, 1, 2, 0); });
    mettiVolantino(0);
    mettiLampade(-1);
    root.classList.remove('firma-attesa');
    faseI = 'corre'; figuraI.setAttribute('data-firma', 'corre');
    larghezzaAvvio = window.innerWidth;
    if (rifai) rifai.disabled = true;
    var t0 = null;
    function fotogramma(ts) {
      rafI = 0;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      mettiVolantino(t);
      flusso('p0', TI.p0, TI.p0Fine, t);
      flusso('si', TI.p0Fine, TI.siFine, t);
      flusso('no', TI.p0Fine, TI.noFine, t);
      mettiLampade(t);
      if (t >= TI.fine) { chiudiImpianto(); return; }
      rafI = requestAnimationFrame(fotogramma);
    }
    clearTimeout(guardiaI);
    /* se il rAF si ferma (scheda in background) la pagina va comunque allo stato finale */
    guardiaI = setTimeout(chiudiImpianto, TI.fine + 2000);
    rafI = requestAnimationFrame(fotogramma);
  }
  function inVistaImpianto() {
    if (!svgI) return false;
    var r = svgI.getBoundingClientRect(), vh = window.innerHeight || 800;
    return r.top < vh * 0.85 && r.bottom > vh * 0.2;
  }

  /* l'indice della testata segna la domanda in cui ti trovi */
  var linkIndice = [].slice.call(document.querySelectorAll('#mainNav a'));
  var casi = linkIndice.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaIndice() {
    var y = (document.getElementById('testata') || { offsetHeight: 64 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < casi.length; i++) { if (casi[i] && casi[i].getBoundingClientRect().top <= y) ora = i; }
    linkIndice.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickIndice = 0;
  window.addEventListener('scroll', function () {
    if (tickIndice) return;
    tickIndice = requestAnimationFrame(function () { tickIndice = 0; aggiornaIndice(); });
  }, { passive: true });
  aggiornaIndice();

  /* lo stato degli orari anche in «Dove e quando», col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(copiaStato).observe(root, { attributes: true, attributeFilter: ['lang'] });

  if (figuraI && svgI && lampadeEl.length === DATI.lampade.length && volantino) {
    try { clearTimeout(window.__attesaImpianto); } catch (e) {}
    window.__impianto = {
      stato: function () { return { fase: faseI, trasformazione: volantino.getAttribute('transform') || '' }; },
      tempi: TI,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una domanda (#fame): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaImpianto();
    /* perché la firma è partita o no (lo legge il check) */
    window.__impianto.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgI.getBoundingClientRect().top, vh: window.innerHeight };
    if (!daFare || ancora || !inVista) chiudiImpianto();
    else avviaImpianto();
    /* un resize chiude la firma solo se cambia la LARGHEZZA: sul telefono arrivano resize della sola altezza (la barra
       del browser che si nasconde) e uno a vuoto subito dopo il caricamento, che la chiudevano appena partita (#228) */
    window.addEventListener('resize', function () { if (faseI === 'corre' && Math.abs(window.innerWidth - larghezzaAvvio) > 1) chiudiImpianto(); });
    if (rifai) rifai.addEventListener('click', function () { if (faseI === 'fatta' && !reducedMotion) avviaImpianto(); });
  }
})();
