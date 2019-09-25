
function pointAnalyse(markers,state){
  let today = new Date();
  let year = today.getFullYear();
  let age_top = year -  $('#age_top').val();
  let age_under = year - $('#age_under').val();

  markers.forEach(function(marker) {
    $.post( 'http://ezaki.greater.jp/TobaMap/count.php', 'range='+0.5+'&lat='+marker.position.lat()+'&lng='+marker.position.lng()+'&age_top='+age_top+'&age_under='+age_under)

    .done(function( data ) {
        var result = data.split("&");
        var text = "100点<!--z<br><br>"+makeHTML("対象人数",result[0],lastLog[marker.title][0])+makeHTML("女",Math.round(result[1]*10)/10,lastLog[marker.title][1])+makeHTML("男",Math.round(result[2]*10)/10,lastLog[marker.title][2])+makeHTML("平均年齢",Math.round(result[3]*10)/10,lastLog[marker.title][3])+"q-->";
        if (state==2){
          text = text.replace("<!--z", "<!--z-->");
          text = text.replace("q-->", "<!--q-->");
        }
        lastLog[marker.title][0] = result[0];
        lastLog[marker.title][1] = Math.round(result[1]*10)/10;
        lastLog[marker.title][2] = Math.round(result[2]*10)/10;
        lastLog[marker.title][3] = Math.round(result[3]*10)/10;
        makeInfoWindow(marker,text,state);
    })
  });
}

function pointAnalyse1(markers,state){
  let today = new Date();
  let year = today.getFullYear();
  let age_top = year -  $('#age_top').val();
  let age_under = year - $('#age_under').val();

  markers.forEach(function(marker) {
    console.log(marker.lat);
    console.log(marker.lng);
    $.post( 'http://ezaki.greater.jp/TobaMap/count.php', 'range='+0.5+'&lat='+marker.lat+'&lng='+marker.lng+'&age_top='+age_top+'&age_under='+age_under)

    .done(function( data ) {
        var result = data.split("&");
        var text = "100点<!--z<br><br>"+makeHTML("対象人数",result[0],result[0])+makeHTML("女",Math.round(result[1]*10)/10,Math.round(result[1]*10)/10)+makeHTML("男",Math.round(result[2]*10)/10,Math.round(result[2]*10)/10)+makeHTML("平均年齢",Math.round(result[3]*10)/10,Math.round(result[3]*10)/10)+"q-->";
        if (state==2){
          text = text.replace("<!--z", "<!--z-->");
          text = text.replace("q-->", "<!--q-->");
        }
        makeInfoWindow(marker,text,state);
    })
  });
}

function makeHTML(key,value1,value2){
  let suffixObj = {"対象人数":"人","女":"%","男":"%","平均年齢":"歳"};
  var v1 = Number(value1);
  var v2 = Number(value2);
  var value = Math.round(Math.abs(v1-v2)*100)/100;
  var updownText = "";
  var yajirusi = "";
  var color = "";
  var suffix = "";

  if(value2 == null || v1==v2){
    updown = "";
    yajirusi = "";
    color = "";
    value = "";
    suffix = "";
  }else if(v1 > v2){
    updown = "UP";
    yajirusi = "↑";
    color = "color:red";
    suffix = suffixObj[key];
  }else if(v1 < v2){
    updown = "DOWN";
    yajirusi = "↓";
    color = "color:blue";
    suffix = suffixObj[key];
  }
  return "<p>"+key+":"+value1+suffixObj[key]+" <span style='"+color+"'>"+yajirusi+" "+value+suffix+" "+updown+"</span></p>";
}

function makeInfoWindow(marker,text,state){
  var infoWindowDiv = document.createElement("div");
  infoWindowDiv.innerHTML = text;
  infoWindowDiv.addEventListener("click",function(event) {//infoWindowのタッチイベント
      var str = event.target.innerHTML;
      if ( str.match(/<!--z-->/)){//infowindowを閉じる処理
        str = str.replace("<!--z-->", "<!--z");
        str = str.replace("<!--q-->", "q-->");
        draggableMarkerObjs[marker.title]['state'] = 1;
      }else{//infowindowを開く処理
        str = str.replace("<!--z", "<!--z-->");
        str = str.replace("q-->", "<!--q-->");
        draggableMarkerObjs[marker.title]['state'] = 2;
      }
      event.target.innerHTML = str;
  });
  var infoWindow = new google.maps.InfoWindow({ content: infoWindowDiv,title:marker.title});
  google.maps.event.addListener( infoWindow, 'closeclick', function(ev){
    draggableMarkerObjs[infoWindow.title]['state'] = 0;
    console.log("owari");
  })
  draggableMarkerObjs[marker.title]['state'] = state;
  infoWindow.open(map, marker);

  draggableMarkerObjs[marker.title]['infowindow'] = infoWindow;
}

function aa(){
  let marker = new Marker({
    position: {lat: 34.480445, lng: 136.839438},
    map: map,
    icon: "http://maps.google.co.jp/mapfiles/ms/icons/pink-dot.png",
     draggable: true
  });
  marker.showInfoWindow("<div style='height:180px;width:270px;'><img src='bus_img.jpg' style='height:180px;width:270px;'></img></div>",null,1,null);
}
