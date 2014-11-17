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

/*
 * GET any page.
 */
exports.connect = function(req, res, next) {

  var urlList,
  langCookie,
  langCookieIndex,
  localeIndex,
  cssrouterpage,
  headers,
  cssrouterpagemorefiles,
  pageTitle,
  pageIndex,
  moreIndex,
  decodedUrl,
  i,
  l,
  cssList = [],
  langList = [
    { "prefix": "en", "langstr": "English", "link": true },
    { "prefix": "bg", "langstr": "Bulgarian", "link": true }, 
  ],
  langStr = "language",
  language = req.params.language,
  page = req.params.page || "home",
  more = req.params.more;
  
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
    res.render(moreIndex || pageIndex, {
      layout: false
    }, function(err, html) {
      if (err) {
        res.render(
          '404', 
          {
            layout: false
          },
          function(err, html) {
            res.json(
              {
                title: "page404",
                url: req.url,
                html: html
              }
            )
          }
        )
        // handle error, keep in mind the response may be partially-sent
        // so check res.headersSent
      } else {
        /* This results in only the portion of our view that is page specific
        to be rendered and returned. If the request header is not requested with 
        XMLHttpRequest then the page is rendered like normal with the full view. */
        res.json({
          title: req.__("title" + (moreIndex || pageIndex)),
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
        decodedUrl = urlrouter.getPageIndex(decodeURI(urlList[i]));
        // maps url in one language to another using value as a key
        if (decodedUrl){
          urlList[i] = req.__({phrase: "page" + decodedUrl, locale: language});
        }
      }
      urlList[1] = language;
    }

    localeIndex = localeList.indexOf(language);
    if (localeIndex === -1) {
      res.status(404).render('404');
      return;
    }

    res.locals.lang = language;
    req.setLocale(language);
    langList[localeIndex].link = false;

    if (language !== "en"){
      for (i in langList){
        langList[i].langstr = req.__(langList[i].langstr);
      }
    }

    res.locals.title = req.__("title" + (moreIndex || pageIndex));
    
    res.locals.langList = langList;
    res.cookie("language",  language, { maxAge: 900000 });
    if (urlList) {
      res.redirect(urlList.join("/"))
    } else {
      res.render(moreIndex || pageIndex, 
        function(err, html){
          if (err) {
            res.status(404).render('404');
          } else {
            res.end(html)
          }
        } 
      );
    }
  }
};