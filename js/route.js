//ラインを引く
// function routeDetermination2(busMarkers){
//   var apiUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?";
//   let key = "key=AIzaSyC4MGQ_o4xO5oeOvuTH8tVQl-vBOYBX4So";
//   let points = busMarkers.map(x=>x.position.lat()+","+x.position.lng());
//   let pointsStr = points.join('|');
//   apiUrl += key+"&origins="+pointsStr+"&destinations="+pointsStr;
//
//   $.get(apiUrl)
//
//   .done(function(data) {
//
//     console.log(data);
//
//   })
// }

function routeDetermination(busMarkers){
  var points = new Array();
  var pointObj = [];
  var done = [];
  for(var i=0;i<busMarkers.length; i++){
    points.push({location:{lat:busMarkers[i].position.lat(),lng:busMarkers[i].position.lng()}});
  }
  for(var i = 0; i < points.length-1; i++){
    var target = points[i];
    var other = Array.from(points);
    other.splice(0,i+1);
    for(var j = 0; j < other.length; j++){
      var other1 = Array.from(other);
      other1.splice(j,1);
      //var other2 = other1.concat(done);
      pointObj.push({target:[target,other[j]],other:other1.concat(done)});
    }
    done.push(points[i]);
  }
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  var mins = 0;
  var mind = 999999999;
  var minResult={};
  var counter = pointObj.length;
  for(var i = 0; i < pointObj.length; i++){
  	directionsService.route({
    origin: pointObj[i]['target'][0]['location'],
    destination: pointObj[i]['target'][1]['location'],
    waypoints: pointObj[i]['other'],
    provideRouteAlternatives: false,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: new Date(/* now, or future date */),
      trafficModel: 'pessimistic'
    },
    unitSystem: google.maps.UnitSystem.IMPERIAL
    }, function(response, status) {
      counter--;
  		if (status === google.maps.DirectionsStatus.OK) {
  			var legs = response.routes[0].legs;
  			var dis = 0;
  			var sec = 0;
  			$.each(legs, function(i, val) {
  				sec += val.duration.value;
  				dis += val.distance.value;
  			});
        if(mind>dis){
          mins = sec;
          mind = dis;
          minResult = response;
        }
        if(counter <= 0){
           directionsDisplay.setDirections(minResult);
        }
  		} else {
  			console.log("リクエストオーバー");
  		}
  	});
  }
}
