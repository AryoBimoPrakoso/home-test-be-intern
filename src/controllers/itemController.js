import mongoose from "mongoose";
import Item from "../models/Item.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /items?search=kabel&page=1&limit=10
export async function listItems(req, res) {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  const search = String(req.query.search || "").trim();

  const filter = {};
  if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };

  const [data, total] = await Promise.all([
    Item.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Item.countDocuments(filter),
  ]);

  res.json({
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function createItem(req, res) {
  const item = await Item.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(item);
}

export async function updateItem(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Format ID tidak valid" });
  }

  const item = await Item.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true, // tanpa ini, update bisa lolos dengan stok negatif
  });
  if (!item) return res.status(404).json({ message: "Barang tidak ditemukan" });

  res.json(item);
}

export async function deleteItem(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Format ID tidak valid" });
  }

  const item = await Item.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ message: "Barang tidak ditemukan" });

  res.json({ message: "Barang berhasil dihapus" });
}
