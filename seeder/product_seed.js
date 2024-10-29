const mongoose = require("mongoose");
const Product = require("../models/products");

mongoose
  .connect("mongodb://127.0.0.1:27017/shopDb_project")
  .then((result) => {
    console.log("Shop DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const products = [
  {
    name: "Kemeja Flanel",
    brand: "Hollister",
    price: 750000,
    color: "biru muda",
    category: ["Baju"],
    description:
      "Kemeja flanel dengan warna yang cerah, terbuat dari bahan flanel yang nyaman dan berkualitas tinggi.",
    condition: "baru",
    stock: 25,
 
  },
  {
    name: "Celana Chino",
    brand: "Levi's",
    price: 900000,
    color: "krem",
    category: ["Baju"],
    description:
      "Celana chino dengan warna yang cerah dan desain yang simpel, terbuat dari bahan katun yang nyaman dipakai.",
    condition: "baru",
    stock: 15,

  },
  {
    name: "Sweater",
    brand: "Gap",
    price: 650000,
    color: "merah muda",
    category: ["Celana"],
    description:
      "Sweater berkualitas tinggi dengan warna yang cerah dan desain yang simpel, cocok untuk kegiatan sehari-hari.",
    condition: "baru",
    stock: 20,
 
  },
  {
    name: "Sepatu Loafers",
    brand: "Gucci",
    price: 8000000,
    color: "coklat",
    category: ["Topi"],
    description:
      "Sepatu loafers dengan desain yang mewah dan elegan, terbuat dari bahan kulit yang berkualitas tinggi.",
    condition: "baru",
    stock: 6,

  },
];

Product.insertMany(products)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
