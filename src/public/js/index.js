window.onload = function() {
  // don't want links to have transition until after the document has loaded
  var nav_links = document.querySelectorAll('nav ul li a');
  for(var i = 0; i < nav_links.length; i++) {
    nav_links[i].style.transition = '0.2s';
  }

  var cta_link = document.querySelector('.masthead a');
  cta_link.style.transition = '0.2s';
}
