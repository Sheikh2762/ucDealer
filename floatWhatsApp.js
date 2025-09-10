// wa.js - behavior for floating WhatsApp assistant

(function () {
  const container = document.getElementById('waAssistant');
  if (!container) return;

  // Read phone and default message from data attributes
  const phone = (container.dataset.phone || '').replace(/\D/g, '');
  const defaultMessage = container.dataset.message || 'Hello!';

  const waButton = document.getElementById('waButton');
  const waCard = document.getElementById('waCard');
  const waTooltip = document.getElementById('waTooltip');
  const waOpen = document.getElementById('waOpen');
  const waClose = document.getElementById('waClose');
  const quickBtns = waCard.querySelectorAll('.wa-quick-btn');

  // Utility: detect mobile for opening behavior
  function isMobile() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod|windows phone|mobile/i.test(ua);
  }

  // Build WA link (use wa.me for broad compatibility)
  function buildWAUrl(number, message) {
    if (!number) return 'https://web.whatsapp.com';
    const encoded = encodeURIComponent(message || '');
    if (isMobile()) {
      // open wa.me which will redirect to app if installed
      return `https://wa.me/${number}?text=${encoded}`;
    } else {
      return `https://web.whatsapp.com/send?phone=${number}&text=${encoded}`;
    }
  }

  // Toggle card visibility
  function showCard(show) {
    if (show) {
      waCard.classList.add('show');
      waCard.setAttribute('aria-hidden', 'false');
      // focus first quick btn
      setTimeout(() => waCard.querySelector('button')?.focus(), 120);
    } else {
      waCard.classList.remove('show');
      waCard.setAttribute('aria-hidden', 'true');
    }
  }

  // Open direct WhatsApp with message
  function openWhatsApp(message) {
    const url = buildWAUrl(phone, message || defaultMessage);
    // on mobile open in same tab to allow app redirect; on desktop new tab
    const target = isMobile() ? '_self' : '_blank';
    window.open(url, target, 'noopener,noreferrer');
  }

  // Button click: toggle card
  waButton.addEventListener('click', (e) => {
    e.stopPropagation();
    // if phone invalid: open card to show notice
    if (!phone || phone.length < 8) {
      waTooltip.textContent = 'Set your phone number in data-phone attribute';
      showCard(true);
      return;
    }
    showCard(!waCard.classList.contains('show'));
  });

  // Close button in card
  waClose.addEventListener('click', () => showCard(false));

  // Quick buttons behaviour
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.msg || defaultMessage;
      openWhatsApp(text);
      // optionally close card
      showCard(false);
    });
  });

  // Open button in footer
  waOpen.addEventListener('click', () => {
    openWhatsApp(defaultMessage);
    showCard(false);
  });

  // Click outside closes the card
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) showCard(false);
  });

  // Accessibility: keyboard open (Enter/Space)
  waButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      waButton.click();
    }
  });

  // Show small attention badge ring once after load (subtle)
  setTimeout(() => {
    waButton.animate([
      { transform: 'translateY(0) scale(1)' },
      { transform: 'translateY(-6px) scale(1.03)' },
      { transform: 'translateY(0) scale(1)' }
    ], { duration: 900, easing: 'ease-out' });
  }, 1000);

  // Optional: expose helper to update phone/message dynamically
  window.WA_Assistant = {
    setPhone: (num) => {
      const cleaned = (num || '').toString().replace(/\D/g, '');
      container.dataset.phone = cleaned;
    },
    setMessage: (msg) => {
      container.dataset.message = msg;
    },
    openDirect: (msg) => openWhatsApp(msg)
  };

})();
