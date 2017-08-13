var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: "armandog",
  api_key: "965259264512323",
  api_secret: "wmvltjQtUA7EHhWbw_uKx3Hyjy4"
});

var app = express();
mongoose.connect("mongodb://localhost/primera_pagina");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Definir el schema de nuestros productos
var productSchema = {
  title: String,
  description: String,
  imageUrl: String,
  pricing: Number
};

var Product = mongoose.model("Product", productSchema);
app.set("view engine","jade");

app.use(express.static("public"));

app.get("/",function(req,res){

  // end.send(":3");
  res.render("index");
});

app.post("/productos", upload.single('image'),function(req,res,next){
  if(req.body.password == "1234"){
    var data = {
      title: req.body.title,
      description: req.body.description,
      imageUrl: "data.png",
      pricing: req.body.pricing
    }

    var product = new Product(data);

    cloudinary.uploader.upload(req.file.image.path,
      function(result) {
        product.imageUrl = result.url;

        product.save(function(err){
          console.log(product);
          res.render("index");
        });
      });
  }
  else
  {
    res.render("productos/new");
  }

});

app.get("/productos/new",function(req,res){

  res.render("productos/new");

});

app.listen(8080);
