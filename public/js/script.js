const socket = io();

if(navigator.geolocation)
{

    navigator.geolocation.watchPosition((position) =>{
        const {latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude });
    }, (error) =>{
        console.error(error);
        
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 2500
    }
);    
    }

const map = L.map("map").setView([0,0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {}
socket.on("received-location",(data)=>{
    const {id, longitude, latitude} = data;
    map.setView([latitude, longitude], 15);
    if(markers[id])
        {
            markers[id].setLatLang([latitude, longitude]);
        }else{
            const marker = L.marker([latitude, longitude]).addTo(map);
        }  
})

socket.on("user-disconnected", (id)=>{
if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
}
})