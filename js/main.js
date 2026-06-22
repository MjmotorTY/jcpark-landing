/* ══════════════════════════════
   GA4 Helper
══════════════════════════════ */
function trackEvent(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, Object.assign({ campaign: 'jcpark_2026_july' }, params));
  }
}

/* ══════════════════════════════
   Countdown Timer — 2026-07-31 23:59:59
══════════════════════════════ */
(function initCountdown() {
  var target  = new Date('2026-07-31T23:59:59+08:00').getTime();
  var elDays  = document.getElementById('cd-days');
  var elHrs   = document.getElementById('cd-hours');
  var elMins  = document.getElementById('cd-minutes');
  var elSecs  = document.getElementById('cd-seconds');
  var wrapper = document.getElementById('countdown-wrapper');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      wrapper.innerHTML = '<p class="countdown-expired">活動已結束，感謝您的參與</p>';
      return;
    }
    elDays.textContent = Math.floor(diff / 86400000);
    elHrs.textContent  = pad(Math.floor((diff % 86400000) / 3600000));
    elMins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    elSecs.textContent = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
})();

/* ══════════════════════════════
   CTA Booking Buttons
══════════════════════════════ */
(function initBookingTracking() {
  document.querySelectorAll('[id^="btn-booking"], [id^="btn-offer-gift"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('click_trial_booking', {
        button_location: el.dataset.location || 'unknown'
      });
    });
  });
})();

/* ══════════════════════════════
   Offer Block Tracking
   (試乘禮、購車優惠、車型卡)
══════════════════════════════ */
(function initOfferTracking() {
  var offerIds = ['offer-drive', 'offer-purchase', 'btn-offer-purchase',
                  'purchase-zs', 'purchase-hs', 'purchase-g50'];

  offerIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function() {
      trackEvent('click_offer', { offer_type: id });
    });
  });

  document.querySelectorAll('.model-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var name = card.querySelector('.model-name');
      trackEvent('click_offer', { offer_type: 'model_' + (name ? name.textContent.trim() : 'unknown') });
    });
  });
})();

/* ══════════════════════════════
   Gift Screen (賞車禮區塊曝光)
══════════════════════════════ */
(function initGiftTracking() {
  var offerGift = document.getElementById('offer-gift');
  if (!offerGift) return;

  var fired = false;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !fired) {
        fired = true;
        trackEvent('show_gift_screen', { gift_name: 'jcpark_july_gift' });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(offerGift);
})();

/* ══════════════════════════════
   Call Buttons
══════════════════════════════ */
(function initCallTracking() {
  document.querySelectorAll('[id^="btn-call"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('click_call', { phone_number: '033566616' });
    });
  });
})();

/* ══════════════════════════════
   Navigation Button
══════════════════════════════ */
(function initNavTracking() {
  var btn = document.getElementById('btn-nav');
  if (btn) {
    btn.addEventListener('click', function() {
      trackEvent('click_navigation', { map_provider: 'google' });
    });
  }
})();

/* ══════════════════════════════
   Scroll Depth
══════════════════════════════ */
(function initScrollDepth() {
  var milestones = [25, 50, 75, 100];
  var fired = {};

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var el = document.documentElement;
      var scrollH = (el.scrollHeight - el.clientHeight);
      var pct = scrollH > 0 ? Math.round((el.scrollTop / scrollH) * 100) : 0;
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
   Time on Page
══════════════════════════════ */
(function initTimeOnPage() {
  var start = Date.now();
  window.addEventListener('pagehide', function() {
    trackEvent('time_on_page', { seconds_on_page: Math.round((Date.now() - start) / 1000) });
  });
})();
