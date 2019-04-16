var console = require('console');
var http = require('http');
var config = require('config');
var secret = require('secret');
var value = secret.get('earthApiKey');

function GetListDestinations (locationId, sourcePoint) {
  var queryObject = {
    api_key: value,
    location_id: locationId
  };
  var queryString = http.makeQueryString(queryObject);
  var response = http.getUrl(config.get('remote.earth.url') + "getLocationDetails?" + queryString, { passAsJson: true });
  console.debug("GetListDestinations response = ",response);
  var data = JSON.parse(response)
  console.log("DATA =", data);

  var resp = data.result[locationId];
  var result = Object.assign({}, {
    name: resp.description ? resp.description : "unknown",
    address: resp.address ? resp.address : "unknown",
    city: resp.city ? resp.city : "unknown",
    state: resp.province ? resp.province : "unknown",
    zip: resp.postal_code ? resp.postal_code : "unknown",
    phone: resp.phone ? resp.phone : "unknown",
    website: resp.url ? resp.url : "unknown",
    destinationPoint: {
      point : {
        latitude: resp.latitude ? resp.latitude : "unknown",
        longitude: resp.longitude ? resp.longitude : "unknown"
      }
    },
    sourcePoint: sourcePoint,
    materials: resp.materials ? resp.materials.map(material => material.description) : "unknown"
  });

  console.debug("GetListDestinations data =",result);
  return result;
}

module.exports.function = function DestinationList (response) {
  console.debug("DestinationList =", response.destinationPoint[0]);
  let result = [];

  for (let i = 0; i < response.destinationPoint.length; i++) {
    result.push(GetListDestinations(response.destinationPoint[i].locationId, response.sourcePoint));
  }

  console.debug("RESULT!!! =", result)
  return result;
}
