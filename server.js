//richiamo la libreria http istanziando l'oggetto http
const express = require('express');
var fs = require('fs');
const app = express();
var bodyParser = require('body-parser');


const port = process.env.PORT || 8080;


//chiamo il metodo createServer() contenuto nell'oggetto http

app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

app.set('view engine', 'ejs');

/*app.get('/cronologia', function(req, res) {
    var names = ['Roberto', 'Giacomo', 'Davide'];
    res.render();

});*/

app.get('*', (req, res) => {
    res.send('404! This is an invalid URL.');
  });

 

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});



 
app.listen(port);
console.log('Server started at http://localhost:' + port);


app.post('/', function(req,res){
    console.log(req.body);
    var oggetto = req.body;
    var id = oggetto.id;
    fs.readFile('public/json/cronologia.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } 
        else {
        var obj = JSON.parse(data); //now it an object
        const index = obj.map(object => object.id).indexOf(id);
        console.log("indice: "+index);
        if (index >=0){
            obj.pop(obj[index])
        }
        console.log(obj);
        obj.push(req.body); //add some data
        var json = JSON.stringify(obj); //convert it back to json

        fs.writeFile('public/json/cronologia.json', json, function(err, result){
            if(err){
                console.log("errore");
            }
        }); // write it back 
    }});

})

