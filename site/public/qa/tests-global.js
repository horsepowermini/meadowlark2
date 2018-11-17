'use strict';

suite('Global Tests', function(){
  test('У данной страницы допустимый загловок', function() {
    assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO')
  })
})