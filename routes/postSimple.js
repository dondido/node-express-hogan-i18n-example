var app,
  merge = require('merge'), // npm install -g merge
  exist = require(__dirname +"/../custom_modules/module-exist"),
  mailer = require('express-mailer');

var emailCfg = exist(__dirname + "/../private/emailcfg.js") || {
  to: 'gmail.user@gmail.com',
  auth: {
          user: 'gmail.user@gmail.com',
          pass: 'userpass'
      }
}
/*
 * GET users postings.
 */
exports.init = function(express) {
  app = express;
  // Initialize the data
  mailer.extend(app, merge({
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  },emailCfg));
  return exports;
}

exports.connect = function(req, res) {
  var emailLocals = merge(req.body, {
    layout: false,
    to: emailCfg.to, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
  });
	app.mailer.send(
    'email', 
    emailLocals, 
    function (err) {
    var emailstatus = 'submit-success';
    if (err) {
      // handle error
      console.log('There was an error sending the email');
      emailstatus = 'submit-fail';
    }
    /* This results in only the portion of our view that is page specific
    to be rendered and returned. If the request header is not requested with 
    XMLHttpRequest then the page is rendered like normal with the full view. */
    req.xhr ? res.json({'emailstatus': emailstatus}) : res.redirect(req.url + '#' + emailstatus);
  })
}
