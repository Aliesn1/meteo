const myWorker = new Worker("../java/worker.js");
const xhttp = new XMLHttpRequest();


//inserimento nella barra
const searchInput = document.querySelector("[data-search]");
//lista dei risultati
var risultati = document.getElementById("list");
console.log(risultati);
const cerca = document.getElementById("cerca");

//creo un array con i nomi dei comuni
let comuni = [];
//array dove inserire i dati del json
var dati =[];
//leggo il json
readJson();


searchInput.addEventListener("input", (event) =>{
  myWorker.postMessage([event.target.value,comuni]);
  pulisciLista();
  
})

myWorker.addEventListener('message', function(e){
  console.log("ho ricevuto "+e.data.comune);
  if(e.data.value=="pulisci" || typeof(e.data.comune)=="undefined"){
     pulisciLista();
  }
  else{
    console.log("scrivo "+e.data.comune);
    mostraLista(e.data.comune,e.data.indice);
  }
 
})





   
//aggiugno elementi alla lista mano a mano che vengono passati
async function mostraLista(app,i){
    
        
        //creo il link con i parametri in get da passare alla pagina
        var re= "/html/current_data.html?q=0&lat="+dati[i].lat+"&lon="+dati[i].lng+"&nm="+dati[i].comune;
        var li =document.createElement('li');
        //aggiungo il link
        li.innerHTML =app.link(re);
        li.appendChild(document.createTextNode(""));
        risultati.appendChild(li);
        
        
    
}

async function pulisciLista(){
    //pulisco la lista con id risultati
    $(risultati).empty();
}


//leggo il file json
async function readJson () {
    
    
    fetch('../json/italy_geo.json').then(response => {
        return response.json();
      }).then(data => {
        // Work with JSON data here
        
        var i = 0;
        
        data.forEach(element => {
          comuni[i]=element.comune;
          i++;

        });
        dati = data;
        comuni = comuni.toLocaleString().toLowerCase().split(',');
       
        
       
      }).catch(err => {
        console.error(err);
      });
 }



  

