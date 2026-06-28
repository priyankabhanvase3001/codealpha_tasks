/**
 * Lens & Light — Photography Portfolio
 * app.js — Vanilla JS: gallery, lightbox, filters, search, upload, likes, fullscreen
 */

/* =========================================
   1. GALLERY DATA
   ========================================= */
const INITIAL_IMAGES = [
  // Nature
  { id: 1,  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75', title: 'Alpine Sunrise',        category: 'nature' },
  { id: 2,  src: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&q=75', title: 'Redwood Mist',          category: 'nature' },
  { id: 3,  src: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=75', title: 'Morning Forest',        category: 'nature' },
  { id: 4,  src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=75', title: 'Valley from Above',     category: 'nature' },
  { id: 5,  src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=75', title: 'Foggy Hills',           category: 'nature' },
  { id: 6,  src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=75', title: 'Deep Forest Path',      category: 'nature' },

  // Landscape
  { id: 7,  src: 'https://images.unsplash.com/photo-1439853949212-36089b892f03?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1439853949212-36089b892f03?w=600&q=75', title: 'Mountain Lake',         category: 'landscape' },
  { id: 8,  src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=75', title: 'Snowy Ridge',           category: 'landscape' },
  { id: 9,  src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=75', title: 'Rocky Summit',          category: 'landscape' },
  { id: 10, src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=75', title: 'Rolling Fields',        category: 'landscape' },
  { id: 11, src: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&q=75', title: 'Golden Valley',         category: 'landscape' },

  // Travel
  { id: 12, src: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=600&q=75', title: 'Tokyo Crossing',        category: 'travel' },
  { id: 13, src: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=600&q=75', title: 'Paris at Dusk',         category: 'travel' },
  { id: 14, src: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=75', title: 'Sahara Dunes',          category: 'travel' },
  { id: 15, src: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=600&q=75', title: 'Night Market',          category: 'travel' },
  { id: 16, src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=75', title: 'Cityscape at Night',    category: 'travel' },
  { id: 17, src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=75', title: 'Taj Mahal Dawn',        category: 'travel' },

  // Portrait
  { id: 18, src: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=600&q=75', title: 'Golden Light Portrait',  category: 'portrait' },
  { id: 19, src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=75', title: 'Friends at Sunset',     category: 'portrait' },
  { id: 20, src: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=75', title: 'Soft Window Light',     category: 'portrait' },
  { id: 21, src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=75', title: 'Contemplative',         category: 'portrait' },

  // Architecture
  { id: 22, src: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=75', title: 'Colosseum at Dusk',    category: 'architecture' },
  { id: 23, src: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&q=75', title: 'Glass Towers',          category: 'architecture' },
  { id: 24, src: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=600&q=75', title: 'Roman Arches',          category: 'architecture' },
  { id: 25, src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=75', title: 'Upward Lines',          category: 'architecture' },
  { id: 26, src: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=600&q=75', title: 'Stone Bridge',          category: 'architecture' },

  // Wildlife
  { id: 27, src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=75', title: 'Fox in the Field',      category: 'wildlife' },
  { id: 28, src: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&q=75', title: 'Sea Turtle',            category: 'wildlife' },
  { id: 29, src: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&q=75', title: 'Bald Eagle',            category: 'wildlife' },
  { id: 30, src: 'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=600&q=75', title: 'Humpback Whale',        category: 'wildlife' },

  // Others
  { id: 31, src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=75', title: 'Autumn Walk',           category: 'others' },
  { id: 32, src: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=85', thumb: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&q=75', title: 'Ocean Horizon',         category: 'others' },
];

/* =========================================
   2. STATE
   ========================================= */
let allImages      = [...INITIAL_IMAGES];
let nextId         = INITIAL_IMAGES.length + 1;
let uploadedCount  = 0;
let activeFilter   = 'all';
let searchQuery    = '';
let likedSet       = new Set(JSON.parse(localStorage.getItem('ll_likes') || '[]'));
let lbIndex        = 0;
let lbOpen         = false;
let searchVisible  = false;

/* =========================================
   3. DOM REFS
   ========================================= */
const grid             = document.getElementById('galleryGrid');
const emptyState       = document.getElementById('emptyState');
const statTotal        = document.getElementById('statTotal');
const statUploaded     = document.getElementById('statUploaded');
const galleryCount     = document.getElementById('galleryCount');
const searchInput      = document.getElementById('searchInput');
const mobileSearchInput= document.getElementById('mobileSearchInput');
const searchClear      = document.getElementById('searchClear');
const lightbox         = document.getElementById('lightbox');
const lbImg            = document.getElementById('lbImg');
const lbTitle          = document.getElementById('lbTitle');
const lbCat            = document.getElementById('lbCat');
const lbCounter        = document.getElementById('lbCounter');
const lbResText        = document.getElementById('lbResText');
const lbLikeText       = document.getElementById('lbLikeText');
const lbLoader         = document.getElementById('lbLoader');
const lbClose          = document.getElementById('lbClose');
const lbPrev           = document.getElementById('lbPrev');
const lbNext           = document.getElementById('lbNext');
const lbDownload       = document.getElementById('lbDownload');
const lbFullscreen     = document.getElementById('lbFullscreen');
const lbFsIcon         = document.getElementById('lbFsIcon');
const scrollTopBtn     = document.getElementById('scrollTop');
const navbar           = document.getElementById('navbar');
const hamburger        = document.getElementById('hamburger');
const mobileMenu       = document.getElementById('mobileMenu');
const uploadBtn        = document.getElementById('uploadBtn');
const fileInput        = document.getElementById('fileInput');
const uploadOverlay    = document.getElementById('uploadOverlay');
const uploadModalClose = document.getElementById('uploadModalClose');
const dropZone         = document.getElementById('dropZone');
const uploadError      = document.getElementById('uploadError');
const navSearchToggle  = document.getElementById('navSearchToggle');
const navSearchField   = document.getElementById('navSearchField');
const toast            = document.getElementById('toast');
const heroBgImg        = document.getElementById('heroBgImg');

/* =========================================
   4. RENDER GALLERY
   ========================================= */
function getVisible() {
  return allImages.filter(img => {
    const matchFilter = activeFilter === 'all' || img.category === activeFilter;
    const matchSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });
}

function renderGallery() {
  const visible = getVisible();
  galleryCount.textContent = `${visible.length} photo${visible.length !== 1 ? 's' : ''}`;

  if (visible.length === 0) {
    grid.innerHTML = '';
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    grid.innerHTML = '';
    visible.forEach((img, i) => {
      const card = buildCard(img, i);
      grid.appendChild(card);
    });
  }

  updateStats();
}

function buildCard(img, idx) {
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View ${img.title}`);
  card.dataset.id = img.id;
  // Stagger animation delay
  card.style.animationDelay = `${Math.min(idx * 40, 400)}ms`;

  card.innerHTML = `
    <div class="card-img-wrap" data-wrap>
      <img class="card-img" src="${img.thumb || img.src}" alt="${img.title}" loading="lazy" decoding="async" />
      <span class="card-badge">${cap(img.category)}</span>
      <button class="card-like ${likedSet.has(img.id) ? 'liked' : ''}" data-like="${img.id}" aria-label="Like ${img.title}" title="Favourite">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="card-overlay">
        <div class="card-expand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <span class="card-title">${img.title}</span>
      <span class="card-cat-label">${cap(img.category)}</span>
    </div>
  `;

  // Shimmer → loaded
  const imgEl = card.querySelector('.card-img');
  const wrap  = card.querySelector('[data-wrap]');
  const markLoaded = () => wrap.classList.add('loaded');
  imgEl.addEventListener('load', markLoaded);
  if (imgEl.complete) markLoaded();

  // Open lightbox
  card.addEventListener('click', e => {
    if (e.target.closest('.card-like')) return; // handled separately
    openLightbox(img.id);
  });
  card.addEventListener('keydown', e => {
    if (e.target.closest('.card-like')) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img.id); }
  });

  // Like button
  const likeBtn = card.querySelector('.card-like');
  likeBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleLike(img.id, likeBtn);
  });

  return card;
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateStats() {
  statTotal.textContent    = allImages.length;
  statUploaded.textContent = uploadedCount;
}

/* =========================================
   5. LIKES
   ========================================= */
function toggleLike(id, btn) {
  if (likedSet.has(id)) {
    likedSet.delete(id);
    btn.classList.remove('liked');
    showToast('Removed from favourites');
  } else {
    likedSet.add(id);
    btn.classList.add('liked');
    showToast('❤ Added to favourites');
  }
  try { localStorage.setItem('ll_likes', JSON.stringify([...likedSet])); } catch(e) {}
}

/* =========================================
   6. TOAST
   ========================================= */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* =========================================
   7. FILTERS
   ========================================= */
// All .nav-filter buttons (desktop + mobile)
document.addEventListener('click', e => {
  const btn = e.target.closest('.nav-filter');
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  // Sync all filter buttons
  document.querySelectorAll('.nav-filter').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === activeFilter);
  });
  renderGallery();
  // Scroll to gallery
  document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Close mobile menu if open
  if (!mobileMenu.hidden) closeMobileMenu();
});

/* =========================================
   8. SEARCH
   ========================================= */
function handleSearch(val) {
  searchQuery = val.trim();
  searchClear.hidden = searchQuery === '';
  renderGallery();
}

searchInput.addEventListener('input', () => handleSearch(searchInput.value));
mobileSearchInput.addEventListener('input', () => {
  searchInput.value = mobileSearchInput.value;
  handleSearch(mobileSearchInput.value);
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  mobileSearchInput.value = '';
  handleSearch('');
  searchInput.focus();
});

// Toggle search field in navbar
navSearchToggle.addEventListener('click', () => {
  searchVisible = !searchVisible;
  navSearchField.hidden = !searchVisible;
  navSearchToggle.setAttribute('aria-expanded', searchVisible);
  if (searchVisible) { searchInput.focus(); }
});

/* =========================================
   9. HAMBURGER / MOBILE MENU
   ========================================= */
hamburger.addEventListener('click', () => {
  const isOpen = !mobileMenu.hidden;
  if (isOpen) { closeMobileMenu(); } else { openMobileMenu(); }
});

function openMobileMenu() {
  mobileMenu.hidden = false;
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeMobileMenu() {
  mobileMenu.hidden = true;
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

/* =========================================
   10. LIGHTBOX
   ========================================= */
function visibleIds() { return getVisible().map(img => img.id); }

function openLightbox(imageId) {
  const ids = visibleIds();
  const idx = ids.indexOf(imageId);
  if (idx === -1) return;
  lbIndex = idx;
  lbOpen  = true;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  showLbImage();
  lbClose.focus();
}

function closeLightbox() {
  lbOpen = false;
  lightbox.hidden = true;
  document.body.style.overflow = '';
  if (document.fullscreenElement) document.exitFullscreen();
}

function showLbImage() {
  const ids = visibleIds();
  const id  = ids[lbIndex];
  const img = allImages.find(i => i.id === id);
  if (!img) return;

  // Show loader
  lbImg.style.opacity = '0';
  lbLoader.classList.add('active');

  const tmp = new Image();
  tmp.onload = () => {
    lbImg.src     = img.src;
    lbImg.alt     = img.title;
    lbImg.style.opacity = '1';
    lbLoader.classList.remove('active');
    lbResText.textContent = `${tmp.naturalWidth} × ${tmp.naturalHeight}`;
  };
  tmp.onerror = () => {
    lbImg.src = img.src;
    lbImg.style.opacity = '1';
    lbLoader.classList.remove('active');
    lbResText.textContent = '—';
  };
  tmp.src = img.src;

  lbTitle.textContent   = img.title;
  lbCat.textContent     = cap(img.category);
  lbCounter.textContent = `${lbIndex + 1} / ${ids.length}`;
  lbLikeText.textContent = likedSet.has(id) ? 'Liked' : 'Not liked';

  lbPrev.disabled = lbIndex === 0;
  lbNext.disabled = lbIndex === ids.length - 1;

  // Set up download
  lbDownload.onclick = () => {
    const a = document.createElement('a');
    a.href     = img.src;
    a.download = img.title.replace(/\s+/g, '_') + '.jpg';
    a.target   = '_blank';
    a.click();
    showToast('Download started');
  };
}

function lbNavigate(dir) {
  const ids    = visibleIds();
  const newIdx = lbIndex + dir;
  if (newIdx < 0 || newIdx >= ids.length) return;
  lbIndex = newIdx;
  showLbImage();
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => lbNavigate(-1));
lbNext.addEventListener('click',  () => lbNavigate(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

// Keyboard nav
document.addEventListener('keydown', e => {
  if (!lbOpen) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lbNavigate(-1);
  if (e.key === 'ArrowRight')  lbNavigate(1);
});

// Fullscreen
lbFullscreen.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    lightbox.requestFullscreen().catch(() => {});
    lbFsIcon.innerHTML = `<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 0 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>`;
  } else {
    document.exitFullscreen();
    lbFsIcon.innerHTML = `<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>`;
  }
});

/* =========================================
   11. UPLOAD
   ========================================= */
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

// Open overlay via navbar button
uploadBtn.addEventListener('click', () => {
  uploadOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
});
uploadModalClose.addEventListener('click', closeUploadModal);
uploadOverlay.addEventListener('click', e => {
  if (e.target === uploadOverlay) closeUploadModal();
});

function closeUploadModal() {
  uploadOverlay.hidden = true;
  document.body.style.overflow = '';
}

// Drop zone click
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
});

fileInput.addEventListener('change', () => {
  handleFiles([...fileInput.files]);
  fileInput.value = '';
});

// Drag & drop
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', e => {
  if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove('drag-over');
});
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  handleFiles([...e.dataTransfer.files]);
});

function handleFiles(files) {
  const bad = files.filter(f => !ALLOWED.includes(f.type));
  if (bad.length) {
    uploadError.textContent = `⚠ Unsupported file: ${bad.map(f => f.name).join(', ')}. Use JPG, PNG, or WEBP.`;
    uploadError.hidden = false;
    setTimeout(() => { uploadError.hidden = true; }, 5000);
    return;
  }
  uploadError.hidden = true;

  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const src   = e.target.result;
      const title = cap(file.name.replace(/\.[^.]+$/, '').replace(/[_\-]+/g, ' '));
      allImages.push({ id: nextId++, src, thumb: src, title, category: 'others' });
      uploadedCount++;
      loaded++;
      if (loaded === files.length) {
        renderGallery();
        closeUploadModal();
        showToast(`✓ ${files.length} photo${files.length > 1 ? 's' : ''} added to gallery`);
        document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth' });
        // Cycle hero bg to one of the uploaded images
        heroBgImg.src = src;
      }
    };
    reader.readAsDataURL(file);
  });
}

/* =========================================
   12. NAVBAR SCROLL BEHAVIOUR
   ========================================= */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  scrollTopBtn.hidden = window.scrollY < 500;
}, { passive: true });

/* =========================================
   13. SCROLL TO TOP
   ========================================= */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================
   14. ESC closes mobile menu & upload
   ========================================= */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!mobileMenu.hidden) closeMobileMenu();
    if (!uploadOverlay.hidden) closeUploadModal();
  }
});

/* =========================================
   15. INIT
   ========================================= */
renderGallery();
