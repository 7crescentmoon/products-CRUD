const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const multer = require('multer');
const fs = require('fs');
const app = express();

// models
const Product = require("./models/products");

// destination for file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    const mimeTypeImg = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + mimeTypeImg)
  }
})

const upload = multer({ storage: storage })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://127.0.0.1/shopDb_project")
  .then((result) => {
    console.log("Shop DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (res, req) => {
  req.render("home");
});

// show all
app.get("/products", async (req, res) => {
  const {category} = req.query
  if(category) {
    const products = await Product.find({category})
    res.render("Product/index", { products, category});
  }
  const products = await Product.find({});
  res.render("Product/index", { products, category: "All"});
});

// Create view
app.get("/products/create", (req, res) => {
  res.render("Product/create");
});

// Create
app.post("/products", upload.single('image') ,async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      image: req.file.filename
    });
    await product.validate();
    await product.save();

    res.redirect(`/products/${product._id}`);
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      res.status(400).send({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

// Edit view
app.get("/products/:productid/edit", async (req, res) => {
  const { productid } = req.params;
  try {
    const product = await Product.findById(productid);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("Product/edit", { product });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Edit
app.put("/products/:productid", upload.single('image') ,async (req, res) => {
  const { productid } = req.params;

  try {
    const updateProduct = await Product.findById(productid);

    if(!updateProduct) {
      return res.status(404).send("Product not found");
    }

    if (req.file) {
      const oldImage = path.join(__dirname, `public/images/${updateProduct.image}`);  
      if(fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage)
      }

    updateProduct.image = req.file.filename
    }

    await updateProduct.save({ runValidators: true });

    res.redirect(`/products/${updateProduct["_id"]}`);
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      res.status(400).send({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

// Show
app.get("/products/:productid", async (req, res) => {
  const { productid } = req.params;
  try {
    const product = await Product.findById(productid);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("Product/show", { product });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/products/:productid", async (req, res) => {
  const { productid } = req.params;
  
  try {
    const deleteProduct = await Product.findByIdAndDelete(productid);
    if (!deleteProduct) {
      return res.status(404).send("Product not found");
    }

    res.redirect("/products");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
})

app.listen(8080, () => {
  console.log("Server listen on localhost port : http://127.0.0.1:8080 ");
});
