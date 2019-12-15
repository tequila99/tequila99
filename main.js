window.onload = function () {
  const buttonMenu = document.querySelector('.header__burger');
  const burgerMenu = document.querySelector('.hamburger-menu')
  const burgerCloseButton =document.querySelector('.hamburger-menu__close'); 

  // Элементы для организации слайдеров
  const owlOrder = $('.owl-order');
  const owlReview = $('.owl-review');
  const userNavItems = document.querySelectorAll('.user-nav__item')

  // Элементы для организации аккордеона в секции команда
  const itemsTeamAcco = document.querySelectorAll('.team-member');
  const triggersTeamAcco = document.querySelectorAll('.team-member__trigger')
  // 
  
  // Элементы для организации меню-аккордиона
  const contentsMenuAcco = document.querySelectorAll('.menu-acco__content-item');
  const itemsMenuAcco = document.querySelectorAll(".menu-acco__item");
  const closeMenuAcco = document.querySelectorAll('.menu-acco__close');

  // Элементы для реализации оверлея и модального окна
  const overlayClose = document.querySelector('.overlay__close');
  const overlayMain = document.querySelector('.overlay');
  const overlayContent = document.querySelector('.overlay__content');
  const overlayText= document.querySelector('.overlay__text');

  // Элементы для формы и ее отправки на сервер
  const mainForm = document.querySelector('#main-form');
  const submitButton = document.querySelector('#submit-button');
  const resetButton = document.querySelector('#reset-button');

  const mailServer = 'https://webdev-api.loftschool.com/sendmail';
  const failServer = 'https://webdev-api.loftschool.com/sendmail/fail';

  // Слайдер в области заказа
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
  
  // Аккордион в секции Команда
  triggersTeamAcco.forEach((el,i) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!!itemsTeamAcco[i].classList.contains('active')) {
        itemsTeamAcco[i].classList.remove('active');
      } else {
        itemsTeamAcco.forEach(el => el.classList.remove('active'));
        itemsTeamAcco[i].classList.add('active');
      }
    });
  });
// Аккордион меню
  itemsMenuAcco.forEach((el, i) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      contentsMenuAcco.forEach(el => el.classList.remove('active'));
      contentsMenuAcco[i].classList.add('active')
    })
  })

  closeMenuAcco.forEach(el =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      contentsMenuAcco.forEach(el => el.classList.remove('active'));
    })
  );

  // Работа с формой
  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    validateForm() && sendForm();
  });
  
  const validateForm = () => validateField('name') && validateField('phone') && validateField('comment')

  const validateField = (field) => {
    const fieldEl = mainForm.elements[field];
    const res = fieldEl.checkValidity();
    fieldEl.nextElementSibling.textContent = fieldEl.validationMessage;  
    return res;
  }


  const sendForm = () => {
    const formData = new FormData()
    formData.append('name',mainForm.elements.name.value);
    formData.append('phone',mainForm.elements.phone.value);
    formData.append('comment',mainForm.elements.comment.value);
    formData.append('to','test@mail.ru');

    xhr = new XMLHttpRequest();
    xhr.responseType='json';
    xhr.open('POST',Math.random()> 0.3 ? mailServer : failServer)
    xhr.send(formData);
    xhr.addEventListener('load', (e) => {
      if (xhr.status === 200 && !!xhr.response.status) {
        showOverlay(xhr.response.message)
      } else {
        showOverlay('Произошла ошибка при отправке письма')
      }
    })
  }

  // Всплывающее меню на весь экран
  overlayMain.addEventListener('click', (e) => {
    if (e.target !== overlayContent) hideOverlay();
  });

  overlayClose.addEventListener('click', (e) => {
    e.preventDefault();
    overlayMain.style.display = 'none';
  });

  const showOverlay = (message = '') => {
    overlayText.textContent = message;
    overlayMain.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  const hideOverlay = () => {
    overlayMain.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  const showBurgerMenu = () => {
    burgerMenu.style.display ='flex';
    document.body.style.overflow ='hidden';
  }

  const hideBurgerMenu = () => {
    burgerMenu.style.display ='none';
    document.body.style.overflow='auto';
  }

  buttonMenu.addEventListener('click', (el) => {
    el.preventDefault();
    showBurgerMenu();
  });

  burgerMenu.addEventListener('click', el => {
    el.preventDefault();
    (el.target === burgerMenu) && hideBurgerMenu();
  });

  burgerCloseButton.addEventListener('click', el => {
    el.preventDefault();
    hideBurgerMenu();
  });
}
