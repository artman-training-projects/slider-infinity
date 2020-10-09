class Slider {
  constructor(sliderContainer, elements) {
    this.const = {
      SLIDER_CONTAINER: sliderContainer,
      ELEMENTS_IN_SLIDE: elements,
      DEBOUCE_INTERVAL: 300,
      TRANSITION: 'transform 0.6s ease',
      POSITION_START: 'start',
      POSITION_END: 'end',
      DIRECTION_LEFT: '1',
      DIRECTION_RIGHT: '-1',
    }
    this.sliderElement = {}
    this.sliderControl = {}
    this.handlers = {}
    this.init()
  }

  init() {
    this.sliderElement.wrapper = this.const.SLIDER_CONTAINER.querySelector('.slider__wrapper')
    this.sliderElement.list = this.const.SLIDER_CONTAINER.querySelector('.slider__list')
    this.sliderElement.item = this.const.SLIDER_CONTAINER.querySelector('.slider__item')
    this.sliderElement.nextButton = this.const.SLIDER_CONTAINER.querySelector('.slider__button--next')
    this.sliderElement.prevButton = this.const.SLIDER_CONTAINER.querySelector('.slider__button--prev')

    this.sliderControl.card = this.sliderElement.list.children
    this.sliderControl.direction = this.const.DIRECTION_RIGHT

    this.setHandlers()
  }

  setHandlers() {
    this.sliderElement.nextButton.addEventListener('click', this.debounce(() => {
      if (this.sliderControl.direction === this.const.DIRECTION_LEFT) {
        this.sliderControl.direction = this.const.DIRECTION_RIGHT
        this.replaceElements(this.const.POSITION_START)
      }

      this.sliderElement.wrapper.style.justifyContent = 'flex-start'
      this.sliderElement.list.style.justifyContent = 'flex-start'
      this.setTransform(this.sliderControl.direction)
    }))

    this.sliderElement.prevButton.addEventListener('click', this.debounce(() => {
      if (this.sliderControl.direction === this.const.DIRECTION_RIGHT) {
        this.sliderControl.direction = this.const.DIRECTION_LEFT
        this.replaceElements(this.const.POSITION_END)
      }

      this.sliderElement.wrapper.style.justifyContent = 'flex-end'
      this.sliderElement.list.style.justifyContent = 'flex-end'
      this.setTransform(this.sliderControl.direction)
    }))

    this.sliderElement.list.addEventListener('transitionstart', (evt) => {
      if (evt.target === this.sliderElement.list) {
        this.const.SLIDER_CONTAINER.classList.add('slider--in-move')
      }
    })

    this.sliderElement.list.addEventListener('transitionend', (evt) => {
      if (evt.target === this.sliderElement.list) {
        this.replaceElements(this.sliderControl.direction === this.const.DIRECTION_LEFT ? this.const.POSITION_START : this.const.POSITION_END)

        this.const.SLIDER_CONTAINER.classList.remove('lider--in-move')
        this.sliderElement.list.style.transition = 'none'
        this.setTransform(0)
        setTimeout(() => {
          this.sliderElement.list.style.transition = this.const.TRANSITION
        })
      }
    })
  }

  setTransform(direction) {
    const sliderStep = this.sliderElement.item.offsetWidth * this.const.ELEMENTS_IN_SLIDE

    const getTranslate = (shiftX = 0, shiftY = 0, shiftZ = 0) => {
      return `translate3d(${shiftX}px, ${shiftY}px, ${shiftZ}px)`
    }

    return this.sliderElement.list.style.transform = getTranslate(direction * sliderStep)
  }

  setOneClickBlur() {
    const blurClickSelectors = ['a[href]', 'button']

    document.addEventListener('click', (evt) => {
      blurClickSelectors.forEach((selector) => {
        const clickedElement = evt.target.closest(selector)

        if (clickedElement && clickedElement === document.activeElement) {
          clickedElement.blur()
        }
      })
    })
  }

  replaceElements(placing) {
    const sliderElements = Array.from(this.sliderControl.card)
    const newFragment = document.createDocumentFragment()
    const sliderLastGroup = sliderElements.slice(-this.const.ELEMENTS_IN_SLIDE)
    const sliderFirstGroup = sliderElements.slice(0, this.const.ELEMENTS_IN_SLIDE)

    if (placing === this.const.POSITION_START) {
      for (const el of sliderLastGroup) {
        newFragment.appendChild(el)
      }

      this.sliderElement.list.prepend(newFragment)
    }

    if (placing === this.const.POSITION_END) {
      for (const el of sliderFirstGroup) {
        newFragment.appendChild(el)
      }

      this.sliderElement.list.append(newFragment)
    }
  }

  debounce(cb) {
    let timeout = null
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => cb(...args), this.const.DEBOUCE_INTERVAL)
    }
  }
}

const SLIDE_ELEMENTS = 5
const sliderRoots = document.querySelector('.slider')
const slider = new Slider(sliderRoots, SLIDE_ELEMENTS)
slider.setOneClickBlur()
