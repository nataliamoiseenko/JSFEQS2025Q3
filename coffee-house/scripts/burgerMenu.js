const bmToggle = document.getElementById('burger-menu-toggle');
const bmLinks = document.getElementsByClassName('header__burger-menu-list-link burger-link');

bmToggle.addEventListener('change', (e) => {
  e.currentTarget.checked ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll');
});

for (let link of bmLinks) {
  link.addEventListener('click', () => {
    bmToggle.checked = false;
    document.body.classList.remove('no-scroll');
  });
}
