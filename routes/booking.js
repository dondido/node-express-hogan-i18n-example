
/*
 * GET users listing.
 */

exports.booking = function(req, res){
  // res.send("respond with a resource");
   //for (var i in req){console.log(i)}
  /*console.log(req.url);
  
  
  console.log(req.is('json'));*/
//console.log(req.is('application/json'));
  //console.log(req.accepts('json'));
if(~req.headers['accept'].indexOf('json')){

}else{
      res.sendfile(path.join(__dirname,'/../views/index.html'));
      }
};