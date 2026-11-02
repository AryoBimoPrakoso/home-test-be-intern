import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  email: z.string().trim().email("Format email tidak valid"), 
  password: z.string().min(6, "Password minimal 6 karakter"),
});
export const loginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const itemFields = {
  name: z.string().trim().min(1, "Nama wajib diisi"),
  description: z.string().trim().optional(),
  stock: z.number({ invalid_type_error: "Stok harus berupa angka" }).int("Stok harus bilangan bulat").min(0, "Stok tidak boleh negatif"),
  price: z.number({ invalid_type_error: "Harga harus berupa angka" }).min(0, "Harga tidak boleh negatif"),
};

export const createItemSchema = z.object(itemFields);

// PUT: semua field opsional, tapi minimal satu harus ada.
// Field di luar schema (mis. createdBy) otomatis dibuang oleh zod.
export const updateItemSchema = z
  .object(itemFields)
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, { message: "Minimal satu field harus diisi" });
