
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req.url);
  console.log(req.headers);
  
  console.log(req.is('application/json'));
  console.log(req.get('Content-Type'));
   console.log(req.get('content-type'));
  console.log(req.param('data'))
  console.log(req.body);
  console.log(req.type);
  console.log(req.data);
  console.log(req.dataType);
  res.render('index', { title: 'Node Blog with Express, Hogan & Mongo' });
  //res.sendfile(path.join(__dirname,'/../views/index.html'));
};