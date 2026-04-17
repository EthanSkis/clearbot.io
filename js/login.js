function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.querySelector('#identifier');
  const pw = form.querySelector('#password');
  const btn = form.querySelector('.auth-submit');

  if (!id.value.trim() || pw.value.length < 8) {
    form.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
      { duration: 240, easing: 'ease-out' }
    );
    return false;
  }

  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Signing in…';

  setTimeout(() => {
    btn.innerHTML = '✓ Authenticated';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      pw.value = '';
    }, 1600);
  }, 900);

  return false;
}
