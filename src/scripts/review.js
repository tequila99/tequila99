;(function() {
  // Элементы для организации слайдеров

  const owlReview = $('.owl-review');
  const userNavItems = document.querySelectorAll('.user-nav__item')

  // Слайдер в области отзывов
  owlReview.owlCarousel({
    center: true,
    items: 1,
    loop: true,
    margin: 10,
    nav: false
  });
  owlReview.on('changed.owl.carousel',({page}) => {
    userNavItems.forEach(el => el.classList.remove('active'));
    userNavItems[page.index].classList.add('active');
  })
  userNavItems.forEach((el,i) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!userNavItems[i].classList.contains('active')) {
        owlReview.trigger('to.owl.carousel',[i,300]);
      }
    })
  })
  
})()