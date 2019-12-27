;(function() {
  // Элементы для организации меню-аккордиона
  const contentsMenuAcco = document.querySelectorAll(
    ".menu-acco__content-item"
  );
  const itemsMenuAcco = document.querySelectorAll(".menu-acco__item");
  const closeMenuAcco = document.querySelectorAll(".menu-acco__close");
  // Аккордион меню
  itemsMenuAcco.forEach((el, i) => {
    el.addEventListener("click", function(e) {
      e.preventDefault();
      contentsMenuAcco.forEach(el => el.classList.remove("active"));
      contentsMenuAcco[i].classList.add("active");
    });
  });

  closeMenuAcco.forEach(el =>
    el.addEventListener("click", function(e) {
      e.preventDefault();
      contentsMenuAcco.forEach(el => el.classList.remove("active"));
    })
  );
})();
