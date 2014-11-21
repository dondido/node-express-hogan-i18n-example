var envFiles = require(__dirname +"/../cssrouter/map.js"),
	envMap = {};

exports.init = function(env, pathmin, filemin) {
	var i, l, filepath, pageFiles;
  	if (env === "production") {
		for (i in envFiles) {
			pageFiles = envFiles[i];
      l = pageFiles.length;
      while (l--){
        if (pageFiles[l].indexOf(".min") === -1){
          console.log(l, pageFiles[l])
          filepath = pageFiles[l].split("/");
          pageFiles[l] = pathmin + filepath[filepath.length - 1] + filemin;
        }
      }
    }
  }
  exports.map = envFiles;	
}