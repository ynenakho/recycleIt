var console = require('console');
var http = require('http');
var config = require('config');
var secret = require('secret');
var value = secret.get('gcpApiKey');

module.exports.function = function GetMaterialFromImage(image) {
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