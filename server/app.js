const express = require('express');
const MongoDB = require('mongodb');
const cors = require('cors');
const fs = require('fs');
const app = express();
const session = require('express-session');
app.use(express.json({limit:'100mb'}));
app.use(cors({origin:'http://localhost:8000',credentials:true}));
const PORT = 3000;
const client = new MongoDB.MongoClient('mongodb+srv://user:user@cluster0.n3vivf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.use(session({
  secret: 'your-secret-key',
  resave: 'false',
  saveUninitialized: 'false',
  cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'strict'
  }
}));


var logindata;
fs.readFile('logininfo.json','utf8',(error,data)=>{
    if(error) console.log("File not found");
    else {
        logindata=JSON.parse(data);
    }
})

const authMiddleware =(req,res,next)=>{
  if(req.session.username){
    next();
  }
  else {
    res.status(401).send("Unauthorized");
  }
}

let db;
connect=async ()=>{
    try {
    await client.connect();
    await client.db('user').command({ping:1});
    console.log('Connected to MongoDb');
    db=client.db('Database');
}
catch (errror){
    console.log("Failed to connect to MongoDb");
}}
connect().then(()=>{
    app.listen(PORT,()=>{
        console.log('Server is running on port ' + PORT);
    })
    app.get("/", async (req, res) => {
        let collectionMonsters = await db.collection("Monsters");
        let query = { };
        let results = await collectionMonsters.find(query).toArray();
      
        if (!results) res.send("Not found").status(404);
        else res.send(results).status(200);
      });
      
      // all Elder Dragons.
      app.get("/geted", async (req, res) => {
        let collectionMonsters = await db.collection("Monsters");
        let query = { Elder_Dragon :  true };
        let results = await collectionMonsters.find(query).toArray();
      
        if (!results) res.send("Not found").status(404);
        else res.send(results).status(200);
      });
      
      // monsters by category
      app.get("/filter/:category", async (req, res) => {
        let collectionMonsters = await db.collection("Monsters");
        let query= null;
        try{
            query = { Category: req.params.category };
        }
        catch(error){
            console.log(error);
            return;
        }
        let result = await collectionMonsters.find(query).toArray();
        if (!result) res.send("Not found").status(404);
        else res.send(result).status(200);
      });
      
      // filter by monster difficulty
      app.get("/diff/:min/:max", async (req, res) => {
        let collectionMonsters = await db.collection("Monsters");
        let diff_min=parseInt(req.params.min);
        let diff_max=parseInt(req.params.max);
        if(!diff_min) diff_min=0;
        if(!diff_max) diff_max=10;
        let query1={};
        let query2={};
        if(!isNaN(diff_min)){
          query1={Difficulty:{$gte: diff_min}};
        }
        if(!isNaN(diff_max)){
          query2={Difficulty:{$lte: diff_max}};
        }
        let results = await collectionMonsters.find({ $and: [query1,query2]}).toArray();
        if (!results) res.send("Not found").status(404);
        else res.send(results).status(200);
      });
      
      
      // single monster by id
      app.get("/id/:id", async (req, res) => {
        let collectionMonsters = await db.collection("Monsters");
        let query= null;
        try{
            query = { _id: new MongoDB.ObjectId(req.params.id) };
        }
        catch(error){
            console.log(error);
            return;
        }
        let result = await collectionMonsters.findOne(query);
        if (!result) res.send("Not found").status(404);
        else{
          res.send(result).status(200);
        }
      });
      
      app.post('/login',(req,res)=>{
        let ok=0;
        for(i in logindata){
            if (logindata[i].username==req.body.username && logindata[i].password==req.body.password){
              req.session.username=req.body.username;
              req.session.save();
              res.send(logindata[i].info);
              res.status(200);
              ok=1;
            }
        }
        if(ok==0) res.send("Incorrect login info").status(401);
      })

      app.post('/logout',(req,res)=>{
        req.session.destroy(err=>{
          if(err){
            return res.status(500).send('Logout failed');
          }
          res.status(200).send('Logout successful');
        })
      })

      app.post('/register',  (req,res)=>{
        let ok=0;
        try{ 
            for(i in logindata){
                if (logindata[i].username==req.body.username){
                    res.status(400).send("This username is already in use");
                    ok=1;
                }
            }
            if(ok==0) {
                let x=Object.keys(logindata).length+1;
                logindata['user'+x]=req.body;
                req.session.username=req.body.username;
                req.session.save();
                fs.writeFileSync('logininfo.json',JSON.stringify(logindata),'utf-8');
                fs.readFileSync('logininfo.json','utf8',(error,data)=>{
                  if(error) console.log("File not found");
                  else {
                        logindata=JSON.parse(data);
                    }
                })
                res.send("Account created succesfully").status(200);
            }
        }
        catch {
            res.send("Something went wrong").status(400);
        }
      })
      // new monster
      app.post("/",authMiddleware , async (req, res) => {
        try {
      
          let newDrops = req.body.Drops.map(d=>{
            let dropsId = new MongoDB.ObjectId();
            return { ...d, _id : dropsId };
          });
          let newDocument = {
            Name: req.body.Name,
            Category: req.body.Category,
            Drops: newDrops,
            Difficulty: req.body.Difficulty,
            Elder_Dragon: req.body.Elder_Dragon
          };
          let collectionMovies = await db.collection("Monsters");
          let result = await collectionMovies.insertOne(newDocument);
          res.send(result).status(204); //no content to the client
        } catch (err) { 
          res.status(500).send("Error adding monster");
       }
      });
      
      app.patch('/login',  (req,res)=>{
        let ok=0;
        try{
            for(i in logindata){
                if (logindata[i].username==req.body.username && logindata[i].password==req.body.password){
                    logindata[i].info=req.body.info;
                    fs.writeFileSync('logininfo.json',JSON.stringify(logindata),'utf-8');
                    fs.readFile('logininfo.json','utf8',(error,data)=>{
                      if(error) console.log("File not found");
                      else {
                            logindata=JSON.parse(data);
                        }
                    })
                    res.send("Data modified succesfully").status(200);
                    ok=1;
                }
            }
            if(ok==0) res.send("Account does not exist").status(404);
        }
        catch {
            res.send("Something went wrong").status(400);
        }
      })

      // update monster by id.
      app.patch("/:id", authMiddleware, async (req, res) => {
        try {
          const query = { _id: new MongoDB.ObjectId(req.params.id) };
          let newDrops = req.body.Drops.map(d=>{
            let dropsId = new MongoDB.ObjectId();
            return { ...d, _id : dropsId };
          });
          const updates = {
            $set: {
              Name: req.body.Name,
              Category: req.body.Category,
              Drops: newDrops,
              Difficulty: req.body.Difficulty,
              Elder_Dragon: req.body.Elder_Dragon
            },
          };
          let collectionMonsters = await db.collection("Monsters");
          let result = await collectionMonsters.updateOne(query, updates);
          res.send(result).status(200);
        } catch (err) {
          res.status(500).send("Error updating monster");
        }
      });
      
      app.delete('/login',authMiddleware,  (req,res)=>{
        let ok=0;
        try{
            for(i in logindata){
                if (logindata[i].username==req.body.username && logindata[i].password==req.body.password){
                    delete logindata[i];
                    fs.writeFileSync('logininfo.json',JSON.stringify(logindata),'utf-8');
                    fs.readFile('logininfo.json','utf8',(error,data)=>{
                      if(error) console.log("File not found");
                      else {
                            logindata=JSON.parse(data);
                        }
                    })
                    res.send("Data modified succesfully").status(200);
                    ok=1;
                }
            }
            if(ok==0) res.send("Account does not exist").status(404);
        }
        catch {
            res.send("Something went wrong").status(400);
        }
      })

      // delete a monster
      app.delete("/:id",authMiddleware, async (req, res) => {
        try {
          const query = { _id: new MongoDB.ObjectId(req.params.id) };
      
          const collectionMonsters = db.collection("Monsters");
          let result = await collectionMonsters.deleteOne(query);
      
          res.send(result).status(200);
        } catch (err) {
          res.status(500).send("Error deleting monster");
        }
      });
      app.use((req,res)=>{
        res.status(404);
        res.send("<h1>Not found</h1>");
      });
});