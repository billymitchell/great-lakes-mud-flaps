const navigationItems = [
  { href: 'products.html', label: 'Products & Services' },
  { href: 'about.html', label: 'About GLMF' },
  { href: 'quote.html', label: 'Get A Quote' }
];

function renderNavigationLinks(linkClass) {
  return navigationItems.map(function (item) {
    return '<li><a class="' + linkClass + '" data-nav-link href="' + item.href + '">' + item.label + '</a></li>';
  }).join('');
}

function renderSiteChrome() {
  const headerMarkup = [
    '<a class="skip-link" href="#main-content">Skip to content</a>',
    '<header class="site-header">',
    '  <div class="container site-header__container">',
    '    <a href="index.html" class="site-brand__link" aria-label="Great Lakes Mud Flaps home">',
    '      <img src="images/glmf-header-logo.svg" alt="Great Lakes Mud Flaps" class="logo">',
    '    </a>',
    '    <nav class="site-nav" aria-label="Primary">',
    '      <ul class="site-nav__list">',
             renderNavigationLinks('site-nav__link'),
    '      </ul>',
    '      <button class="hamburger" type="button" data-nav-toggle aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">',
    '        <span class="bar"></span>',
    '        <span class="bar"></span>',
    '        <span class="bar"></span>',
    '      </button>',
    '      <div class="mobile-menu" id="mobileMenu" data-mobile-menu hidden>',
    '        <ul class="mobile-menu__list">',
             renderNavigationLinks('mobile-menu__link'),
    '        </ul>',
    '      </div>',
    '    </nav>',
    '  </div>',
    '</header>'
  ].join('');

  const footerMarkup = [
    '<footer class="site-footer">',
    '  <picture class="site-footer__road-wrap">',
    '    <source srcset="images/optimized/footer-road.webp" type="image/webp">',
    '    <img src="images/optimized/footer-road.jpg" alt="" class="site-footer__road" width="3840" height="814" loading="lazy" decoding="async">',
    '  </picture>',
    '  <div class="container site-footer__container">',
    '    <address class="site-footer__column">',
    '      <p>3201 Haggerty Hwy</p>',
    '      <p>Commerce, MI 48390</p>',
    '    </address>',
    '    <div class="site-footer__column site-footer__column--brand">',
    '      <a href="index.html" class="site-footer__logo-link" aria-label="Great Lakes Mud Flaps home">',
    '        <img src="images/glmf-footer-logo.svg" alt="Great Lakes Mud Flaps" class="site-footer__logo">',
    '      </a>',
    '    </div>',
    '    <address class="site-footer__column site-footer__column--end">',
    '      <a class="site-footer__contact-link" href="tel:+18107151424">(810) 715-1424</a>',
    '      <a class="site-footer__contact-link" href="mailto:sales@greatlakesmudflaps.com">sales@greatlakesmudflaps.com</a>',
    '    </address>',
    '  </div>',
    '</footer>'
  ].join('');

  document.querySelectorAll('[data-site-header]').forEach(function (placeholder) {
    if (!placeholder.dataset.rendered) {
      placeholder.innerHTML = headerMarkup;
      placeholder.dataset.rendered = 'true';
    }
  });

  document.querySelectorAll('[data-site-footer]').forEach(function (placeholder) {
    if (!placeholder.dataset.rendered) {
      placeholder.innerHTML = footerMarkup;
      placeholder.dataset.rendered = 'true';
    }
  });
}

