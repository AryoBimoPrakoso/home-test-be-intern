import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Nama wajib diisi"], trim: true },
    description: { type: String, trim: true, default: "" },
    stock: {
      type: Number,
      required: [true, "Stok wajib diisi"],
      min: [0, "Stok tidak boleh negatif"],
      validate: { validator: Number.isInteger, message: "Stok harus bilangan bulat" },
    },
    price: {
      type: Number,
      required: [true, "Harga wajib diisi"],
      min: [0, "Harga tidak boleh negatif"],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
