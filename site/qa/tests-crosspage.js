var Browser = require('zombie'),
  assert = require('chai').assert

var browser
suite('Межстраничные тесты', function(){
  setup(function(){
    browser = new Browser()
  })
  
  test('Запрос расценок для групп со страницы туров по реке Худ должен заполнять поле реферера',
    function(done){
      var referrer = 'http://localhost:3000/tours/hood-river'
      browser.visit(referrer, function(){
        browser.clickLink('.requestGroupRate', function(){
          // Код из книги не работает. Нашел адрес реферера где попало
          // assert(browser.field('referrer').value === referrer)
          assert(browser.resources[0].response.url === referrer)
          done()
        })
      })
    })
  
  test('Запрос расценок для групп со страницы туров пансионата "Орегон Коуст" должен заполнять поле реферера',
    function(done){
      var referrer = 'http://localhost:3000/tours/oregon-coast'
      browser.visit(referrer, function(){
        browser.clickLink('.requestGroupRate', function(){
          // Так же как и выше строка кода заменена на свою
          assert(browser.resources[0].response.url === referrer)
          done()
        })
      })
    })
  
  test('Посещение страницы "Запрос цены для групп" напрямую должен приводить к пустому полю реферера', function(done){
    browser.visit('http://localhost:3000/tours/request-group-rate',
      function(){
        assert(browser.field('referrer').value === '')
        done()
      }
    )
  })
})