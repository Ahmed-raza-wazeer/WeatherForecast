const userTab= document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container");

const  grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const error =document.querySelector(".error");
const errorImage =document.querySelector(".errorImg")
//intially variables needs
let currentTab = userTab;
const API_KEY = "77b2ac3fa81a92f862a442997e7c144e";
currentTab.classList.add("current-Tab");
getfromSessionStorage( );



function switchTab(clickedTab)
{
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-Tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-Tab");


        if(!searchForm.classList.contains("active") ) {
              userInfoContainer.classList.remove("active");
              grantAccessContainer.classList.remove("active");
              searchForm.classList.add("active");  
        }
        else 
        {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorImage.classList.remove("active");


            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click" , () =>{
    switchTab(userTab);
})

searchTab.addEventListener("click" , () =>{
    switchTab(searchTab);
})


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinate");
    
    if(!localCoordinates){
        grantAccessContainer.classList.add("active")
    }

    else{
        const coordinates =JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}



async function fetchUserWeatherInfo(coordinates){
    const {lat,long } = coordinates ;

    //making grant container invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        errorImage.classList.remove("active");
        renderWeatherInfo(data);
        console.log(data);
        }



        catch(err) {
             const er= "Something went wrong";
             error.textContent =er;

        }
    }

    function renderWeatherInfo(weatherInfo) {
        //first we have fetch the elements
      

       
    //    if(weatherInfo.city === "undefined"){
    //     errorImage.classList.add("active");
    //       userInfoContainer.classList.remove("active");
    //    }
        
        const city = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-cloudiness]");
        
        //fetching the values from weatherInfo object and put it UI element
        city.innerHTML = weatherInfo?.name;
        countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src =`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`; 
         temp.innerText = `${weatherInfo?.main?.temp}°C`;
         windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
         humidity.innerText = `${weatherInfo?.main?.humidity}%`;
         cloudiness.innerText = `${weatherInfo?.clouds.all}%`; 
    }

    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);

        }
        else
        {

        }
    }


    function showPosition(Position){
        const userCoordinates={
            lat : Position.coords.latitude,
            long : Position.coords.longitude,
        }
        sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates))
        fetchUserWeatherInfo(userCoordinates)
        
    }
    
 const grantAccessButton= document.querySelector("[data-grantAccess]");
 grantAccessButton.addEventListener("click",getLocation);


let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    if(searchInput.value === "") return;

    fetchSearchWeatherInfo(searchInput.value);

});
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        
        if(data.cod == "404"){
            loadingScreen.classList.remove("active");
            errorImage.classList.add("active");
            userInfoContainer.classList.remove("active");
        }
        else{
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);}
        


    }
    
    catch(err)
    {
        
            errorImage.classList.add("active");
            userInfoContainer.classList.remove("active");

    }


}

 
 

