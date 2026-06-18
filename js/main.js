/* ══════════════════════════════
   GA4 Helper
══════════════════════════════ */
function trackEvent(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, Object.assign({ campaign: 'jcpark_2026_july' }, params));
  }
}

/* ══════════════════════════════
   Countdown Timer
   Target: 2026-07-31 23:59:59 (Asia/Taipei)
══════════════════════════════ */
(function initCountdown() {
  var target = new Date('2026-07-31T23:59:59+08:00').getTime();

  var elDays    = document.getElementById('cd-days');
  var elHours   = document.getElementById('cd-hours');
  var elMinutes = document.getElementById('cd-minutes');
  var elSeconds = document.getElementById('cd-seconds');
  var wrapper   = document.getElementById('countdown-wrapper');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var now = Date.now();
    var diff = target - now;

    if (diff <= 0) {
      wrapper.innerHTML = '<p class="countdown-expired">活動已結束，感謝您的參與</p>';
      return;
    }

    var days    = Math.floor(diff / 86400000);
    var hours   = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    elDays.textContent    = days;
    elHours.textContent   = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ══════════════════════════════
   Car Model Tabs
══════════════════════════════ */
(function initTabs() {
  var tabs  = document.querySelectorAll('.tab-btn');
  var cards = document.querySelectorAll('.model-card');

  tabs.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.dataset.model;

      tabs.forEach(function(t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      cards.forEach(function(c) { c.classList.remove('active'); });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById('model-' + target).classList.add('active');

      trackEvent('click_offer', { offer_type: 'model_tab_' + target });
    });
  });
})();

/* ══════════════════════════════
   Gift Reveal
══════════════════════════════ */
(function initGiftReveal() {
  var btn     = document.getElementById('gift-btn');
  var content = document.getElementById('gift-content');
  if (!btn || !content) return;

  var revealed = false;

  btn.addEventListener('click', function() {
    var isOpen = content.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    content.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen && !revealed) {
      revealed = true;
      trackEvent('show_gift_screen', { gift_name: 'jcpark_july_gift_set' });
    }
  });
})();

/* ══════════════════════════════
   CTA Button Tracking
══════════════════════════════ */
(function initCTATracking() {
  /* Booking buttons */
  document.querySelectorAll('[id^="btn-booking"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('click_trial_booking', {
        button_location: el.dataset.location || 'unknown'
      });
    });
  });

  /* Call buttons */
  document.querySelectorAll('[id^="btn-call"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('click_call', { phone_number: '03XXXXXXXX' });
    });
  });

  /* Navigation button */
  var btnNav = document.getElementById('btn-nav');
  if (btnNav) {
    btnNav.addEventListener('click', function() {
      trackEvent('click_navigation', { map_provider: 'google' });
    });
  }
})();

/* ══════════════════════════════
   Scroll Depth Tracking
══════════════════════════════ */
(function initScrollDepth() {
  var milestones = [25, 50, 75, 100];
  var fired = {};

  function getScrollPercent() {
    var el   = document.documentElement;
    var body = document.body;
    var scrollTop  = el.scrollTop  || body.scrollTop;
    var scrollH    = (el.scrollHeight || body.scrollHeight) - el.clientHeight;
    return scrollH > 0 ? Math.round((scrollTop / scrollH) * 100) : 0;
  }

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var pct = getScrollPercent();
      milestones.forEach(function(m) {
        if (!fired[m] && pct >= m) {
          fired[m] = true;
          trackEvent('scroll_depth', { depth_percent: m });
        }
      });
      ticking = false;
    });
  }, { passive: true });
})();

/* ══════════════════════════════
   Time on Page (beforeunload)
══════════════════════════════ */
(function initTimeOnPage() {
  var start = Date.now();
  window.addEventListener('pagehide', function() {
    var seconds = Math.round((Date.now() - start) / 1000);
    trackEvent('time_on_page', { seconds_on_page: seconds });
  });
})();
