class Marker {
  constructor(info) {
    this.marker = new google.maps.Marker(info);
    this.map = info.map;
    this.infoWindow = null;
    this.state = 0;
    this.valid = true;
    this.currentData = null;
    this.lastData = null;
    this.name = null;
  }

  showMarker(){
    this.marker.setMap(this.map);
  }

  hideMarker(){
    if (this.infoWindow){
      this.hideInfoWindow();
    }
    this.marker.setMap(null);
  }

  showInfoWindow(title,mainText,state,click){
    this.hideInfoWindow();
    if(this.state === 0){
      var infoWindowDiv = document.createElement("div");
      infoWindowDiv.innerHTML = "<center><span style='font-wight: 600;font-size:15px'>"+title+"<span></center><!--z<br>"+mainText+"q-->";
      infoWindowDiv.addEventListener("click",e => {
        this.shiftInfoWindow(0);
        if(click){
          click();
        }
      },false);
      this.infoWindow = new google.maps.InfoWindow({content:infoWindowDiv});
      this.infoWindow.open(this.map,this.marker);
      this.state = 1;
      this.shiftInfoWindow(state);
      google.maps.event.addListener(this.infoWindow,'closeclick',e => {this.state = 0},false);
    }
  }

  hideInfoWindow(){
    if(this.infoWindow !== null && this.state !== 0){
      this.state = 0;
      this.infoWindow.close();
    }
  }

  reshowInfoWindow(state){
    this.infoWindow.open(this.map,this.marker);
    this.state = state;
  }

  shiftInfoWindow(state){
      if(this.state === state) return;
      let str = this.infoWindow.content.innerHTML;
      if (str.match(/<!--z-->/)){//infowindowを閉じる処理
        str = str.replace("<!--z-->", "<!--z");
        str = str.replace("<!--q-->", "q-->");
        this.state = 1;
      }else{//infowindowを開く処理
        str = str.replace("<!--z", "<!--z-->");
        str = str.replace("q-->", "<!--q-->");
        this.state = 2;
      }
      this.infoWindow.content.innerHTML = str;
  }

  addMarkerEvent(dragend,click){
    google.maps.event.addListener(this.marker, 'dragend', e => {
      if(dragend){
        dragend();
      }
    }, false);
    google.maps.event.addListener(this.marker, 'click', e => {
      if(click){
        click();
      }
    }, false);
  }

  changeText(title,mainText){
    let state = this.state;
    this.hideInfoWindow();
    this.showInfoWindow(title,mainText,state);
  }

  changeFillColor(color){
    this.marker.icon.fillColor = color;
    this.marker.setMap(null);
    this.marker.setMap(map);
  }

  changeStrokeColor(color){
    this.marker.icon.strokeColor = color;
    this.marker.setMap(null);
    this.marker.setMap(map);
  }

  lat(){
    return this.marker.position.lat();
  }

  lng(){
    return this.marker.position.lng();
  }
}
