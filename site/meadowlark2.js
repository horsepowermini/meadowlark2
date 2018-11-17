const express = require('express')
const path = require('path')
// Установка механизма представления handlebars
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section(name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
})
const communistQuotes = require('./lib/communistQuotes.js')

const app = express()

// Продолжение установки handlebars
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 3000)

app.use(express.static(path.join(__dirname, 'public')))

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
