var quote = require('../lib/communistQuotes.js')
var expect = require('chai').expect

suite('Тесты коммунистических цитат', function(){
  test('getQuote() должна возвращать цитату', function(){
    expect(typeof quote.getQuote() === 'string')
  })
})