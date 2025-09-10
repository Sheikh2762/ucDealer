/**************************************************************
     * WhatsApp Floating Assistant JS
     * - Edit phone & message via data attributes on #whatsappAssistant
     * - Automatically opens wa.me or whatsapp:// depending on device
     **************************************************************/
    (function(){
      const container = document.getElementById('whatsappAssistant');
      const phone = (container.dataset.phone || '').replace(/\D/g,''); // digits only
      const defaultMessage = container.dataset.message || 'Hello!';
      const waBtn = document.getElementById('waButton');
      const waCard = document.getElementById('waCard');
      const waOpenBtn = document.getElementById('waOpenBtn');
      const waCloseBtn = document.getElementById('waCloseBtn');
      const quickButtons = waCard.querySelectorAll('[data-quick]');
      const badge = document.getElementById('waBadge');

      // Small helper: encode message for URL
      function encodeMessage(text){ return encodeURIComponent(text); }

      // Detect mobile vs desktop
      function isMobile() {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        return /android|iphone|ipad|ipod|windows phone|mobile/i.test(ua);
      }

      // Build link (prefer whatsapp:// on mobile to open app, fallback to web)
      function buildWhatsAppLink(number, message) {
        if(!number) {
          // fallback: open chat to web.whatsapp.com (user can scan)
          return 'https://web.whatsapp.com';
        }
        const encoded = encodeMessage(message || '');
        if (isMobile()) {
          // try app link first
          return `https://wa.me/${number}?text=${encoded}`;
          // Note: using whatsapp:// directly may be blocked by browsers, wa.me is more reliable
        } else {
          return `https://web.whatsapp.com/send?phone=${number}&text=${encoded}`;
        }
      }

      // Open link in new tab (or same tab on mobile)
      function openWhatsApp(number, message) {
        const url = buildWhatsAppLink(number, message);
        // On mobile prefer opening in same tab to let OS redirect to app
        const target = isMobile() ? '_self' : '_blank';
        window.open(url, target, 'noopener,noreferrer');
      }

      // Toggle card
      function toggleCard(show) {
        if(show) {
          waCard.classList.add('show');
          // set focus for accessibility
          waCard.setAttribute('aria-hidden','false');
        } else {
          waCard.classList.remove('show');
          waCard.setAttribute('aria-hidden','true');
        }
      }

      // Button click opens the card (you can change to immediately open WA)
      waBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // if you want a simple direct-open behavior, replace toggleCard(true) with openWhatsApp(phone, defaultMessage)
        toggleCard(!waCard.classList.contains('show'));
      });

      // Close button
      waCloseBtn.addEventListener('click', () => toggleCard(false));

      // Quick reply buttons
      quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const quick = btn.dataset.quick || defaultMessage;
          openWhatsApp(phone, quick);
        });
      });

      // Go button opens WhatsApp with default message
      waOpenBtn.addEventListener('click', () => openWhatsApp(phone, defaultMessage));

      // Close the card when clicking outside
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) toggleCard(false);
      });

      // Optional: show badge after X seconds to draw attention
      setTimeout(() => {
        badge.style.display = 'inline-flex';
        // animate a little
        badge.animate([{ transform: 'scale(0.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-out' });
      }, 2000);

      // Optional: hide floating button on certain pages or when printed
      window.addEventListener('beforeprint', () => container.style.display = 'none');
      window.addEventListener('afterprint', () => container.style.display = '');

      // Accessibility: keyboard opening (Enter/Space) for the button
      waBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          waBtn.click();
        }
      });

      // Optional: hide on scroll down and show on scroll up (subtle)
      let lastScroll = window.scrollY;
      let hideTimeout;
      window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > lastScroll + 10) {
          // scrolling down => hide
          container.style.opacity = '0';
          container.style.pointerEvents = 'none';
        } else if (current < lastScroll - 10) {
          // scrolling up => show
          container.style.opacity = '1';
          container.style.pointerEvents = 'auto';
        }
        lastScroll = current;
        // ensure it reappears after no scrolling for a bit
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(()=>{ container.style.opacity='1'; container.style.pointerEvents='auto'; }, 600);
      });

      // Optional: keyboard shortcut (shift+/) to open assistant
      window.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === '/') {
          e.preventDefault();
          toggleCard(true);
          waCard.querySelector('button')?.focus();
        }
      });

      // Small safety: if phone seems invalid, change tooltip/warnings
      if(!phone || phone.length < 8) {
        console.warn('WhatsApp Assistant: phone number looks invalid. Set data-phone attribute with international number (no +).');
        document.getElementById('waTooltip').textContent = 'Set your phone number to enable WhatsApp chat';
      }

      // Expose function to update number/message dynamically (optional)
      window.WA_Assistant = {
        setPhone: (num) => { container.dataset.phone = num.replace(/\D/g,''); },
        setMessage: (msg) => { container.dataset.message = msg; }
      };

    })();
  