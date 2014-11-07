var localeList = ["en", "bg"],
  // https://github.com/mashpie/i18n-node
  i18n = require("i18n"),
  urlrouter = require(__dirname +"/../urlrouter/index.js"),
  cssrouter = require(__dirname +"/../cssrouter/index.js");

// setup some locales - other locales will default to en silently
i18n.configure({
    locales: localeList,
    directory: __dirname + "/../locales"
});

exports.i18n = i18n;
var aaa = 0;

/*
 * GET any page.
 */
exports.connect = function(req, res) {

  var urlList,
  langStr = "language",
  langCookie,
  langCookieIndex,
  localeIndex,
  cssList = [],
  cssrouterpage,
  headers,
  cssrouterpagemorefiles,
  language = req.params.language,
  i,
  l,
  langList = [
    { "prefix": "en", "langstr": "English", "link": true },
    { "prefix": "bg", "langstr": "Bulgarian", "link": true }, 
  ],
  i,
  pageIndex,
  moreIndex,
  page = req.params.page || "home",
  more = req.params.more;

  localeIndex = localeList.indexOf(language);
  if (localeIndex === -1) {
    localeIndex = 0;
    language = "en";
  }
  aaa++;
  console.log(aaa, page, more);
  
  page = page.replace("-ajax", "");
  if (page === ""){
    page = "home";
  }
  
  pageIndex = urlrouter.getPageIndex(page) || page;
  if (more){
    more = more.replace("-ajax", "");
    moreIndex = urlrouter.getPageIndex(more) || more;
  }
  
  /*handles css files*/
  if (pageIndex in cssrouter) {

    cssrouterpage = cssrouter[pageIndex];

    if (cssrouterpage.files && cssrouterpage.files.length) {
      cssList = cssList.concat(cssrouterpage.files);
    }
  
    if (moreIndex && moreIndex in cssrouterpage) {
      cssrouterpagemorefiles = cssrouterpage[moreIndex].files;
      if (cssrouterpagemorefiles && cssrouterpagemorefiles.length) {
        cssList.concat(cssrouterpagemorefiles);
      }
    }
  }
 
  res.locals.cssList = cssList;
  res.locals.currentpage = pageIndex; 
  res.locals.title = i18n.__("title" + (moreIndex || pageIndex));
  // mustache helper
  res.locals.__ = function () {
    return function () {
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
    is substituted in for the last page"s content. */
    req.setLocale(language);
    console.log("req.xhr", req.url)
    res.render(moreIndex || pageIndex, {
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
          title: "page" + page,
          url: req.url,
          navSelector: pageIndex,
          cssList: cssList,
          html: html
        });
      }
    });
  } else {
    headers = req.headers;

    if (!language) {
      langCookie = headers.cookie || "";
      langCookieIndex = langCookie.indexOf(langStr);
      language = langCookieIndex === -1 ? 
        i18n.getLocale() : 
        langCookie.substr(langCookieIndex + langStr.length + 1, 2);  
    } else if (headers.referer &&  page === "refresh"){
      /* This HTTP request is usually triggered when users change the site language.
      It can also be done on the client side. However, since we want to support
      no javascript version of the site, the logic is moved to the server side. */
      urlList = headers.referer.replace("http://" + headers.host, "").split("/");
      l = urlList.length;
      for (i = 2; i < l; i ++) {
        console.log("urlList[i]", urlList[i])
        
        // maps url in one language to another using value as a key
        urlList[i] = i18n.__(
          {
            phrase: "page" + urlrouter.getPageIndex(decodeURI(urlList[i])), 
            locale: language
          }
        );
      }
      urlList[1] = language;
    }

    res.locals.lang = language;
    req.setLocale(language);
    langList[localeIndex].link = false;

    if (language !== "en"){
      for (i in langList){
        langList[i].langstr = i18n.__(langList[i].langstr);
      }
    }
    
    res.locals.langList = langList;

    res.cookie("language",  language, { maxAge: 900000 });
    urlList ? res.redirect(urlList.join("/")) : res.render(moreIndex || pageIndex);
  }
};