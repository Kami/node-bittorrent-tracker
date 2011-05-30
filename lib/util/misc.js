function getUnixTimestamp(date) {
  var dateToFormat = date || new Date();

  return Math.round(dateToFormat / 1000);
}

exports.getUnixTimestamp = getUnixTimestamp;
