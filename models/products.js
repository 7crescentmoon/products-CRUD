const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    brand: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      color: {
        type: String,
        required: true,
      },
      category: [
        {
          type: String,
          enum: ['Baju', 'Celana', 'Topi', 'Aksesoris', 'Jaket']
        },
      ],
      description: {
        type: String,
        required: true,
        maxLength: 150,
      },
      condition: {
        type: String,
        enum: ["baru", "baru"],
        required: true,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
      },
      image: {
        type: String,
        required: true,
      }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product