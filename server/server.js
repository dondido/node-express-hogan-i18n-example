var express = require("express"),
	http = require("http"),
	morgan = require('morgan'),
	port = (process.env.PORT || 8001),
	app = module.exports = express(),
	favicon = require('serve-favicon'),
	errorHandler = require('errorhandler'),
	hogan = require('hogan-express'),
	i18n = require("i18n"),
	localeList = ['en', 'bg'],
	cssrouter = require(__dirname +'/../cssrouter/index.js');
	

var router = express.Router();

var path = require("path");
var oneDay = 86400000;

// SERVER CONFIGURATION
// ====================
// Set View Engine
app.engine('html', hogan);

/* By default, Express will use a generic HTML wrapper 
(a layout) to render all our pages. Later on when JSON
response is requested this option will be turned off. */
app.set('view options', {
	layout: true
});

// setup some locales - other locales will default to en silently
i18n.configure({
    locales: localeList,
    directory: __dirname + '/../locales'
});

// default: using 'accept-language' header to guess language settings
app.use(i18n.init);

/* Setting the layout page. Layout page needs {{{ yield }}}
where page content will be injected */
app.set('layout', 'layout');
// Partails using by default on all pages
app.set('partials', {
	lang: "lang",
	header: "header",
	footer: "footer",
});

// all environments
app.set('views', __dirname + '/../views');
app.set('view engine', 'html');

app.use(favicon(__dirname + '/../public/images/icon/favicon.ico'));

app.use(express.static(path.join(__dirname, '/../public'), {
	maxAge: oneDay
}));
/* In order to further improve the performance of you AJAX page loads
we should impliment server-side and client-side caching. By utilising
caching we build an application that is responsive and users are not
able to tell the difference between this style of application and a 
full client-side rendered application. */
app.use(express.static(path.join(__dirname, '/../views'), {
	maxAge: oneDay
}));
app.enable('view cache');

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}
//app.use(morgan());
app.get('/:language?/:page?/:more?', function(req, res) {

	var urlList,
	langStr = 'language',
	langCookie,
	langCookieIndex,
	localeIndex,
	cssList = [],
	cssrouterpage,
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

		cssrouterpage.files && cssrouterpage.files.length && (cssList = cssList.concat(cssrouterpage.files));
	
		if (more && more in cssrouterpage) {
			cssrouterpagemorefiles = cssrouterpage[more].files;
			cssrouterpagemorefiles && cssrouterpagemorefiles.length && cssList.concat(cssrouterpagemorefiles);
		}
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
	if ('x-requested-with' in req.headers && ~req.headers['x-requested-with'].indexOf('XMLHttpRequest')) {
		
		res.locals.lang = language;
		/* The basic idea of here is that we update the parts of the page
		that change when the user navigates through your app. However, unlike
		a normal AJAX app that returns only data (JSON) from the server,
		a our request actually contains normal HTML that has been generated
		on the server and assigned to a property. This HTML is only a fragment
		of the full page and using Javascript on the client this fragment
		is substituted in for the last page's content. */
		console.log(page,req.url)
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

		if (!language) {
			langCookie = req.headers.cookie || '';
			langCookieIndex = langCookie.indexOf(langStr);
			language = langCookieIndex ==-1 ? i18n.getLocale() : langCookie.substr(langCookieIndex + langStr.length + 1,2);
			
		} else if (req.headers.referer && req.headers.referer.indexOf(req.headers.host)!=-1 && page == 'refresh'){
			urlList = req.headers.referer.replace("http://" + req.headers.host, '').split('/');
			urlList[1] = language;
			page = urlList[2];
			
		}
		
		localeIndex = localeList.indexOf(language);
		res.locals.lang = language;
		~ localeIndex || (language = 'en');
		
		req.setLocale(language);

		langList[localeIndex].link = false;

		if (language != 'en'){
			for (i in langList){
				langList[i].langstr = i18n.__(langList[i].langstr);
			}
		}
		
		res.locals.langList = langList;

		res.cookie('language',  language, { maxAge: 900000 });
		console.log('AB', cssList, more, page);
		urlList ? res.redirect(urlList.join('/')) : res.render(more || page);
	}
});

// Start Node.js Server
http.createServer(app).listen(port);

console.log('Welcome to node-express-hogan-i18n-example!\n\nPlease go to http://localhost:' + port + ' to start using it');
