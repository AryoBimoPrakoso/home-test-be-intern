import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email sudah terdaftar" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  const ok = user && (await bcrypt.compare(password, user.password));
  // pesan sama untuk email salah / password salah (jangan bocorin mana yang salah)
  if (!ok) return res.status(401).json({ message: "Email atau password salah" });

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  res.json({ token });
}
