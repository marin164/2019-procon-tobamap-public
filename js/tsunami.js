let tsunamiPolygon = null;
let shelterArray = [[],[],[],[]];

function launchFromCheckBox(bool,index){
  if(bool){
    plotTsunamiShelter(index);
  }else{
    removeMarkers(shelterArray[index]);
    shelterArray[index] = [];
  }
}

function showScoreOfShelter(index){
  Residents_array.map(function(o){
    let shelterIndex = fetchIndexOfNearShelter(o,shelterArray[index]);
    shelterArray[index][shelterIndex].currentData.count++;
    shelterArray[index][shelterIndex].currentData.evacuee.push(o);
  });
  showInfoWindowOfTsunami(index);
  alert("吹き出しをクリックすると詳細が表示されます。");
}

function drawTsunami(elevation){
  if(tsunamiPolygon){
    tsunamiPolygon.setMap(null);
    tsunamiPolygon = null;
  }
  if(elevation == 0){
    return;
  }
  let file_name = "elevation/toba_city_"+elevation+".json";
  loadFile(file_name).done(function(data){
      tsunamiPolygon = new google.maps.Polygon({
          paths:data,
          strokeColor:  '#0000ff',
          strokeOpacity:  0.35,
          strokeWeight:  2,
          fillColor:  '#0000ff',
          fillOpacity:  0.35
      });
      tsunamiPolygon.setMap(map);
      let sinkedResidentsArray = countMarkerIntoTsunami(PlotArray);
      fetchShelterIntoTsunami();
  });
}

function showInfoWindowOfTsunami(index){
  shelterArray[index].map(function(o,i){
    o.showInfoWindow(o.name,"避難者見込み数 : "+o.currentData.count+"人"+"<br>想定収容人数 : "+o.capacity + "人"+"<div id='" + o.name + "' style='width: 180px; height: 255px;'></div>",1,function(){
      shelterArray[index][i].currentData.evacuee.map(function(ob){
          if(shelterArray[index][i].state === 1){
            ob.marker.icon.strokeColor = "#ffffff";
            ob.marker.setMap(null);
            ob.marker.setMap(map);
          }else if(shelterArray[index][i].state === 2){
            ob.marker.icon.strokeColor = "#000";
            ob.marker.setMap(null);
            ob.marker.setMap(map);
          }
      });
      showChart(o.name,separateData(o.currentData.evacuee));
    });
  });
}

function separateData(residents){
  let today = new Date();
  let year = today.getFullYear();
  let response = {
    男:[0,0,0,0,0,0,0,0,0,0],
    女:[0,0,0,0,0,0,0,0,0,0]
  }
  residents.map(function(resident){
    categories.map(function(category,index){
      let range = categoriesObj[category];
      if((year - range.top) >= resident.age && (year - range.under) <= resident.age){
        if(resident.sex === "男"){
          response[resident.sex][index]--;
        }else if(resident.sex === "女"){
          response[resident.sex][index]++;
        }
      }
    });
  });
  return response;
}

function changeMarkersColor(index){
  shelterArray[index].currentData.evacuee.map(function(o){
    if(shelterArray[index].state === 1){
      o.marker.icon.strokeColor = "#ffffff";
    }else if(shelterArray[index].state === 2){
      o.marker.icon.strokeColor = "#000";
    }
    o.marker.setMap(null);
    o.marker.setMap(map);
  });
}

function countMarkerIntoTsunami(markers){
  let victims = new Array();
  markers.map(function(o){
    if(google.maps.geometry.poly.containsLocation(o.marker.getPosition(),tsunamiPolygon)){
      victims.push(o.marker);
    }
  });
  return victims;
}

function fetchShelterIntoTsunami(){
  let victims = new Array();
  shelterArray.map(function(o){
    o.map(function(ob){
      if(google.maps.geometry.poly.containsLocation(ob.marker.getPosition(),tsunamiPolygon)){
        ob.valid = false;
        ob.marker.icon = "http://maps.google.co.jp/mapfiles/ms/icons/blue-dot.png";
        ob.marker.setMap(null);
        ob.marker.setMap(map);
      }
    })
  });
}

function fetchIndexOfNearShelter(p1,shelters){
  console.log(p1);
  console.log(shelters);
  let min;
  if(shelters.length > 1){
     min = {index:0,value:distance(p1.lat,p1.lng,shelters[0].lat(),shelters[0].lng())};
  }
  shelters.map(function(o,i){
    if(o.valid){
      if(i !== 0){
        let p2 = o;
        let dis = distance(p1.lat,p1.lng,p2.lat(),p2.lng());
        if(min.value > dis){
          min.index = i;
          min.value = dis;
        }
      }
    }
  });
  return min.index;
}

function release(){
  let req = {data:{markers:[],polygon:tsunamiPolygon}};

  console.log(JSON.stringify(req));

}

function plotTsunamiShelter(index){
  $.post( 'http://ezaki.greater.jp/dev-TobaMap/takahashi/fetchData.php?case=shelter&index=' + index)

  .done(function( data ) {
      let resultArray = JSON.parse(data);
      resultArray.map(function(o){
        let marker = new Marker({
          position: {lat: Number(o.lat), lng: Number(o.lng)},
          map: map,
          icon: "http://maps.google.co.jp/mapfiles/ms/icons/orange-dot.png",
           draggable: true
        });
        marker.currentData = {count:0,evacuee:[]};
        marker.name = o.name;
        marker.capacity = o.capacity;
        shelterArray[index].push(marker);
      });
      showScoreOfShelter(index);
  });
}

let categories = [
  '乳児', '幼児', '小学生', '中学生',
  '高校生', '青年', '壮年', '中年',
  '前期高齢','後期高齢'
];
let categoriesObj = {
  乳児:{top:0,under:0},
  幼児:{top:1,under:5},
  小学生:{top:6,under:12},
  中学生:{top:13,under:15},
  高校生:{top:16,under:18},
  青年:{top:19,under:29},
  壮年:{top:30,under:44},
  中年:{top:45,under:64},
  前期高齢:{top:65,under:74},
  後期高齢:{top:75,under:150}
};

function showChart(id,data){
  if(!document.getElementById(id)){
    console.log("id:" + id + "が見つかりませんでした。");
    return;
  }
  Highcharts.chart(id, {
    chart: {
        type: 'bar',
        backgroundColor:'#f5f5f5'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    xAxis: [{
        className:'bar-title',
        categories: categories,
        reversed: false,
        labels: {
            step: 0,
            style: {
              fontSize : "12px"
            }
        }
    }],
    yAxis: {
        title: {
            text: null
        },
        labels: {
            formatter: function () {
                return Math.abs(this.value) + '人';
            },
            style: {
              fontSize : "8px"
            }
        }
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + ' ' + this.point.category +"("+ categoriesObj[this.point.category].top+"〜"+categoriesObj[this.point.category].under+"歳)"+'</b><br/>' +
                '予想避難者数: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0) + '人';
        }
    },
    series: [{
        name: '男',
        data: data['男']
    }, {
        name: '女',
        color: '#cc7799',
        data: data['女']
    }]
  });
}
