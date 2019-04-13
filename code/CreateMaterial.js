var console = require('console');

module.exports.function = function createMaterial (description, image) {
  console.debug('descipriotn = ', description);
  
  
  
  var answer = [];
  for (let i = 0; i < description.length; i++) {
    var material = {
      description: description[i],
      image: image
    }
     answer.push(material)
  }
  
  return answer
}
