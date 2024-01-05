document.addEventListener("DOMContentLoaded", () => {

  const xl = matchMedia('(max-width: 1024px)');

  if (document && document.fonts) {
    setTimeout(function () {
      document.fonts.ready.then(function () {
        setTimeout(function () {
          initCount()
          initArrow()
        }, 100)

        document.documentElement.classList.add('fontsloaded')
      });
    }, 0);
  } else {
    setTimeout(function () {
      initCount()
      initArrow()
    }, 100)
    document.documentElement.classList.add('fontsloaded')
  }

  window.addEventListener('load', function () {
    if (!xl.matches) {
      initRotationCards()
    }
  })

  function initRotationCards() {
    const rotationCards = document.querySelectorAll(".rotation-card");

    rotationCards.forEach(card => {
      let isEntered = false;
      const panelContainer = card.querySelector(".panel-container");
      card.addEventListener('mousemove', throttle(function (event) { transformPanel(event, card, panelContainer) }, 150));
      card.addEventListener('mouseenter', () => handleMouseEnter(panelContainer));
      card.addEventListener('mouseleave', () => { handleMouseLeave(panelContainer) });

      function transformPanel(mouseEvent, card, panelContainer) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = mouseEvent.clientX;
        const mouseY = mouseEvent.clientY;
        const percentX = (mouseX - centerX) / (rect.width / 2);
        const percentY = -((mouseY - centerY) / (rect.height / 2));
        const transformAmount = 3;

        if (isEntered) {
          panelContainer.style.transform = `perspective(50rem) rotateY(${percentX * transformAmount}deg) rotateX(${percentY * transformAmount}deg)`;
        } else {
          panelContainer.style.transform = 'perspective(50rem) rotateY(0deg) rotateX(0deg)';
        }
      }

      function handleMouseEnter(panelContainer) {
        isEntered = true
        panelContainer.style.transition = '';
      }

      function handleMouseLeave(panelContainer) {
        isEntered = false
        panelContainer.style.transform = 'perspective(50rem) rotateY(0deg) rotateX(0deg)';
      }

    });


  }

  class Menu {
    constructor(menuElement, buttonElement) {
      this.menu = typeof menuElement === "string" ? document.querySelector(menuElement) : menuElement;
      this.button = typeof buttonElement === "string" ? document.querySelector(buttonElement) : buttonElement;
      this.overlay = document.createElement('div');
      this.overlay.hidden = true;
      this._init();
    }

    _init() {
      document.body.appendChild(this.overlay);
      this.overlay.classList.add('overlay');

      this.overlay.addEventListener('click', this.toggleMenu.bind(this));
      this.button.addEventListener('click', this.toggleMenu.bind(this));
    }

    toggleMenu() {
      this.menu.classList.toggle('menu--open');
      this.button.classList.toggle('menu-button--active');
      this.overlay.hidden = !this.overlay.hidden;

      if (this.isMenuOpen()) {
        this.disableScroll();
      } else {
        this.enableScroll();
      }
    }

    closeMenu() {
      this.menu.classList.remove('header__nav--active');
      this.button.classList.remove('header__menu-button--active');
      this.overlay.hidden = true;

      this.enableScroll();
    }

    isMenuOpen() {
      return this.menu.classList.contains('menu--open');
    }

    disableScroll() {
        // Get the current page scroll position;
        const scrollTop = window.pageYOffset  || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset  || document.documentElement.scrollLeft;
      
            // if any scroll is attempted, set this to the previous value;
            window.onscroll = function() {
                window.scrollTo(scrollLeft, scrollTop);
            };
    }

    enableScroll() {
      window.onscroll = function() {};
    }
  }

  const menu = document.querySelector('.menu');
  const menuButton = document.querySelector('.menu-button');

  if (menu && menuButton) {
    new Menu(menu, menuButton);
  }

  const header = document.querySelector('header');

  let handler;

  function scrollAdd() {
    /* ... */
    handler = throttle(function (event) {
      scrollHeader();
    }, 500);
    document.addEventListener('scroll', handler, false);
  }

  function scrollRemove() {
    /* ... */
    document.removeEventListener('scroll', handler, false);
  }

  if (xl.matches) {
    scrollAdd();
    document.removeEventListener('scroll', scrollHeader);
  } else {
    document.addEventListener('scroll', scrollHeader);
    scrollRemove();
  }

  xl.addEventListener('change', () => {
    if (xl.matches) {
      document.removeEventListener('scroll', scrollHeader);
      scrollAdd();
    } else {
      document.addEventListener('scroll', scrollHeader);
      scrollRemove();
    }
  });

  function disableScroll() {
    // Get the current page scroll position;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    document.documentElement.style.setProperty('scroll-behavior', 'auto');

    // if any scroll is attempted, set this to the previous value;
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  function enableScroll() {
    document.documentElement.style.setProperty('scroll-behavior', null);
    window.onscroll = function () { };
  }

  var prevScrollpos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  function scrollHeader() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScrollPos < 0) {
      currentScrollPos = 0;
      prevScrollpos = 0;
    };
    if (prevScrollpos < 0) {
      prevScrollpos = 0;
      currentScrollPos = 0;
    };
    const num = xl.matches ? 50 : 100;
    if (currentScrollPos > num) {
      header.classList.add('header--active');
    } else {
      header.classList.remove('header--active');
    };
    if (prevScrollpos >= currentScrollPos) {
      header.classList.remove('out');
    } else {
      header.classList.add('out');
    };
    prevScrollpos = currentScrollPos;
  };

  function initHeader() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const num = xl.matches ? 50 : 150;
    if (currentScrollPos > num) {
      header.classList.add('header--active');
    } else {
      header.classList.remove('header--active');
    }
  }

  initHeader();

  function throttle(func, ms) {
    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) { // (2);
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1);

      isThrottled = true;

      setTimeout(function () {
        isThrottled = false; // (3);
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  const arrowsAnimations = document.querySelectorAll('.arrows-animation');
  const numberOfArrow = 20;

  if (arrowsAnimations.length) {
    arrowsAnimations.forEach(el => {
      for(let i=0; i<numberOfArrow; i++) {
        const arrow = document.createElement('div')
        arrow.classList.add('arrow')
        const arrowInner = document.createElement('div')
        arrowInner.classList.add('arrow-inner')
        arrow.appendChild(arrowInner)
        el.appendChild(arrow)
      }
    })
  }



  
  function initArrow() {
    const arrowsWrapper = document.querySelector('.arrows-wrapper');
    const arrows = document.querySelectorAll('.arrow');
    const wrapperBounds = arrowsWrapper.getBoundingClientRect();  
    // Function to update opacity based on position
    function updateOpacity(arrow) {
      const arrowBounds = arrow.getBoundingClientRect();
      const midPoint = wrapperBounds.left + wrapperBounds.width / 2;
      const distanceToMid = Math.abs(midPoint - (arrowBounds.left + arrowBounds.width / 2));
      const maxDistance = wrapperBounds.width / 2;
      arrow.style.opacity = 1 - distanceToMid / maxDistance;
    }
    gsap.to(".arrows-animation", {
      xPercent: 100,
      ease: "none",
      repeat: -1,
      lazy: true,
      duration: 15,
      onUpdate: () => arrows.forEach(updateOpacity) // Update opacity during animation
    });
  }


  const numbers = document.querySelectorAll('.numbers-item')
  if (numbers.length) {
    numbers.forEach(el=> {
      const wrap = document.createElement('span')
      wrap.classList.add('number-wrap')
      for(let i=0;i<=9;i++) {
        wrap.insertAdjacentHTML('beforeend', `<span>${i}</span>`)
      }
      el.appendChild(wrap)
    })
  }

  function initCount() {
    const numbersWrapper = document.querySelector('.numbers-wrapper')

    if (numbersWrapper) {
      const numbers = numbersWrapper.querySelectorAll('.numbers-item')
      if (numbers.length) {
        [...numbers].reverse().forEach((el, i) => {
          const number = el.dataset.count
          const wrap = el.querySelector('.number-wrap');
          const h = 8.4;
          if (wrap) {
            // wrap.style.setProperty('transform', `translate3d(0, ${'-' + h * number + 'rem'}, 0)`)
            gsap.to(wrap, {
              y: '-' + h * number + 'rem',
              lazy: true,
              duration: 1,
              ease: 'elastic',
            })
          }
        })
      }
    }
  }

});











