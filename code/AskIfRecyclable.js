var console = require('console')
var config = require('config')

module.exports.function = function askIfRecyclable (recognitionResponse) {
  var {material} = recognitionResponse;
  console.debug(material);
  
  
  // if we can find any of these in materials then we can say it is recyclable
  const recyclables = ['carton', 'paper', 'can', 'glass', 'plastic'];
  
  for (let i =0; i < material.length; i++) {
    var current =(material[i].description).toUpperCase();
    var currentScore = material[i].score;
    var words = current.split(' ');
    for (let j = 0; j < words.length; j++) {
      var word = words[j];
      if (recyclables.find(type => word === type.toUpperCase()) && currentScore > 0.5)
         return true;
    }
  }
  
  
  
  return false;
}