var console = require('console')
var config = require('config')

module.exports.function = function GetResponseView (isRecyclable) {
  console.debug("HERE", isRecyclable);
  if (isRecyclable)
    return {
      text: "Yes, you CAN Recycle it!",
      image: {
        url: "images/yes_recycle.png"
      }
    };
  return {
    text: "No, you CANNOT Recycle it!",
      image: {
        url: "images/no_recycle.png"
      }
  };
}