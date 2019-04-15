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

function LookForMatch(allMaterials, resToSearchIn) {
  let result = [];
  console.debug("resTosearchInId =", resToSearchIn[0].id);
  console.debug("allMaterials[0].id =", allMaterials[0].id);
  for(let i = 0; i < allMaterials.length; i++) {
    for(let j = 0; j < resToSearchIn.length; j++) {
      if (allMaterials[i].id === resToSearchIn[j].id) {
        console.debug("HERE");
        result.push(allMaterials[i]); 
      }
    }
  }
  return result;
}

module.exports.function = function askIfRecyclable (material) {
  console.debug(material);
  var allMaterials = GetAllMaterials();
  
  // http://api.earth911.com/earth911.searchMaterials?api_key=5e1a61cbd7b34190&query=paper bag&max_results=10
  let resFromMaterialSearch = [];
  var len = material.length;
  
  for (let i = 0; i < len; i++) {
    if ((material[i].score > 0.5 && len < 3) || (material[i].score > 0.7))
      resFromMaterialSearch = resFromMaterialSearch.concat(GetResultsFromApiSearch(material[i]));
  }
  console.debug("resFromMaterialSearch =", resFromMaterialSearch);
  console.debug("Length =", resFromMaterialSearch.length)
  if (resFromMaterialSearch.length > 0) {
    var foundItemsArray = LookForMatch(allMaterials, resFromMaterialSearch);
    console.debug("Found materials =", foundItemsArray);
    if (foundItemsArray.length > 0) {
      // NEED TO IMPROVE TO RETURN ACTUAL VALUES
      foundItemsArray = foundItemsArray.filter((material, index, self) => index === self.findIndex((t) => (t.item === material.item && t.info === material.info)));
      foundItemsArray = foundItemsArray.map(obj => {
        obj.item = (obj.item[0] === '#') ? obj.item.substring(3): obj.item;
        return obj;
      });
      return foundItemsArray;
    }
  }
  
  
  // Logic to understand if something recyclable? 
  // Best way is to send an API call with our materials to something that can actually tell if this is recyclable?
  
  // Mock for now? 
  // if we can find any of these in materials then we can say it is recyclable
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
  
  
  // Otherwise we say it is not recyclable
  return null;
}