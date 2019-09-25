
function loadFile(file_url){
  var defer = $.Deferred();
  $.ajax({
  	url:  file_url,
    dataType:  "json",
  	success:  defer.resolve,
  });
  return defer.promise();
}

function removeMarkers(markers){
  markers.map(function(o){
    o.hideMarker();
  });
}
