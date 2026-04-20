function initializeMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!hamburgerBtn || !mobileMenu) {
    return;
  }

  function setMenuState(isOpen) {
    if (isOpen) {
      mobileMenu.removeAttribute('hidden');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      return;
    }

    mobileMenu.setAttribute('hidden', '');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn.addEventListener('click', function () {
    const isOpen = !mobileMenu.hasAttribute('hidden');

    setMenuState(!isOpen);
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setMenuState(false);
    });
  });
}

function initializeActiveNavigation() {
  const currentPath = normalizeNavigationPath(window.location.pathname);
  const navLinks = document.querySelectorAll('.menue a, .mobile-menu a');

  navLinks.forEach(function (link) {
    const linkPath = normalizeNavigationPath(link.getAttribute('href'));

    if (linkPath === currentPath) {
      link.classList.add('is-active');
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initializeMobileMenu();
    initializeActiveNavigation();
  });
} else {
  initializeMobileMenu();
  initializeActiveNavigation();
}
