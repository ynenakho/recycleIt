var mockData  = require("./mockData.js");
var console = require('console')
var config = require('config')

module.exports.function = function GetMaterialFromImage (image) {
  var answer = [];
  for (let i =0; i < mockData.length; i++) {
     answer.push({description: mockData[i].description, score: mockData[i].score});
  }
  return answer;
}