function initializeMobileMenu() {
  const hamburgerBtn = document.querySelector('[data-nav-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const siteNav = document.querySelector('.site-nav');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!hamburgerBtn || !mobileMenu || !siteNav) {
    return;
  }

  function setMenuState(isOpen) {
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !isOpen;
    document.body.classList.toggle('menu-open', isOpen);

    if (isOpen) {
      const firstLink = mobileMenu.querySelector('a');

      if (firstLink) {
        firstLink.focus();
      }
    }
  }

  hamburgerBtn.addEventListener('click', function () {
    setMenuState(mobileMenu.hidden);
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setMenuState(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !mobileMenu.hidden) {
      setMenuState(false);
      hamburgerBtn.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (!mobileMenu.hidden && !siteNav.contains(event.target)) {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && !mobileMenu.hidden) {
      setMenuState(false);
    }
  });
}

function initializeActiveNavigation() {
  const currentPath = normalizeNavigationPath(window.location.pathname);
  const navLinks = document.querySelectorAll('[data-nav-link]');

  navLinks.forEach(function (link) {
    const linkPath = normalizeNavigationPath(link.getAttribute('href'));

    if (linkPath === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
  });
}

function normalizeNavigationPath(path) {
  if (!path || path === '/') {
    return 'index.html';
  }

  const normalizedPath = path.split('?')[0].split('#')[0];
  const segments = normalizedPath.split('/').filter(Boolean);
  const fileName = segments[segments.length - 1];

  if (!fileName) {
    return 'index.html';
  }

  return fileName;
}

function initializeFileDropzones() {
  const fileDropzones = document.querySelectorAll('[data-file-dropzone]');

  fileDropzones.forEach(function (dropzone) {
    const input = dropzone.querySelector('input[type="file"]');
    const trigger = dropzone.querySelector('[data-file-trigger]');
    const status = dropzone.querySelector('.file-dropzone-status');
    let dragDepth = 0;

    if (!input || !trigger || !status) {
      return;
    }

    dropzone.tabIndex = 0;
    dropzone.setAttribute('role', 'button');

    function updateFileStatus(fileList) {
      if (!fileList || !fileList.length) {
        status.textContent = 'No file selected';
        dropzone.classList.remove('has-file');
        return;
      }

      status.textContent = fileList.length === 1
        ? 'Selected file: ' + fileList[0].name
        : fileList.length + ' files selected';
      dropzone.classList.add('has-file');
    }

    function openFilePicker() {
      input.click();
    }

    function preventDefaults(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      openFilePicker();
    });

    dropzone.addEventListener('click', function (event) {
      if (event.target === input || event.target.closest('[data-file-trigger]')) {
        return;
      }

      openFilePicker();
    });

    dropzone.addEventListener('keydown', function (event) {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === dropzone) {
        event.preventDefault();
        openFilePicker();
      }
    });

    input.addEventListener('change', function () {
      updateFileStatus(input.files);
    });

    dropzone.addEventListener('dragenter', function (event) {
      preventDefaults(event);
      dragDepth += 1;
      dropzone.classList.add('is-dragover');
    });

    dropzone.addEventListener('dragover', function (event) {
      preventDefaults(event);

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }

      dropzone.classList.add('is-dragover');
    });

    dropzone.addEventListener('dragleave', function (event) {
      preventDefaults(event);
      dragDepth = Math.max(0, dragDepth - 1);

      if (dragDepth === 0) {
        dropzone.classList.remove('is-dragover');
      }
    });

    dropzone.addEventListener('drop', function (event) {
      const droppedFiles = event.dataTransfer ? event.dataTransfer.files : null;

      preventDefaults(event);
      dragDepth = 0;
      dropzone.classList.remove('is-dragover');

      if (!droppedFiles || !droppedFiles.length) {
        return;
      }

      try {
        input.files = droppedFiles;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (error) {
        updateFileStatus(droppedFiles);
      }
    });

    updateFileStatus(input.files);
  });
}

function initializeRecaptchaForms() {
  const recaptchaForms = document.querySelectorAll('.contact-form[data-recaptcha-site-key]');
  const placeholderSiteKey = 'YOUR_RECAPTCHA_SITE_KEY';

  recaptchaForms.forEach(function (form) {
    const container = form.querySelector('[data-recaptcha-container]');
    const message = form.querySelector('[data-recaptcha-message]');
    const siteKey = (form.dataset.recaptchaSiteKey || '').trim();
    let widgetId = null;
    let renderAttempts = 0;
    let renderScheduled = false;

    if (!container || !message) {
      return;
    }

    function setMessage(text, tone) {
      message.textContent = text;
      message.classList.remove('is-error', 'is-success');

      if (tone) {
        message.classList.add('is-' + tone);
      }
    }

    function scheduleRender() {
      if (renderScheduled) {
        return;
      }

      renderScheduled = true;

      window.setTimeout(function () {
        renderScheduled = false;
        renderWidget();
      }, 300);
    }

    function renderWidget() {
      if (widgetId !== null) {
        return;
      }

      if (!siteKey || siteKey === placeholderSiteKey) {
        setMessage('Replace the reCAPTCHA site key in quote.html to enable spam protection.', 'error');
        return;
      }

      if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
        renderAttempts += 1;

        if (renderAttempts > 20) {
          setMessage('reCAPTCHA could not load. Check your connection and privacy settings.', 'error');
          return;
        }

        scheduleRender();
        return;
      }

      widgetId = window.grecaptcha.render(container, {
        sitekey: siteKey,
        theme: 'dark',
        size: window.matchMedia('(max-width: 480px)').matches ? 'compact' : 'normal',
        callback: function () {
          setMessage('reCAPTCHA verified.', 'success');
        },
        'expired-callback': function () {
          setMessage('reCAPTCHA expired. Please complete it again.', 'error');
        },
        'error-callback': function () {
          setMessage('reCAPTCHA encountered an error. Please retry.', 'error');
        }
      });
    }

    form.addEventListener('submit', function (event) {
      if (!siteKey || siteKey === placeholderSiteKey) {
        event.preventDefault();
        setMessage('Replace the reCAPTCHA site key in quote.html before using this form live.', 'error');
        return;
      }

      if (!window.grecaptcha || widgetId === null) {
        event.preventDefault();
        setMessage('reCAPTCHA is still loading. Please wait a moment and try again.', 'error');
        renderWidget();
        return;
      }

      if (!window.grecaptcha.getResponse(widgetId)) {
        event.preventDefault();
        setMessage('Please complete the reCAPTCHA before sending your request.', 'error');
      }
    });

    renderWidget();
  });
}

function initializeSite() {
  renderSiteChrome();
  initializeActiveNavigation();
  initializeMobileMenu();
  initializeFileDropzones();
  initializeRecaptchaForms();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSite);
} else {
  initializeSite();
}
