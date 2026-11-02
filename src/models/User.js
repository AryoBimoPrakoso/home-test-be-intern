import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select:false -> password tidak ikut keluar kecuali diminta eksplisit
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
