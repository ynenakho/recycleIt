var console = require('console');
var http = require('http');
var config = require('config');
var value = config.get('gcpApiKey');

module.exports.function = function GetMaterialFromImage(image) {
  
  // secrets are available only when you deploy your capsule for now let it be like this.
  if (!value) value = "AIzaSyA0Clrw6wm6Ux_fFl30BE19nn2HxuIkIzs";
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
  var data = JSON.parse(response).responses[0].labelAnnotations.map(resp => ({description: resp.description, score: resp.score}));
  console.debug("RESP",data);
  return data;
}