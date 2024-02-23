function createElement(tag = 'div', text = '', classList = [], attrs = {}) {
    let element = document.createElement(tag)
    element.classList.add(...classList)
    element.textContent = text
    for (const prop in attrs) {
        element[prop] = attrs[prop]
    }
    return element
}



var TEXT_REGEXP_RU = /^[а-яА-Я\s]*$/;
var TEXT_REGEXP_EN = /^[a-zA-Z\s]*$/;
var EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
var TEXT_REGEXP
if (getData('lg') === 'ru') {
    TEXT_REGEXP = TEXT_REGEXP_RU
} else {
    TEXT_REGEXP = TEXT_REGEXP_EN
}

const openSearch = document.getElementById('search-open')
const searchClose = document.getElementById('search-close')
const openMenu = document.getElementById('search-menu')
const closeInfoBtn = document.getElementById('contacts-info-close')
const openInfoBtn = document.getElementById('contacts-info-open')

const searchOpenAnim = gsap.timeline()
    .pause()
    .set('.header__search-menu',  { display: 'flex'})
    .fromTo('#search-open', {opacity: 1, y: 0}, {opacity: 0, y: -20, duration: .3})
    .fromTo('.header__search-menu', {opacity: -1, y: -50}, {opacity: 1, y: -5, duration: .5})

const infoAnim = gsap.timeline()
    .pause()
    .fromTo('.contacts__map-info-close', {opacity: 1}, {opacity: 0, duration: .2})
    .fromTo('.contacts__map-info-title', {opacity: 1}, {opacity: 0, duration: .2})
    .fromTo('.contacts__map-info-descr', {opacity: 1}, {opacity: 0, duration: .2})
    .fromTo('.contacts__map-info-link', {opacity: 1}, {opacity: 0, duration: .2})
    .set('.contacts__map-info-close', {display: 'none'})
    .set('.contacts__map-info-title', {display: 'none'})
    .set('.contacts__map-info-descr', {display: 'none'})
    .set('.contacts__map-info-link', {display: 'none'})
    .fromTo('.contacts__map-info', {opacity: 1, width: '410px', padding: '40px'}, {width: '40px', padding: '0', duration: .6})
    .set('.contacts__map-info-open', {visibility: 'visible'})
    .fromTo('.contacts__map-info-open', {opacity: 0}, {opacity: 1, duration: .2})


function init() {
    let map = new ymaps.Map('map', {
        center: [55.752673567057954,37.66762578674393],
        zoom: 17,
    })

    map.controls.remove('geolocationControl');
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    map.controls.remove('fullscreenControl');
    map.controls.remove('zoomControl');
    map.controls.remove('rulerControl');
    map.behaviors.disable(['scrollZoom']);
}

function getData(name) {
    return localStorage.getItem(name)
}

function setData(name, data) {
    localStorage.setItem(name, data)
}

function setMess(messName) {
    const warnMess = {
        'email': {'en': 'Invalid email', 'ru': 'Некорректный email'},
        'short': {'en': 'The field is empty!', 'ru': 'Поле пустое!'},
        'text': {'en': 'Invalid characters in the field', 'ru': 'Некорректные символы в поле'},
        'submit': {'en': 'There are errors in the input fields', 'ru': 'В полях ввода есть ошибки'}
    }
    let lang = getData('lg')
    const mess = warnMess[messName]
    return mess[lang]
}

function testEmail(input, errorElem) {
    if (input.value.length < 1) {
        errorElem.textContent = setMess('short')
    } else if (!EMAIL_REGEXP.test(input.value)) {
        errorElem.textContent = setMess('email');
    } else {
        errorElem.textContent = '';
    }
}

function testText(input, errorElem) {
    if (input.value.length < 1) {
        errorElem.textContent = setMess('short')
    } else if (!TEXT_REGEXP.test(input.value)) {
        errorElem.textContent = setMess('text');
    } else {
        errorElem.textContent = '';
    }
}

function validateForm(inputStart) {
    const input = document.querySelector('#' + inputStart.id)
    input.addEventListener('input', () => {
        const inputContainer = input.parentElement
        const inputClass = input.classList[0]
        if (inputContainer.querySelector('.' + inputClass + '-error') === null) {
            const errorElement = createElement('h2', '', [inputClass + '-error'])
            inputContainer.append(errorElement)
        }
        const errorElement = inputContainer.querySelector('.' + inputClass + '-error')
        if (input.type === 'email') {
            testEmail(input, errorElement)
        } else {
            testText(input, errorElement)
        }
    })
}

function getFormInputs(className) {
    const inputsList = document.querySelectorAll('.' + className)
    for (const inputQuery of inputsList) {
        const inputDOM = document.getElementById(inputQuery.id)
        validateForm(inputDOM)
    }
}

function checkInputs(className) {
    const inputsList = document.querySelectorAll('.' + className)
    for (const inputQuery of inputsList) {
        const inputDOM = document.getElementById(inputQuery.id)
        const input = document.querySelector('#' + inputDOM.id)
        const inputContainer = input.parentElement
        const inputClass = input.classList[0]
        if (inputContainer.querySelector('.' + inputClass + '-error') === null) {
            const errorElement = createElement('h2', '', [inputClass + '-error'])
            inputContainer.append(errorElement)
        }
        const errorElement = inputContainer.querySelector('.' + inputClass + '-error')
        if (input.type === 'email') {
            if (input.value.length < 1) {
                errorElement.textContent = setMess('short')
                return true
            } else if (!EMAIL_REGEXP.test(input.value)) {
                errorElement.textContent = setMess('email');
                return true
            } else {
                errorElement.textContent = '';
                return false
            }
        } else {
            if (input.value.length < 1) {
                errorElement.textContent = setMess('short')
                return true
            } else if (!TEXT_REGEXP.test(input.value)) {
                errorElement.textContent = setMess('text');
                return true
            } else {
                errorElement.textContent = '';
                return false
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    openSearch.addEventListener('click', () => {
        searchOpenAnim.play()
        searchClose.addEventListener('click', () => {
            searchOpenAnim.reverse()
        })
    })

    closeInfoBtn.addEventListener('click', () => {
        infoAnim.play()
        openInfoBtn.addEventListener('click', () => {
            infoAnim.reverse()
        })
    })

    getFormInputs('about__news-form-input')
    const aboutNewsFormSubmit = document.getElementById('about-news-submit')
    aboutNewsFormSubmit.addEventListener('click', (event) => {
        event.preventDefault()
        if (checkInputs('about__news-form-input')) {
            alert(setMess('submit'))
        }
    })
    
    getFormInputs('contacts__form-input')
    const contactsFormSubmit = document.getElementById('contacts-form-submit')
    contactsFormSubmit.addEventListener('click', (event) => {
        event.preventDefault()
        if (checkInputs('contacts__form-input')) {
            alert(setMess('submit'))
        }
    })

    const selectLanguage = document.getElementById('header-lang')
    selectLanguage.addEventListener('change', (event) => {
        if (selectLanguage.value === 'en') {
            window.location.href = 'english.html';
        } else {
            window.location.href = 'index.html';
        }
    })
    
    ymaps.ready(init)
})

