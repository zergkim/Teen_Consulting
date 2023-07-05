const express = require('express');
const app = express();
const {Server} = require('socket.io');
const path = require('path');
const front_path = path.resolve(__dirname, '..', 'front');
const {Cursor, db, MongoClient, ObjectID} = require("mongodb")
const fs = require('fs/promises')
const cookieParser = require("cookie-parser");
const exp = require('constants');
const url = "mongodb+srv://zergkim:kimsh060525@atlascluster.ncm6aov.mongodb.net/";
const Mongo_Client = new MongoClient(url, { useUnifiedTopology: true });
let DBObj={};
(async function(){
    await Mongo_Client.connect()
    DBObj.DB=Mongo_Client.db('streamingdata')
    DBObj.Videodata=DBObj.DB.collection("videodataup")
    console.log('connected')
})();


app.use(express.text())
app.use(cookieParser())
app.use('/node_modules',express.static('./node_modules'))
app.use('/img',express.static('../files/img'))
app.use(express.raw({limit:'1gb'}));
app.use(express.json());
app.use('/Js_Codes',express.static('../front/js'))


app.use("/",async(req,res,next)=>{
    
    let LonginedOrNot_str = `${req.url}.html`
    if(req.cookies.id){//다 만들고 나중에 바꾸기
        LonginedOrNot_str = './logined' + LonginedOrNot_str
    }else{
        LonginedOrNot_str =  './'+LonginedOrNot_str
    }
    const Try_path = path.resolve(front_path, LonginedOrNot_str);
    if(!await Request_handler(res,Try_path)){
        req.url = '/error'
        next()
        
    }
    
    return;
})
app.get("/error",async(req,res)=>{
    res.sendFile(path.resolve(front_path, 'Error.html'))
})



const Http_Server = app.listen(8000,()=>{

})

async function Request_handler(res,link){
    try{
        await fs.access(link);
        res.sendFile(link);
        return 1;
    }catch(e){
        return 0;
    }
    
}