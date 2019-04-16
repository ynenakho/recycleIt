var console = require('console');
var http = require('http');
var config = require('config');
var secret = require('secret');
var value = secret.get('earthApiKey');

function GetAllMaterials () {
  var response = http.getUrl(config.get('remote.earth.url') + "getMaterials?api_key=" + value, { passAsJson: true });
  console.debug("GetAllMaterials response =",response);
  var data = JSON.parse(response).result.map(resp => ({item: resp.description, info: resp.long_description, id: resp.material_id}));
  console.debug("GetAllMaterials data =",data);
  return data;
}

function GetResultsFromApiSearch(material) {
  var queryObject = {
    api_key: value,
    max_results: 5,
    query: material.description
  };
  var queryString = http.makeQueryString(queryObject);
  var response = http.getUrl(config.get('remote.earth.url') + "searchMaterials?" + queryString, { passAsJson: true });
  console.debug("GetResultsFromApiSearch response = ",response);
  var data = JSON.parse(response).result.map(resp => ({item: resp.description, exact: resp.exact, id: resp.material_id}));
  console.debug("GetResultsFromApiSearch data =",data);
  return data;
}

function GetLocation(materialId, sourcePoint) {
  console.debug("MaterialId =", materialId);
  console.debug("sourcePoint =", sourcePoint);

  var queryObject = {
    api_key: value,
    latitude: sourcePoint.point.latitude,
    longitude: sourcePoint.point.longitude,
    max_distance: 5,
    material_id: materialId
  };
  var queryString = http.makeQueryString(queryObject);
  var response = http.getUrl(config.get('remote.earth.url') + "searchLocations?" + queryString, { passAsJson: true });
  console.debug("GetLocation response = ",response);
  // var data = JSON.parse(response).result.map(resp => ({locationName: resp.description, locationId: resp.location_id, longitude: resp.longitude, latitude: resp.latitude, distance: resp.distance}));
  // console.debug("GetLocation data =", data);
  var data = JSON.parse(response).result.map(resp => ({locationId: resp.location_id, point : {longitude: resp.longitude, latitude: resp.latitude}}));
  console.debug("GetLocation data =", data);
  return data;
}

function GetResultsFromApiSearch(material) {
  var queryObject = {
    api_key: value,
    max_results: 10,
    query: material.description
  };
  var queryString = http.makeQueryString(queryObject);
  var response = http.getUrl(config.get('remote.earth.url') + "searchMaterials?" + queryString, { passAsJson: true });
  console.debug("GetResultsFromApiSearch response = ",response);
  var data = JSON.parse(response).result.map(resp => ({item: resp.description, exact: resp.exact, id: resp.material_id}));
  console.debug("GetResultsFromApiSearch data =",data);
  return data;
}

function LookForMatch(allMaterials, resToSearchIn, sourcePoint) {
  let result = [];
  console.debug("resTosearchInId =", resToSearchIn[0].id);
  console.debug("allMaterials[0].id =", allMaterials[0].id);
  for(let i = 0; i < allMaterials.length; i++) {
    for(let j = 0; j < resToSearchIn.length; j++) {
      if (allMaterials[i].id === resToSearchIn[j].id) {
        console.debug("HERE");
        var temp = allMaterials[i];
        temp.sourcePoint = sourcePoint;
        // temp.destinationLocations = GetLocation(allMaterials[i].id, sourcePoint);
        temp.destinationPoint = GetLocation(allMaterials[i].id, sourcePoint);
        result.push(temp);
      }
    }
  }
  return result;
}

function checkMatch(material, allMaterials) {
  let words = material.description.toLowerCase().split(' ');
  for (let i = 0; i < words.length; i++) {

    if (words[i] !== 'product' && allMaterials.find(obj => obj.item.toLowerCase().includes(words[i]) !== -1))
      return true;
  }
  return false;
}

module.exports.function = function askIfRecyclable (material, sourcePoint) {
  console.debug(material);
  var allMaterials = GetAllMaterials();
  let resFromMaterialSearch = [];
  var len = material.length;

  for (let i = 0; i < len; i++) {
    if(((material[i].score > 0.5 && len < 3) || (material[i].score > 0.6)) && checkMatch(material[i], allMaterials))
      resFromMaterialSearch = resFromMaterialSearch.concat(GetResultsFromApiSearch(material[i]));
  }
  console.debug("resFromMaterialSearch =", resFromMaterialSearch);
  console.debug("Length =", resFromMaterialSearch.length)
  if (resFromMaterialSearch.length > 0) {
    var foundItemsArray = LookForMatch(allMaterials, resFromMaterialSearch, sourcePoint);
    console.debug("Found materials =", foundItemsArray);
    if (foundItemsArray.length > 0) {
      foundItemsArray = foundItemsArray.map(obj => {
        obj.item = (obj.item[0] === '#') ? obj.item.substring(3): obj.item;
        return obj;
      });
      foundItemsArray = foundItemsArray.filter((material, index, self) => index === self.findIndex((t) => (t.item === material.item && t.info === material.info)));
      console.debug("FINAL_ARRAY =", foundItemsArray);
      // foundItemsArray = foundItemsArray.map(dest => dest.destinationLocations.filter((location, index, self) => index === self.findIndex(t => (t.locationId === location.locationId))));
      // console.debug("FINAL_ARRAY2 =", foundItemsArray);
      return foundItemsArray;
    }
  }

  const recyclables = ['carton', 'paper', 'can', 'glass' ,'conditioner ','napkins', 'metal','steel','aluminum','cardboard', 'tin', 'glass', 'jar' , 'bottle', 'plastic'];

  for (let i =0; i < material.length; i++) {
    var current = (material[i].description).toUpperCase();
    var currentScore = material[i].score;
    var words = current.split(' ');
    for (let j = 0; j < words.length; j++) {
      var word = words[j];
      if (recyclables.find(type => word === type.toUpperCase()) && currentScore > 0.5)
         return foundItemsArray;
    }
  }
  return null;
}
