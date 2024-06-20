const currentweathertab=document.querySelector("[current-weather-tab]");
const userweathertab=document.querySelector("[user-weather-tab]");
const searchweathercontainer=document.querySelector(".search-weather-container");
const grantlocationdiv=document.querySelector(".grant-location-div");
const loadingcontainer=document.querySelector(".loading-container");
const userweatherdetailscontainer=document.querySelector(".user-weatherdetails-container");
const notfound=document.querySelector(".not-found");

const API_KEY= '30b05d93b49cfaf9b033f31589cc9649';
let currenttab=currentweathertab;
currenttab.classList.add("styleback");

grantordis();

function entertab(clickedtab){
    if(clickedtab!=currenttab){
        currenttab.classList.remove("styleback");
        currenttab=clickedtab;
        currenttab.classList.add("styleback");

        if(!searchweathercontainer.classList.contains("active")){
            grantlocationdiv.classList.remove("active");
            userweatherdetailscontainer.classList.remove("active");
            notfound.classList.remove("active");
            searchweathercontainer.classList.add("active");
            // console.log("added active");
        }
        else{
            notfound.classList.remove("active");
            searchweathercontainer.classList.remove("active");
            userweatherdetailscontainer.classList.remove("active");
            grantordis();
        }
    }
}
currentweathertab.addEventListener("click",()=>{
    entertab(currentweathertab);
});

userweathertab.addEventListener("click",()=>{
    entertab(userweathertab);
});

function grantordis(){
    const usercoordinates=sessionStorage.getItem("location-coords");
    if(!usercoordinates){
        grantlocationdiv.classList.add("active");
    }
    else{
        let coords=JSON.parse(usercoordinates);
        locationcall(coords);
    }
}

async function locationcall(coords){
    grantlocationdiv.classList.remove("active");
    notfound.classList.remove("active");
    loadingcontainer.classList.add("active");
    try{
        let {lat,lon}=coords;
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        let data=await response.json();
        loadingcontainer.classList.remove("active");
        if(data?.cod==="404"){
            userweatherdetailscontainer.classList.remove("active");
            notfound.classList.add("active");
        }
        else{
            renderfunction(data);
            notfound.classList.remove("active");
            userweatherdetailscontainer.classList.add("active");
        }
    }
    catch(err){
        alert("Check Your Network and try again");
        // loadingcontainer.classList.remove("active");
        // notfound.classList.add("active");
    }
}

function renderfunction(data){
    // console.log("recieved data",data);
    const name=document.querySelector("[name-data]");
    const countryflag=document.querySelector("[country-flag]");
    const weatherdesc=document.querySelector("[weather-desc]");
    const weatherimg=document.querySelector("[weather-img]");
    const tempdata=document.querySelector("[temp-data]");
    const windspeeddata=document.querySelector("[windspeed-data]");
    const humiditydata=document.querySelector("[humidity-data]");
    const clouddata=document.querySelector("[cloud-data]");

    name.innerText=data?.name;
    countryflag.src=`https://flagcdn.com/16x12/${data?.sys?.country.toLowerCase()}.png`;
    weatherdesc.innerText=data?.weather?.[0]?.description;
    weatherimg.src=`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`;
    let temp=Number(`${data?.main?.temp}`)-273.15;
    tempdata.innerText=`${temp.toFixed(2)}°C`;
    windspeeddata.innerText=`${data?.wind?.speed}m/s`;
    humiditydata.innerText=`${data?.main?.humidity}%`;
    clouddata.innerText=`${data?.clouds?.all}%`;
    
}

const placeholderdata=document.querySelector("[placeholder-data]");
const originalplace=placeholderdata.placeholder;
searchweathercontainer.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=placeholderdata.value;
    if(cityname===""){
        return;
    }
    else{
        callwithcity(cityname);
        placeholderdata.value="";
        placeholderdata.placeholder=originalplace;
    }
});

async function callwithcity(cityname){
    try{
        notfound.classList.remove("active");
        searchweathercontainer.classList.add("active");
        loadingcontainer.classList.add("active");
        userweatherdetailscontainer.classList.remove("active");
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}`);
        let data=await response.json();
        // searchweathercontainer.classList.add("active");
        loadingcontainer.classList.remove("active");
        if(data?.cod==="404"){
            userweatherdetailscontainer.classList.remove("active");
            notfound.classList.add("active");
        }
        else{
            renderfunction(data);
            notfound.classList.remove("active");
            userweatherdetailscontainer.classList.add("active");
        }

        
    }
    catch(err){
        alert("Check Your Network and try again");
        // loadingcontainer.classList.remove("active");
        // notfound.classList.add("active");
    }
}

const grantaccess=document.querySelector("[grant-access]");
grantaccess.addEventListener("click",()=>{
    grantdetails();
});

function grantdetails(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation Support Available");
    }
}

function showPosition(position){
    let coords={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("location-coords",JSON.stringify(coords));
    locationcall(coords);
}




