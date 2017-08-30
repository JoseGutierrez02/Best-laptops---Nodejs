var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app_password = "1234";
var method_override = require("method-override");
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
    })
    var upload = multer({
      storage: storage
    })
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
app.use(method_override("_method"));

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

app.get("/productos",function(req,res){
  Product.find(function(error,documento){
    if(error){ console.log(error);}
    res.render("productos/index",{ products: documento })
  });
});

app.put("/productos/:id", function(req,res){
  if(req.body.password == app_password){
    var data = {
      title: req.body.title,
      description: req.body.description,
      pricing: req.body.pricing
    };
    Product.update({"_id": req.params.id}, data, function(product){
      res.redirect("/productos");
    });
  }else{
    res.redirect("/");
  }
});

app.get("/productos/edit/:id", function(req,res){
  var id_producto = req.params.id;
  console.log(id_producto);
  Product.findOne({"_id": id_producto}, function(error,producto){
    console.log(producto);
    res.render("productos/edit",{ product: producto });
  });
});

app.post("/admin", function(req,res){
  if(req.body.password == app_password){
    Product.find(function(error,documento){
      if(error){ console.log(error);}
      res.render("admin/index",{ products: documento })
    });
  }
  else{
    res.redirect("/");
  }
});

app.get("/admin", function(req,res){
  res.render("admin/form");
});

app.post("/productos", upload.single('image'), function(req,res,next){
  if(req.body.password == app_password){
    var data = {
      title: req.body.title,
      description: req.body.description,
      imageUrl: "data.png",
      pricing: req.body.pricing
    }

    var product = new Product(data);

    cloudinary.uploader.upload(req.file.path,
      function(result) {
        product.imageUrl = result.url;
        product.save(function(err){
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
