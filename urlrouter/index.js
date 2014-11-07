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