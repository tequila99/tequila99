;(function() {
  const owlOrder = $('.owl-order');
  owlOrder.owlCarousel({
    center: true,
    items:1,
    loop:true,
    margin:10,
  });
  $('.order__nav--next').click(function() {
    owlOrder.trigger('next.owl.carousel',[300]);
  })
  $('.order__nav--prev').click(function() {
    owlOrder.trigger('prev.owl.carousel',[300]);
  });  
})()