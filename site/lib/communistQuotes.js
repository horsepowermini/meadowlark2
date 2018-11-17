var communistQuotes = [
  "Пролетарии всех стран, соединяйтесь!",
  "К цели приводит не знание, а действие",
  "Каждый по возможностям, каждому по труду",
  "Труд на благо общества - дело благородное"
]

exports.getQuote = function() {
  var idx = Math.floor(Math.random() * communistQuotes.length)
  return communistQuotes[idx]
}