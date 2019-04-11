var mockData  = require("./mockData.js");
var console = require('console')
var config = require('config')

module.exports.function = function GetRecognitionResponce (image, material) {
  var answer = {};
  answer.image = image;
  answer.material = material;
  return answer;
}