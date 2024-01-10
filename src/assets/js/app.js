//= components/

document.addEventListener("DOMContentLoaded", () => {

  const xl = matchMedia('(max-width: 1024px)');

  if (document && document.fonts) {
    setTimeout(function () {
      document.fonts.ready.then(function () {
        setTimeout(function () {
          initArrow()
          !xl.matches && initCount()
        }, 200)
        document.documentElement.classList.add('fontsloaded')
      });
    }, 0);
  } else {
    setTimeout(function () {
      initArrow()
      !xl.matches && initCount()
    }, 200)
    document.documentElement.classList.add('fontsloaded')
  }

  window.addEventListener('load', function () {
    if (!xl.matches) {
      initRotationCards()
    }
  })

  const headerBtn = document.querySelector('.header-right .header-btn')
  const menuBlock = document.querySelector('.menu-start')
  if (headerBtn && menuBlock) {
    menuBlock.appendChild(headerBtn.cloneNode(true))
  }

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
      this.buttons = this.menu.querySelectorAll('a')
      this.overlay = document.createElement('div');
      this.overlay.hidden = true;
      this._init();
    }

    _init() {
      if (!xl.matches) {
        return
      }
      document.body.appendChild(this.overlay);
      this.overlay.classList.add('overlay');

      this.overlay.addEventListener('click', this.toggleMenu.bind(this));
      this.button.addEventListener('click', this.toggleMenu.bind(this));
      this.buttons.forEach(el => {
        el.addEventListener('click', this.toggleMenu.bind(this));
      })
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
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // if any scroll is attempted, set this to the previous value;
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
      document.documentElement.classList.add('overflow-hidden')
    }

    enableScroll() {
      window.onscroll = function () { };
      document.documentElement.classList.remove('overflow-hidden')
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
  const numberOfArrow = 30;

  if (arrowsAnimations.length) {
    arrowsAnimations.forEach(el => {
      for (let i = 0; i < numberOfArrow; i++) {
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
    const arrowsWrapper = document.querySelectorAll('.arrows-wrapper');
    arrowsWrapper.forEach(el => {
      const arrows = el.querySelectorAll('.arrow');

      const wrapperBounds = el.getBoundingClientRect();
      // Function to update opacity based on position
      function updateOpacity(arrow) {
        const arrowBounds = arrow.getBoundingClientRect();
        const midPoint = wrapperBounds.left + wrapperBounds.width / 2;
        const distanceToMid = Math.abs(midPoint - ((arrowBounds.left + arrowBounds.right) / 2 + arrowBounds.width / 2));
        const maxDistance = wrapperBounds.width / 2;
        arrow.style.opacity = 1 - distanceToMid / maxDistance;
      }
      const arrowsAnim = el.querySelectorAll('.arrows-animation')
      if (arrowsAnim.length) {
        arrowsAnim.forEach(arr => {
          gsap.to(arr, {
            xPercent: 100,
            ease: "none",
            repeat: -1,
            lazy: true,
            duration: 30,
            onUpdate: () => !xl.matches && arrows.forEach(updateOpacity) // Update opacity during animation
          });
        })
      }

    })
  }

  const numberwrap = document.querySelector('.numbers-wrapper')
  const end = document.querySelector('.scrolltrigger-ends')
  if (numberwrap && end) {
    end.appendChild(numberwrap.cloneNode(true))

    setTimeout(() => {
      const numbers = end.querySelectorAll('.numbers-item')
      if (numbers.length) {
        [...numbers].reverse().forEach((el, i) => {
          const number = el.dataset.count
          const wrap = el.querySelector('.number-wrap');
          const h = 7.2;
          if (wrap) {
            wrap.style.setProperty('transform', `translate3d(0, ${'-' + h * number + 'rem'}, 0)`)
          }
        })
      }
    }, 100)
  }

  const numbers = document.querySelectorAll('.numbers-item')
  if (numbers.length) {
    numbers.forEach(el => {
      const wrap = document.createElement('span')
      wrap.classList.add('number-wrap')
      for (let i = 0; i <= 9; i++) {
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
              duration: 1.5,
              delay: 0.3 + i * 0.1,
              ease: 'elastic',
              immediateRender: false,
            })
          }
        })
      }
    }
  }

  gsap.registerPlugin(ScrollTrigger);
  const elem = document.querySelector('.numbers-wrapper')
  const trigger = document.querySelector('.scrolltrigger-ends')
  let calcheight = getCoords(trigger).top + trigger.getBoundingClientRect().height - getCoords(elem).top - elem.getBoundingClientRect().height



  window.addEventListener('resize', function () {
    if (!xl.matches) {
    location.reload() 
    }
  })

  // gsap.timeline({
  //   scrollTrigger: {
  //     trigger: elem,
  //     start: () =>
  //       `bottom 79%`,
  //     end: () => `${calcheight}px 79%`,
  //     pin: true,
  //     anticipatePin: 1,
  //     scrub: 0.5,
  //   }
  // })
  // .add('start')
  // .to('.numbers-item', {
  //   height: '10.4rem',
  // }, 'start')
  // .to('.number-wrap span', {
  //   color: '#B0E3FC',
  //   fontSize: '8rem',
  //   y: '1rem', 
  // }, 'start')

  // gsap.to(elem, {
  //   scrollTrigger: {
  //     trigger: elem,
  //     start: () =>
  //       `bottom 79%`,
  //     end: () => `${calcheight}px 79%`,
  //     scrub: 1,
  //   },
  //   duration: 1,
  //   y: calcheight,
  //   ease: "none"
  // })

  const numbers2 = document.querySelectorAll('.main-bot .numbers-item')
  const secondNumbers = document.querySelectorAll('.main-bot .number-wrap span')

  const startColor = "#DEFABD";
  const endColor = '#B0E3FC';
  const startRed = parseInt(startColor.slice(1, 3), 16);
  const startGreen = parseInt(startColor.slice(3, 5), 16);
  const startBlue = parseInt(startColor.slice(5, 7), 16);
  const endRed = parseInt(endColor.slice(1, 3), 16);
  const endGreen = parseInt(endColor.slice(3, 5), 16);
  const endBlue = parseInt(endColor.slice(5, 7), 16);

  function animateColor(progress) {
    let result1 = progress * endRed + (1 - progress) * startRed
    let result2 = progress * endGreen + (1 - progress) * startGreen
    let result3 = progress * endBlue + (1 - progress) * startBlue
    var interpolatedColor = "#" + Math.round(result1).toString(16) + Math.round(result2).toString(16) + Math.round(result3).toString(16);
    return interpolatedColor;
  }

  gsap.timeline({
    scrollTrigger: {
      trigger: elem,
      invalidateOnRefresh: true,
      start: () =>
        `bottom 79%`,
      end: () => `${calcheight}px 79%`,
      scrub: 1,
      onUpdate: (h) => {

        result = h.progress * 10.4 + (1 - h.progress) * 8.4
        result2 = h.progress * 8 + (1 - h.progress) * 4.8
        const color = animateColor(h.progress)
        if (numbers2.length) {
          numbers2.forEach(el => {
            el.style.height = result + 'rem'
            el.style.fontSize = result2 + 'rem'
            el.style.color = color
          })
        }

        result3 = h.progress * 1 + (1 - h.progress) * 0
        if (secondNumbers.length) {
          secondNumbers.forEach(el => {
            el.style.setProperty('transform', `translate3d(0, ${result3}rem, 0`)
          })
        }

      },
    },
  })
    .to(elem, {
      duration: 5,
      y: calcheight,
      ease: "none",
    })


  function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  }

  const callback = (entries) => {

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded')
      } else {
        entry.target.classList.remove('loaded')
      }
    })

  };


  const observer = new IntersectionObserver(callback, { rootMargin: '-50px' });

  setTimeout(() => {

    const target = document.querySelectorAll('[data-animonscroll]');
    if (target.length) {
      target.forEach(el => {
        if (xl.matches) {
          el.classList.add('loaded')
        } else {
          observer.observe(el);
        }
      })
    }

    
    const swiper = document.querySelector('.tarifs-swiper')
    const pagination = document.querySelector('.tarifs-swiper-wrapper .swiper-pagination')
    if (swiper) {
      const swiperslides = swiper.querySelectorAll('.swiper-slide')
      if (swiperslides.length <=3 && !xl.matches) {
        swiper.classList.add('swiper-no-swiping')
      }
      new Swiper(swiper, {
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: true,
        initialSlide: 1,
        pagination: {
          el: pagination,
          clickable: true,
        },
        breakpoints: {
          // when window width is >= 501px
          1025: {
            slidesPerView: 3,
          },
        }
      }) 
    }
  }, 0)

  const scrolledObj = document.querySelectorAll('[data-scroll]');

  if (scrolledObj.length) {
    scrolledObj.forEach(el => {
      el.addEventListener('click', function () {
        event.preventDefault()
        const sc = document.querySelector(this.dataset.scroll)
        if (sc) {
          const header = document.querySelector('header');
          let headerH = null;
          if (header) {
            headerH = header.getBoundingClientRect().height;
          }
          const yOffset = headerH ? -headerH : -200;
          const onMedia = xl.matches ? 0 : 50;
          const y = sc.getBoundingClientRect().top + window.pageYOffset + yOffset - onMedia;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      })
    })
  }


});











