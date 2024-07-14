const express=require('express');
const app=express();
const fs=require("fs");
const path=require('path');

// app.set("views",path.join(__dirname, "views"))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    fs.readdir('./files',function(err,files){
    res.render('index',{ files:files });
    })
})

app.post('/add',function(req,res){
      var title=req.body.title;
      var desc=req.body.desc;
      const words=title.split(' ');
      const newTitle=words.map((value,index)=>{
             if(index===0) return value.toLowerCase();
             else return value.charAt(0).toUpperCase()+value.slice(1).toLowerCase();
      })
      const camelTitle= newTitle.join('');
      fs.writeFile(`./files/${camelTitle}`,`${desc}`,function(err){
        if(err)console.log(err.message);
        else res.redirect('/');
      })
})
app.get('/files/:filesname',function(req,res){
    var title=req.params.filesname;
    fs.readFile(`./files/${title}`,function(err,data){
        if(err)console.log(err.message);
        else  res.render('files',{content:data ,title:title})
    })
})

app.get('/edit/:filesname',function(req,res){
    var title=req.params.filesname;
    fs.readFile(`./files/${title}`,function(err,data){
        if(err) console.log(err.message);
        else res.render('edit',{content:data,title:title})
    })
})
app.post('/new/:filesname',function(req,res){
    var title=req.params.filesname;
    var newContent=req.body.newdesc;
    fs.writeFile(`./files/${title}`,`${newContent}`,function(err){
        if(err)console.log(err.message);
        else res.redirect('/');
    })
})
app.listen(3000);
