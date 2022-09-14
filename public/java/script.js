 var cache = [];
 const cardTemplate = document.querySelector("[card-template]");
 const cardContainer = document.querySelector("[card-container]");



//funzione riutilizzabile
const sendHttpRequest = (method,url) =>{

    const promise = new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open(method,url);
        xhr.responseType = 'json';

        xhr.onload = () =>{
            if (xhr.status >= 400){
                reject(xhr.response);
            }
            else{
                resolve(xhr.response);
            }
            
        }
        xhr.onerror = () =>{
            reject('Si è verificato un errore');
        };


        xhr.send();

    })
    return promise;

    
}
 


async function getWeather(){
    for (var n=1; n<4;n++){

    var city = new Object();
  
    var citta = document.getElementsByClassName("citta"+n);
    console.log(citta.città.innerText);
    citta.città.innerText.toLowerCase();
    var response = await
    
    

    fetch("https://api.openweathermap.org/data/2.5/weather?q="+citta.città.innerText+",IT&units=metric&appid={Your_api_key}&lang=it", {
        method:'GET',
    });

    var jsonObj = await response.json();
    console.log(jsonObj);
    
    //navigazione all'interno del file json richiesto tramite API
    
    

    
    citta.description.innerText=jsonObj.weather[0].description;
    citta.weathertemp.innerText=jsonObj.main.temp+"°";
    citta.icona.src="http://openweathermap.org/img/wn/"+ jsonObj.weather[0].icon+"@2x.png";

    //carico nel session storage i nomi delle città

        console.log("Nome: "+ citta.città.innerText);
        city.name=citta.città.innerText;
        city.lat=jsonObj.coord.lat;
        city.lon=jsonObj.coord.lon;
        cache.push(city);
        console.log("city: "+city.name);

    getImage(citta);
    }

    //salvo nel session storage la lista delle città con latitudine e longitudine
    sessionStorage.setItem('cities', JSON.stringify(cache));

    
}


//funzione per le immagini da unsplash
const getImage = (citta) =>{
    
    sendHttpRequest('GET',"https://api.unsplash.com/search/photos?query="+citta.città.innerText+"&client_id={Your_api_key}").then(response =>{

        const data = response;
        citta.immagine.src= data.results[0].urls.full;

    });
   
}

const sevenDays = (lat, lon) => {

    
    
    sendHttpRequest('GET',"https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely&appid={Your_api_key}&lang=it").then(response =>{
        const jsonObj = response;
        var table = document.getElementById("previsioni");
        var j=0;
        for(var i=0;i<8;i++){
            j=0;
            //ottengo il nome del giorno della settimana
            var dayname = new Date(jsonObj.daily[i].dt * 1000).toLocaleDateString("it", { weekday: "long", });
            var immagine = document.createElement("img");
            immagine.src="http://openweathermap.org/img/wn/"+ jsonObj.daily[i].weather[0].icon+"@2x.png";
            table.rows[i+1].cells[j].innerText=dayname;
            table.rows[i+1].cells[j].appendChild(immagine);
            

            j++;
            //calcolo la data
            var sec = jsonObj.daily[i].sunrise;
            var date = new Date(sec * 1000);
            var timestr = date.toLocaleTimeString();
            table.rows[i+1].cells[j].innerText=timestr;
            j++;


            var sec = jsonObj.daily[i].sunset;
            var date = new Date(sec * 1000);
            var timestr = date.toLocaleTimeString();
            table.rows[i+1].cells[j].innerText=timestr;
            j++;

            //massima e minima
            var tempMax = jsonObj.daily[i].temp.max-273.15;
            tempMax = Math.ceil(tempMax);
            
            var tempMin = jsonObj.daily[i].temp.min-273.15;
            tempMin = Math.ceil(tempMin);
            table.rows[i+1].cells[j].innerText=tempMax+"°/"+tempMin+"°";
            j++;
            
            //umidità
            var sec = jsonObj.daily[i].humidity;
            table.rows[i+1].cells[j].innerText=sec+"%";
            j++;

            var desc = jsonObj.daily[i].weather[0].description;
            table.rows[i+1].cells[j].innerText=desc;
            j++;
            

           
            
        }

        nextHours(jsonObj);
        

        }) 

    
    
    
}

