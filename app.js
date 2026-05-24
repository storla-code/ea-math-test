const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-menu');
const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.resource-card');
const search = document.querySelector('#resource-search');
const emptyState = document.querySelector('#empty-state');
const expandButtons = document.querySelectorAll('[data-expand]');
const chapters = document.querySelectorAll('.chapter-card');
const videoButtons = document.querySelectorAll('[data-video-id]');
const videoModal = document.querySelector('#video-modal');
const videoIframe = document.querySelector('#video-modal-iframe');
const videoClose = document.querySelector('.video-modal-close');
const videoBackdrop = document.querySelector('.video-modal-backdrop');
let activeFilter = 'all';

function normalize(value) {
  return value.toLowerCase().trim();
}

function updateResources() {
  const query = normalize(search.value || '');
  let visibleCount = 0;

  cards.forEach((card) => {
    const type = card.dataset.type;
    const text = normalize(`${card.textContent} ${card.dataset.keywords || ''}`);
    const typeMatches = activeFilter === 'all' || type === activeFilter;
    const queryMatches = query.length === 0 || text.includes(query);
    const isVisible = typeMatches && queryMatches;

    card.classList.toggle('is-hidden', !isVisible);
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
}

menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

menu.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    updateResources();
  });
});

search.addEventListener('input', updateResources);

expandButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const shouldOpen = button.dataset.expand === 'open';
    chapters.forEach((chapter) => {
      chapter.open = shouldOpen;
    });
  });
});

function closeVideo() {
  videoModal.hidden = true;
  videoIframe.src = '';
}

videoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    videoIframe.src = `https://www.youtube.com/embed/${button.dataset.videoId}?autoplay=1`;
    videoModal.hidden = false;
  });
});

videoClose.addEventListener('click', closeVideo);
videoBackdrop.addEventListener('click', closeVideo);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !videoModal.hidden) {
    closeVideo();
  }
});

updateResources();
