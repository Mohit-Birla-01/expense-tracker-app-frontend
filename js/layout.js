function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  loadComponent('header', '../../common/header/header.html');
  loadComponent('footer', '../../common/footer/footer.html');
});