async function nextHours(jsonObj){
    
    var ore = document.getElementsByClassName("hour");

    for(var i=0;i<24;i++){

        //children[0] = time
        //childern[1] = icona
        //children[2] = temperatura
        
        var sec = jsonObj.hourly[i].dt;
        var date = new Date(sec * 1000);
        var timestr = date.toLocaleTimeString();
        

        //inserisco nei nodi children dei div con classe hour le ore
        ore[i].children[0].innerText=timestr;

        //converto la temperatura
        var temperatura = jsonObj.hourly[i].temp-273.15;
        
        //converto il numero in stringa
        temperatura = Math.ceil(temperatura);
        ore[i].children[2].innerText=temperatura+"°";

        var description = jsonObj.hourly[i].weather[0].description;
        
        ore[i].children[3].innerText = description;

        
        ore[i].children[1].children[0].src="http://openweathermap.org/img/wn/"+ jsonObj.hourly[i].weather[0].icon+"@2x.png";
        
    }
    

}


//cronologia

window.onload = (event) =>{
  console.log("cookie "+document.cookie.split('=')[1]);
    if (typeof(document.cookie.split('=')[1])=="undefined"){
      console.log("ho creato un id");
        let uniqueID = makeid(15);
        console.log(uniqueID);
        const daysToExpire = new Date(2147483647 * 1000).toUTCString();
       // document.cookie = "id ="+ uniqueID;  expires=' + daysToExpire;
        document.cookie = 'id + =' + uniqueID + '; expires=' + daysToExpire;
      
      }

}
  
  
  
  
  async function cronoJson (client_id, name) {
      
      
    fetch('../json/cronologia.json').then(response => {
        return response.json();
      }).then(data => {
        // Work with JSON data here
        var i = 0;
        var app = [];
     
        data.forEach(element => {
          if(element.id == client_id){
            app = element.visited;
            
          }       
        });
            if(app.indexOf(name)<0){
                app.push(name);
            }
           
            


              fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                   
                      id : ""+document.cookie.split('=')[1]+"",
                      visited: app
                    
                })
            });
        
      })
    }
  
  //creo un id univoco per i cookie
    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }


  //riempiamo con la cronologia

  async function visualizza_crono (client_id){

    console.log(cardTemplate);
    var app = [];
    fetch('../json/cronologia.json').then(response => {
        return response.json();
      }).then(data => {
        // Work with JSON data here
        
        
     
        data.forEach(element => {
          if(element.id == client_id){
            app = element.visited;
           
          }       
        });

       
        if (app.length<=0){
            alert("Non hai una cronologia");
        }
        else{

            
            for (var j= app.length-1; j!= app.length-11 && j!=-1;j--){

                const card = cardTemplate.content.cloneNode(true).children[0];
                const header = card.querySelector("[data-header]");
                const body = card.querySelector("[data-body]");
                console.log(app[j]);
                console.log(card.getElementsByTagName('a')[0]);
                

                sendHttpRequest('GET',"https://api.openweathermap.org/data/2.5/weather?q="+app[j]+",IT&units=metric&appid={Your_api_key}&lang=it").then(response =>{
                const jsonObj = response;
                header.textContent = jsonObj.name;
                    
                body.getElementsByTagName('h5')[0].textContent="Temperatura: "+ jsonObj.main.temp+"°";
                body.getElementsByTagName('p')[0].textContent="Descrizione: "+ jsonObj.weather[0].description;
                body.getElementsByClassName('icon')[0].children[1].src= "http://openweathermap.org/img/wn/"+ jsonObj.weather[0].icon+"@2x.png";
                
                card.getElementsByTagName('a')[0].href="/html/current_data.html?q=0&lat="+jsonObj.coord.lat+"&lon="+jsonObj.coord.lon+"&nm="+jsonObj.name;
                
                cardContainer.append(card);
            

                })                 
               

            }

        }

    });
    


  }
