// =============================================
//   ANNIVERSARY SCRAPBOOK — Navigation & FX
// =============================================

const TOTAL_PAGES = 23;
let currentPage = 1;

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  showPage(1);
  initKeyboardNav();
  initSwipeNav();
  initPhotoUploads();
  initEnvelopes();
  initSoundMood();
});

// ── Page Navigation ──
function showPage(n) {
  const pages = document.querySelectorAll('.scrapbook-page');
  pages.forEach(p => p.classList.remove('active'));

  const target = document.getElementById(`page-${n}`);
  if (target) {
    target.classList.add('active');
    // Re-trigger animation
    target.style.animation = 'none';
    target.offsetHeight; // reflow
    target.style.animation = '';
  }

  currentPage = n;
  updateNav();
  updateCounter();

  // Scroll to top of scrapbook
  const sb = document.getElementById('scrapbook');
  if (sb) sb.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function nextPage() {
  if (currentPage < TOTAL_PAGES) showPage(currentPage + 1);
}

function prevPage() {
  if (currentPage > 1) showPage(currentPage - 1);
}

function updateNav() {
  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-next');
  if (prev) prev.disabled = currentPage === 1;
  if (next) next.disabled = currentPage === TOTAL_PAGES;
}

function updateCounter() {
  const counter = document.getElementById('page-counter');
  if (counter) counter.textContent = `${currentPage} of ${TOTAL_PAGES}`;
}

// ── Keyboard Navigation ──
function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage();
  });
}

// ── Swipe Navigation (mobile) ──
function initSwipeNav() {
  let startX = 0;
  let startY = 0;

  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) nextPage();
      else prevPage();
    }
  }, { passive: true });
}

// ── Photo Upload Placeholders ──
function initPhotoUploads() {
  document.querySelectorAll('.photo-placeholder').forEach(placeholder => {
    placeholder.style.cursor = 'pointer';
    placeholder.title = 'Click to upload photo';

    placeholder.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const img = document.createElement('img');
          img.src = ev.target.result;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.display = 'block';
          placeholder.replaceWith(img);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  });
}

// ── Envelope Open/Close ──
function initEnvelopes() {
  document.querySelectorAll('.envelope-interactive').forEach(env => {
    env.addEventListener('click', () => {
      env.classList.toggle('open');
    });
  });
}

// ── Subtle ambient mood ──
function initSoundMood() {
  // Subtle parallax on mouse move for cover page
  const coverPage = document.getElementById('page-1');
  if (!coverPage) return;

  coverPage.addEventListener('mousemove', e => {
    const rect = coverPage.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;

    const polaroid = coverPage.querySelector('.polaroid-wrapper');
    if (polaroid) {
      polaroid.style.transform = `translate(${cx * 8}px, ${cy * 6}px) rotate(-3deg)`;
    }
  });

  coverPage.addEventListener('mouseleave', () => {
    const polaroid = coverPage.querySelector('.polaroid-wrapper');
    if (polaroid) polaroid.style.transform = 'rotate(-3deg)';
  });
}

// ── Utility: add washi tape ──
function addWashiTape(el, rotation = -2, top = -8) {
  const tape = document.createElement('div');
  tape.className = 'washi-tape';
  tape.style.transform = `rotate(${rotation}deg)`;
  tape.style.top = `${top}px`;
  tape.style.width = '80px';
  tape.style.left = '50%';
  tape.style.marginLeft = '-40px';
  el.style.position = 'relative';
  el.prepend(tape);
}

// ── Expose global nav functions ──
window.nextPage = nextPage;
window.prevPage = prevPage;
window.showPage = showPage;
