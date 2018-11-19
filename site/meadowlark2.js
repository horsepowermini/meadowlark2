'use strict';

const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const formidable = require('formidable')
const communistQuotes = require('./lib/communistQuotes.js')

const app = express()

// Продолжение установки handlebars
app.engine('.hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    section(name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', '.hbs')

app.set('port', process.env.PORT || 3000)

app.use(express.static(path.join(__dirname, 'public')))

// функция для имитации погодного API
function getWeatherData() {
  return {
    locations: [
      {
        name: 'Портленд',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Сплошная облачность ',
        temp: '12.3 C',
      },
      {
        name: 'Бенд',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Малооблачно',
        temp: '12.8 C',
      },
      {
        name: 'Манзанита',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Небольшой дождь',
        temp: '12.8 C',
      },
    ],
  }
}

// добавление данных о погоде (должно быть до определения маршрутов)
app.use((req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {}
  res.locals.partials.weatherContext = getWeatherData()
  next()
})

// Обработка форм
app.use(require('body-parser').urlencoded({ extended: true }))

// Код для тестирования
app.use((req, res, next) => {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'
  next()
})

// Определение маршрутов
app.get('/', (req, res) => {
  res.render('home')
})

app.get('/about', (req, res) => {
  res.render('about', {
    communistQuote: communistQuotes.getQuote(),
    pageTestScript: '/qa/tests-about.js',
  })
})

app.get('/tours/hood-river', (req, res) => {
  res.render('tours/hood-river')
})

app.get('/tours/oregon-coast', (req, res) => {
  res.render('tours/oregon-coast')
})

app.get('/tours/request-group-rate', (req, res) => {
  res.render('tours/request-group-rate')
})

app.get('/jquery-test', (req, res) => {
  res.render('jquery-test')
})

// Маршруты для Handlebars на стороне клиента (детская фигня про Василиска)
app.get('/nursery-rhyme', (req, res) => {
  res.render('nursery-rhyme')
})
app.get('/data/nursery-rhyme', (req, res) => {
  res.json({
    animal: 'бельченок',
    bodyPart: 'хвост',
    adjective: 'пушистый',
    noun: 'снежинка',
  })
})

// без применения макета (without layout)
app.get('/without_layout', (req, res) => {
  res.render('without_layout', { layout: null })
})

// с использованием другого макета (отличного от указанного по умолчанию)
app.get('/different_layout', (req, res) => {
  res.render('different_layout', { layout: 'microsite' })
})


// Страница благодарности за подписку
app.get('/thank-you', (req, res) => {
  res.render('thank-you')
})

// маршрут для страницы с формой
app.get('/newsletter', (req, res) => {
  res.render('newsletter', { csrf: 'CSRF token goes here' })
})

// маршрут для обработки данных формы
app.post('/process', (req, res) => {
  console.log(`Form (from querystring): ${req.query.form}`)
  console.log(`CSRF token (from hidden form field): ${req.body._csrf}`)
  console.log(`Name (from visible form field): ${req.body.name}`)
  console.log(`Email (from visible form field): ${req.body.email}`)
  res.redirect(303, '/thank-you')
})

// маршрут для обработки данных формы полученных с помощью AJAX запроса
app.post('/process', (req, res) => {
  if (req.xhr || req.accepts('json.html') === 'json') {
    // если здесь есть ошибка, то мы должны отправить { error: 'описание ошибки' }
    res.send({ success: true })
  } else {
    // если бы была ошибка, нам нужно было бы перенаправлять на страницу ошибки
    res.redirect(303, '/thank-you')
  }
})

// обработка файлов загружаемых через браузер
app.get('/contest/vacation-photo', (req, res) => {
  const now = new Date()
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth(),
  })
})

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    if (err) return res.redirect(303, '/error')
    console.log('recieved fields:')
    console.log(fields)
    console.log('recieved files:')
    console.log(files)
    res.redirect(303, '/thank-you')
  })
})

// Обобщенный обработчик 404 (промежуточное ПО)
app.use((req, res) => {
  res.status('404')
  res.render('404')
})

// Обработчик ошибки 500 (промежуточное ПО)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500)
  res.render('500')
  next()
})

app.listen(app.get('port'), () => {
  console.log(`Express запущен на http://localhost:${app.get('port')}; нажмите Ctrl+С для завершения.`)
})
