const express = require('express');
const { appendFileSync } = require('fs');
const { platform } = require('os');
const path=require('path')
const app = express();
const pug = require("pug");
//maybe using nodemon in it is not a bad choice tbh
app.use(express.static("public"));

app.use('/css',express.static(__dirname+'/style'))

let data=require('./movie-data.json')
//console.log(data.length)
let dataUpdate=[]
for(a=0;a<data.length;a++){
    dataUpdate.push(data[a])
}

let peopleData=[]
console.log(dataUpdate[0].Actors)
//iterate thru all the dataUpdate details
//then proceed thru each Actors Directors Writers Section amd append it to the people Data and then
//use set to segregate out the unique terms
//Actors
//Directors
//Writer
let Actors=dataUpdate[0].Writer;
//console.log(dataUpdate[0])
let acttes=[]
for(let a=0;a<Actors.length;a++){
    acttes.push(Actors[a])
}
//console.log(acttes)

let act=[]
for(a=0;a<dataUpdate.length;a++){
    //Actors
    let Actors=dataUpdate[a].Actors
    for(let b=0;b<Actors.length;b++){
        act.push(Actors[b]+ ' (Actor)')
    } 
    //Writers
    let writer=dataUpdate[a].Writer
    for(let b=0;b<writer.length;b++){
        act.push(writer[b]+ ' (Writer)')
    }
    //act=[...new Set(act)]   
    //Directors 
    let director=dataUpdate[a].Director
    for(b=0;b<director.length;b++){
        act.push(director[b]+ ' (Director)')
    }
    act=[...new Set(act)]  
}

console.log(act.length)
//using set remove all the repeated people

app.set('views', './pages');
app.set('view engine', 'pug');

app.get('/',(req,res)=>{
    //console.log(dataUpdate.length)
    res.status(200).render('home',{movies:dataUpdate})
})

app.get('/movieInfo',(req,res)=>{
    res.status(200).render('movie-info')
})

app.get('/actorLookup',(req,res)=>{
    res.status(200).render('actor_home',{name:act})
})

app.get('/actorTest',function(req,res){
    res.status(200).render('actor')
})

app.get('/searchMov',searchMov)
app.get('/searchPeep',searchPeep)
app.get('/movies/:mid',getMovieDetails)

//take in the input for the movie name
//then we search thru the data and if there are matches in data set then 
//pass them onto the pug file and render the home page in a suitable fashion
function searchMov(req,res,next){
    let b= req.query.searchMovie
    let movPs=[]
    for(c=0;c<dataUpdate.length;c++){
        let d=dataUpdate[c].Title.toLowerCase()
        if(d.includes(b.toLowerCase())){
            movPs.push(dataUpdate[c])
        }
    }
    res.status(200).render('home',{movies:movPs})
}

function getMovieDetails(req,res){
    let a=req.params.mid
    //console.log(a)
    let chosenOne=[]
    //now we are going to search for that movie
    //iterate thru the collection
    simi=getSimilarMovies(a);
    for(b=0;b<dataUpdate.length;b++){
        if(dataUpdate[b].Title==a){
            chosenOne.push(dataUpdate[b])
        }
    }
    //console.log(chosenOne)
    res.status(200).render('movie-info',{chosen:chosenOne,similar:simi})
}

//similar movies from the chosen movie data based off of the 

function getSimilarMovies(movName){
    let sim=[]
    let k=[]
    for(a=0;a<dataUpdate.length;a++){
        if(dataUpdate[a].Title==movName){
            k.push(dataUpdate[a])
        }
    }
    lm=0
    for(a=0;a<dataUpdate.length;a++){
        if(dataUpdate[a].Title!=movName){
            for(d=0;d<dataUpdate[a].Genre.length;d++){
                //console.log(dataUpdate[a].Title)
                if(sim.length<5){
                    if(k[0].Genre.includes(dataUpdate[a].Genre[d])){
                        //if(sim.includes(dataUpdate[a]))
                        if(sim.includes(dataUpdate[a])<1 && sim.length<5){
                            sim.push(dataUpdate[a]);
                        }
                    }
                }
            }
        }
    }
    //console.log(sim)
    return sim;
}

//now for lookin up all actors in the data and looking thru their contributions and also through their ppl they
//collabed with
function searchPeep(req,res,next){
    //console.log("test passed")
    let b= req.query.searchPeople;
    console.log(b)
    b=b.toLowerCase()
    let c=[];
    for(a=0;a<act.length;a++){
        if(act[a].toLowerCase().includes(b)){
     //       console.log(act[a]);
            c.push(act[a])
        }
    }
    res.status(200).render('actor_home',{name:c})
}


app.listen(3000)
console.log("listening on port 3000")