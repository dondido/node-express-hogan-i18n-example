var express = require("express"),
	http = require("http"),
	port = (process.env.PORT || 8001),
	app = module.exports = express(),
	favicon = require('serve-favicon'),
	errorHandler = require('errorhandler'),
	hogan = require('hogan-express'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	getSimple = require(__dirname +'/../routes/getSimple.js');
	postSimple = require(__dirname +'/../routes/postSimple.js').init(app),
	path = require("path"),
	publicPath = "/../public/",
	oneDay = 86400000;

// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');

/* When a gzip compatible browser requests to a web server, web server 
can compress the response to the browser back and the browser can 
decompress the response and finally the browser get the original response.

If the server does not take care of gzip compression, the original size of
data is passed which takes longer time than using gzip because it is 
sending bigger data! */
app.use(compression());

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

// default: using 'accept-language' header to guess language settings
app.use(getSimple.i18n.init);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

if ('production' === app.get('env')) {
	publicPath += 'build';
} else {
	// development only
	publicPath += 'dev';
	app.use(errorHandler());
}

/* Setting the layout page. Layout page needs {{{ yield }}}
where page content will be injected */
app.set('layout', 'layout');
// Partails using by default on all pages
app.set('partials', {
	lang: "lang",
	header: "header",
	footer: "footer",
	basicform: "basicform",
	submit: "submit"
});

// all environments
app.set('views', __dirname + '/../views');
app.set('view engine', 'html');

app.use(favicon(__dirname + publicPath + '/images/icon/favicon.ico'));

app.use(express.static(path.join(__dirname, publicPath), {
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

// prevent framing of everything.  content underneath that needs to be
// framed must explicitly remove the x-frame-options
app.use(function(req, resp, next) {
  resp.setHeader('x-frame-options', 'DENY');
  next();
});

app.post('/:language?/:page',  postSimple.connect);
app.get('/:language?/:page?/:more?', getSimple.connect);

// Start Node.js Server
http.createServer(app).listen(port);

console.log('Welcome to node-express-hogan-i18n-example!\ncurl http://localhost:' + port + '\nto start using it');