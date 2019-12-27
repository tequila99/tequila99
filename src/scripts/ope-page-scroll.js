;(function() {
  $(document).ready(function() {
    $('main').fullpage({
        //options here
        // autoScrolling:true,
        // scrollHorizontally: false
        navigation: true,
        fixedElements: ['.footer']

    });
    //methods
    // $.fn.fullpage.setAllowScrolling(false);
  });
})()