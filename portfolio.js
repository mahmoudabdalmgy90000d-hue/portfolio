const items = [...document.querySelectorAll('.item')];
const buttons = document.querySelectorAll('.filters button');

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const i = items.indexOf(e.target) % 6;
      e.target.style.transitionDelay = (i * 0.1) + 's';
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
items.forEach((el) => io.observe(el));
buttons.forEach((btn) => btn.addEventListener('click', () => {
  buttons.forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  items.forEach((el) => {
    const match = f === 'all' || el.dataset.cat === f;
    el.classList.toggle('hide', !match);
    el.classList.remove('show');
    if (match) {
      el.style.transitionDelay = '0s';
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    }
  });
}));
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
const lbCap = lb.querySelector('.caption');
let current = 0;
const visible = () => items.filter((el) => !el.classList.contains('hide'));

function openLB(i) {
  const list = visible();
  current = (i + list.length) % list.length;
  const el = list[current];
  lbImg.src = el.querySelector('img').src;
  lbCap.textContent = el.querySelector('h3').textContent;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
const closeLB = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };

items.forEach((el) => el.addEventListener('click', () => openLB(visible().indexOf(el))));
lb.querySelector('.lb-close').onclick = closeLB;
lb.querySelector('.lb-prev').onclick = () => openLB(current - 1);
lb.querySelector('.lb-next').onclick = () => openLB(current + 1);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') openLB(current - 1);
  if (e.key === 'ArrowRight') openLB(current + 1);
});