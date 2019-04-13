var console = require('console');
var http = require('http');
var config = require('config');
var secret = require('secret');
var value = secret.get('gcpApiKey');


function GetMaterialFromImage(image) {
  var params = {
    "requests": [
      {
        "image": {
          "source": {
            "imageUri": image.url
          }
        },
        "features": [
          {
            "type": "LABEL_DETECTION"
          }
        ]
      }
    ]
  };
  
  var response = http.postUrl(config.get('remote.url') + value, params,{ passAsJson: true });
  console.debug("RESPONSE",response);
  var data = JSON.parse(response).responses[0].labelAnnotations.map(resp => ({description: resp.description, score: resp.score}));
  console.debug("DATA",data);
  return data;
}




module.exports.function = function createMaterial (description,image) {
  
  var answer = [];
  
  if (image) {
    answer = GetMaterialFromImage(image);
  } else if (description) {
    for (let i = 0; i < description.length; i++) {
      var material = {
       description: description[i],
       score: 1
      }
       answer.push(material)
    }  
  }
  
  return answer
}
