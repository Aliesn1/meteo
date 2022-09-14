//per la dark mode

function myFunction() {
    var element = document.body;
     element.classList.toggle("dark-mode");

   
    if (localStorage.getItem('darkMode')==1){
        
        localStorage.setItem('darkMode',0);
    }
    else if(localStorage.getItem("darkMode")==2){
        localStorage.setItem('darkMode',1);
    }
    else{
        
        localStorage.setItem('darkMode',1);

    }
    
   
 }

document.addEventListener("DOMContentLoaded", salva())



function salva(){

    
    if(typeof(localStorage.getItem('darkMode'))=='undefined'){
      
        localStorage.setItem('darkMode',0);
        console.log("sono entrato");
        
    }
    else if (localStorage.getItem("darkMode")==1){
        localStorage.setItem('darkMode',2);
    }
      console.log("come parto "+localStorage.getItem('darkMode'))
   
    if(localStorage.getItem('darkMode')==2){
        document.getElementById('mode').click();
        
    }
}


