var urlmap = require(__dirname +"/../urlrouter/map.js");

exports.getPageIndex = function(page){
  var pageIndex,
    i,
    urllangmap;

  for (i in urlmap) {
    urllangmap = urlmap[i];
    if (page in urllangmap) {
      pageIndex = urllangmap[page];
      break;
    }
  }
  return pageIndex;
}

exports.translateUrl = function(url, oldLang, newLang){
  var pageIndex,
    i,
    urllangmap = urlmap[oldLang];
  // maps url in one language to another using value as a key
  if (url in urllangmap) {
    pageIndex = urllangmap[url];
    urllangmap = urlmap[newLang];
    for (i in urllangmap) {
      if (urllangmap[i] === pageIndex) {
        url = i;
        break;
      }
    }
  }
  return url;
}