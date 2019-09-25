var busStationMarkers = [];
var facilityStationMarkers = [];
var draggableMarkerObjs = {};
var lastLog = {};

function launchKmeans(){
    var num = 3;//$('#busStation_num').val();
    kmeans(PlotArray,num);
}

function kmeans(array,clusterNum){
  let cluster = distribute(array,clusterNum);
  let cogArray = [];
  let finishFlag = true;
  let i = 0;
  cluster.map(function(c){cogArray.push(avgPoint(c))});
  do{
    let copyArray = array;
    let tmpArray = [];
    cogArray.map(function(o,i){
      tmpArray.push([]);
      let minIndex = 0;
      let minValue = 10000;
      copyArray.map(function(ob,ind){
        let value = distance(Number(ob['lat']),Number(ob['lng']),Number(o['lat']),Number(o['lng']));
        if (minValue>value){
          minValue = value;
          minIndex = ind;
        }
      });
      tmpArray[i].push(copyArray[minIndex]);
      copyArray.splice(minIndex,1);
    });
    for(var j=0; j<clusterNum; j++){
      var minIndex = 0;
      var minValue = 10000;
      for(var k=0; k<copyArray.length; k++){
        let value = distance(Number(copyArray[k]['lat']),Number(copyArray[k]['lng']),Number(cogArray[j]['lat']),Number(cogArray[j]['lng']));
        if (minValue>value){
          minValue = value;
          minIndex = k;
        }
      }
      tmpArray[j].push(copyArray[minIndex]);
      copyArray.splice(minIndex, 1);
    }
    for(var j=0; j<copyArray.length; j++){
      var minIndex = 0;
      var minValue = 10000;
      for(var k=0; k<clusterNum; k++){
        let value = distance(Number(copyArray[j]['lat']),Number(copyArray[j]['lng']),Number(cogArray[k]['lat']),Number(cogArray[k]['lng']));
        if (minValue>value){
          minValue = value;
          minIndex = k;
        }
      }
      tmpArray[minIndex].push(copyArray[j]);
    }
    finishFlag = true;
    for(var m=0; m<cluster.length; m++){
      let avgp = avgPoint(tmpArray[m]);
      if(!(Number(avgp['lat']) == Number(cogArray[m]['lat']) && Number(avgp['lng']) == Number(cogArray[m]['lng']))){
        finishFlag = false;
        cogArray[m] = avgp;
      }
    }
    if(i>=20){
      finishFlag = true;
    }
    i++;
  }while(!finishFlag);

  console.log("出力結果");
  console.log(cogArray);

  for (let i = 0; i < clusterNum; i++) {
    var marker = new google.maps.Marker({
      position: cogArray[i],
      map: map,
      title:"bus"+cogArray[i]['lat']+cogArray[i]['lng'],
      icon:"http://maps.google.co.jp/mapfiles/ms/icons/green-dot.png",
     draggable: true
    });
    addEvent(marker);
    busStationMarkers.push(marker);
  }
  return cogArray;
}

function addEvent(marker){
  draggableMarkerObjs[marker.title] = {marker:marker,infowindow:null,state:0};
  lastLog[marker.title] = [null,null,null,null];
  google.maps.event.addListener( marker, 'dragend', function(ev){
    if(draggableMarkerObjs[marker.title]['state']!=0){
      draggableMarkerObjs[marker.title]['infowindow'].close();
      pointAnalyse([marker],draggableMarkerObjs[marker.title]['state']);
    }
  });
  google.maps.event.addListener( marker, 'click', function(ev){
    if(draggableMarkerObjs[marker.title]['state']==0){
      pointAnalyse([marker],1);
    }
  });
}

function distance(lat1, lng1, lat2, lng2) {
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}

function avgPoint(array){
  let sumlat = 0;
  let sumlng = 0;
  for(var i=0; i<array.length; i++){
    sumlat += Number(array[i]['lat']);
    sumlng += Number(array[i]['lng']);
  }
  let avglat = sumlat/array.length;
  let avglng = sumlng/array.length;
  return {lat:avglat,lng:avglng};
}

function distribute(array,clusterNum){
  var outputArray = [];
  for(var i=0; i<clusterNum; i++) outputArray.push([]);
  for(var i=0; i<array.length; i++) outputArray[Math.floor(Math.random() * clusterNum)].push(array[i]);
  return outputArray;
}
