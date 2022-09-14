

self.addEventListener('message',function(e){
    
    let  value  = e.data[0].toLowerCase();
    let comuni=e.data[1];
    var j=0;
 
    //scorro tutto il json inserito in comuni
    for (var i = 0; i < comuni.length; i++){
        //vedo se il valore inserito corrisponde con un elemento nei comuni
        if (comuni[i].includes(value)){
            
          //verrà mostrato solo se ho inserito più di 3 caratteri o indexof è ancora indefinito
          if(value.length>=3 && typeof comuni[comuni.indexOf(value)] =="undefined"){
            if(j<10){
              //mostro un massimo di 10 elementi per volta 
              self.postMessage({'comune': comuni[i], 'indice':i})

                j++;
            }
            else{
              //esco dal ciclo
              i=comuni.length;
            }
            
          }

          else {
            //mostro un solo elemento
            self.postMessage({'comune': comuni[comuni.indexOf(value)], 'indice':comuni.indexOf(value)})
            i=comuni.length;
          }
           
           
        } 
       
        
    //pulisco la lista se ci sono meno di 3 caratteri (il comune col nome più breve ha solo 3 caratteri)
    }
    if(value.length<3){
      self.postMessage("pulisci");
    }
    console.log("termino");
  
    
})

