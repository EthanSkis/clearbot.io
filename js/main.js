// Countdown — targets 45 days out from page load for a living feel
(function () {
  const target = Date.now() + (45 * 24 * 60 * 60 * 1000) - (1000 * 60 * 37);
  const $d = document.getElementById('d');
  const $h = document.getElementById('h');
  const $m = document.getElementById('m');
  const $s = document.getElementById('s');
  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    $d.textContent = pad(days);
    $h.textContent = pad(hours);
    $m.textContent = pad(mins);
    $s.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();

// Progressive char reveal for the brandmark
(function () {
  const el = document.querySelector('h1.brand');
  const clear = el.querySelector('.clear');
  const bot   = el.querySelector('.bot');
  const wrap = (node, startDelay) => {
    const text = node.textContent;
    node.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'brand-char';
      span.textContent = ch;
      span.style.animationDelay = (startDelay + i * 0.05) + 's';
      node.appendChild(span);
    });
  };
  wrap(clear, 0.25);
  wrap(bot,   0.5);
})();

// Form handler
function handleSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('emailInput');
  const btn   = e.target.querySelector('button');
  const email = input.value.trim();
  if (!email) return false;

  const originalHTML = btn.innerHTML;
  btn.innerHTML = '✓ On the list';
  btn.style.background = '#fff';
  input.value = '';
  input.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    input.disabled = false;
  }, 3200);
  return false;
}
