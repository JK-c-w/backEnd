const socket=io();

// check if the browser supports geolocation
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
    //  Bring the latitude and longitude of the device on earth
    const {latitude,longitude}=position.coords;
    console.log(latitude,longitude);
    // send the location to the backend
    socket.emit("send-location",{latitude,longitude});
    },(err)=>{
        console.log(err)
    },{
      //  set HighghAccuracy
        enableHighAccuracy:true,  
      //No caching : no data would save in cache
        maximumAge:0,
      // 5-sec time : retrive data on evry 5sec
        timeout:5000
    })

    const map=L.map("map").setView([0,0],10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:"JK"
    }).addTo(map);
   
    const markers={};
    socket.on("recived location",(data)=>{
        const {id,longitude,latitude}=data;
        console.log("dwe");
        map.setView([latitude,longitude],16);
        if(markers[id]) {
            markers[id].setLatLng([latitude,longitude]);}
        else {
        markers[id]=L.marker([latitude,longitude]).addTo(map);}
    });
    socket.on('user-disconnected', (data) => {
        const { id } = data;
        console.log(`User ${id} disconnected`);
        if (userMarkers[id]) {
            map.removeLayer(userMarkers[id]);
            delete userMarkers[id];
        }
    });

}