const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

mongoose.connect('mongodb://localhost/TechnoZoo',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  

// App Config
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

//Mongoose/Model/Config
const BlogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type: Date, default: Date.now}
});
const Blog = mongoose.model('Blog', BlogSchema);

//Routes
app.get('/',(req,res)=>{
    res.render('landing');
});
// indexroute
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err)
            console.log(err);
        res.render('index',{blogs : blogs});
    });
});
//newroute
app.get('/blogs/new',(req,res)=>{
    res.render('new');
});
//createroute
app.post('/blogs',(req,res)=>{
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.create(req.body.blogs, (err,newBlog)=>{
        if(err)
            res.render('new');
        else
            res.redirect('/blogs');
    });
});
//showroute
app.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id, (err,foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.render('show',{blogs:foundBlog});
        }
    });
});
//editroute
app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById(req.params.id, (err,foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.render('edit',{blogs:foundBlog});
        }
    });
});
//updateroute
app.put('/blogs/:id',(req,res)=>{
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blogs,(err,updatedBlog)=>{
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs/'+req.params.id);
        }
    });
});
//deleteroute
app.delete('/blogs/:id',(req,res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs');
        }
    });
});

app.listen(process.env.PORT || 8080);

