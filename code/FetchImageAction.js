var http = require('http');
var console = require('console');
var config = require('config');

module.exports.function = function FetchImageAction () {
  
  var response = http.getUrl(config.get('remote.webcam') + '/snapshot', {format: 'json', cacheTime: 0});  
  console.log("result===", response);
  
 return {imageData: response.imageSrc.substr(23)};
}
