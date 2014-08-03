var localeList = ['en', 'bg'],
  i18n = require("i18n"),
  cssrouter = require(__dirname +'/../cssrouter/index.js');

// setup some locales - other locales will default to en silently
i18n.configure({
    locales: localeList,
    directory: __dirname + '/../locales'
});

exports.i18n = i18n;

/*
 * GET any page.
 */
exports.connect = function(req, res) {

  var urlList,
  langStr = 'language',
  langCookie,
  langCookieIndex,
  localeIndex,
  cssList = [],
  cssrouterpage,
  headers,
  cssrouterpagemorefiles,
  language = req.params.language,
  langList = [
    { 'prefix': 'en', 'langstr': 'English', 'link': true },
    { 'prefix': 'bg', 'langstr': 'Bulgarian', 'link': true }, 
  ],
  i,
  page = req.params.page || 'home',
  more = req.params.more;

  if (page && cssrouter[page]) {
    cssrouterpage = cssrouter[page];

    if (cssrouterpage.files && cssrouterpage.files.length) {
      cssList = cssList.concat(cssrouterpage.files)
    };
  
    if (more && more in cssrouterpage) {
      cssrouterpagemorefiles = cssrouterpage[more].files;
      if (cssrouterpagemorefiles && cssrouterpagemorefiles.length) {
        cssList.concat(cssrouterpagemorefiles);
      };
    };
  }
 
  res.locals.cssList = cssList;
  res.locals.currentpage = page; 
  // mustache helper
  res.locals.__ = function () {
    return function (text, render) {
      return i18n.__.apply(req, arguments);
    };
  };
  
  /* Looks for the header and if the header is present it sets
  the request options to not use a layout page. */
  if (req.xhr) {
    res.locals.lang = language;
    /* The basic idea of here is that we update the parts of the page
    that change when the user navigates through your app. However, unlike
    a normal AJAX app that returns only data (JSON) from the server,
    a our request actually contains normal HTML that has been generated
    on the server and assigned to a property. This HTML is only a fragment
    of the full page and using Javascript on the client this fragment
    is substituted in for the last page's content. */
    
    res.render(more || page, {
      layout: false
    }, function(err, html) {
      if (err) {
        // handle error, keep in mind the response may be partially-sent
        // so check res.headersSent
      } else {
        /* This results in only the portion of our view that is page specific
        to be rendered and returned. If the request header is not requested with 
        XMLHttpRequest then the page is rendered like normal with the full view. */
        res.json({
          title: page,
          url: req.url,
          navSelector: page,
          cssList: cssList,
          html: html
        })
      }
    });
  } else {
    headers = req.headers;
    if (!language) {
      langCookie = headers.cookie || '';
      langCookieIndex = langCookie.indexOf(langStr);
      language = langCookieIndex ==-1 ? i18n.getLocale() : langCookie.substr(langCookieIndex + langStr.length + 1,2);  
    } else if (headers.referer && headers.referer.indexOf(headers.host)!=-1 && page == 'refresh'){
      urlList = headers.referer.replace("http://" + headers.host, '').split('/');
      urlList[1] = language;
      page = urlList[2];
    }
    
    localeIndex = localeList.indexOf(language);
    res.locals.lang = language;
    if (localeIndex === -1) {
      language = 'en';
    };
    req.setLocale(language);

    langList[localeIndex].link = false;

    if (language != 'en'){
      for (i in langList){
        langList[i].langstr = i18n.__(langList[i].langstr);
      }
    }
    
    res.locals.langList = langList;

    res.cookie('language',  language, { maxAge: 900000 });
    urlList ? res.redirect(urlList.join('/')) : res.render(more || page);
  }
}
