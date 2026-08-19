const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

function updateOpenStatus() {
  const status = document.querySelector('[data-open-status]');
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date());

  const value = (type) => parts.find((part) => part.type === type)?.value;
  const day = value('weekday');
  const hour = Number(value('hour'));
  const minute = Number(value('minute'));
  const currentMinutes = hour * 60 + minute;
  const schedule = {
    Tue: [600, 1080],
    Wed: [600, 1080],
    Thu: [600, 1080],
    Fri: [600, 1080],
    Sat: [540, 1020],
  };
  const today = schedule[day];
  const isOpen = Boolean(today && currentMinutes >= today[0] && currentMinutes < today[1]);

  const orderedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = orderedDays.indexOf(day);
  let nextOpening = '';
  for (let offset = 0; offset < 7; offset += 1) {
    const nextDay = orderedDays[(todayIndex + offset) % 7];
    const opening = schedule[nextDay];
    if (!opening) continue;
    if (offset === 0 && currentMinutes < opening[0]) {
      nextOpening = `Opens today at ${opening[0] === 540 ? '9 AM' : '10 AM'}`;
      break;
    }
    if (offset > 0) {
      const label = offset === 1 ? 'tomorrow' : nextDay === 'Tue' ? 'Tuesday' : nextDay === 'Sat' ? 'Saturday' : nextDay;
      nextOpening = `Opens ${label} at ${opening[0] === 540 ? '9 AM' : '10 AM'}`;
      break;
    }
  }

  status.classList.toggle('closed', !isOpen);
  status.querySelector('span:last-child').textContent = isOpen
    ? 'Open today · Walk in'
    : `Closed now · ${nextOpening}`;
}

updateOpenStatus();
document.querySelector('[data-year]').textContent = new Date().getFullYear();
