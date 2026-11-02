export function notFound(req, res) {
  res.status(404).json({ message: "Route tidak ditemukan" });
}

export function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Body JSON tidak valid" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Data sudah ada (duplikat)" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })),
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Format ID tidak valid" });
  }
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
}
