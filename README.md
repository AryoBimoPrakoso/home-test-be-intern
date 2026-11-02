# HOME TEST BE INTERN

RESTful API Sistem Manajemen Inventaris Barang (Node.js, Express 5, MongoDB Atlas, JWT).

## Setup Database (MongoDB Atlas)
1. Membuat akun dan login ke MongoDB Atlas
2. Membuat Cluster terlebih dahulu, lalu ada button "Connect"
3. Ada beberapa pilihan, namun pada project ini pilih "MongoDB for VS CODE"
4. Terdapat link database, lalu copy saja. Contoh : mongodb+srv://<user>:<db_password>@cluster0.nqowovq.mongodb.net/<nama_db>
5. Pada link tersebut, terdapat user dan db_password diisi sesuai dengan db dan password yang dibuat
6. Ketika sudah mendapatkan akses MongoDB Atlas, jalankan di terminal cp .env.example .env lalu sesuaikan dengan akses yang didapat

## Menjalankan
```bash
bun install
cp .env.example .env     # isi MONGO_URI dan JWT_SECRET
bun run dev
```

## Endpoint
| Method | Path | Auth | Keterangan |
|---|---|---|---|
| POST | /auth/register | - | name, email, password |
| POST | /auth/login | - | mengembalikan `token` |
| GET | /items?search=&page=&limit= | Bearer | daftar barang + pagination |
| POST | /items | Bearer | name, description, stock, price |
| PUT | /items/:id | Bearer | update sebagian/seluruh field |
| DELETE | /items/:id | Bearer | hapus barang |

## Contoh
```bash
curl -X POST localhost:3000/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Aybo","email":"aybo@mail.com","password":"rahasia123"}'

curl -X POST localhost:3000/auth/login -H "Content-Type: application/json" \
  -d '{"email":"aybo@mail.com","password":"rahasia123"}'

curl -X POST localhost:3000/items -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"name":"Kabel USB","description":"1 meter","stock":50,"price":15000}'

curl "localhost:3000/items?search=kabel&page=1&limit=10" -H "Authorization: Bearer <TOKEN>"
```

## Validasi
- Stok: integer, minimal 0 (dicek di zod dan di schema Mongoose, plus `runValidators` saat update).
- Harga: angka, minimal 0.
- Error validasi -> 400, tidak login -> 401, data tidak ada -> 404, email duplikat -> 409.


## Pertanyaan Wajib
1. Alur Request: Jelaskan alur perjalanan sebuah request dari saat API dipanggil oleh client hingga data tersimpan di database. (Misal: Router -> Middleware -> Controller -> Service -> Repository). Mengapa Anda memisahkan logic seperti itu?
  Jawab : Pada home-test-be-intern ini memiliki alur Router → Middleware → Controller → Model. Model mongoose sekaligus menjadi akses ke database, Middleware merupakan urusan yang berlaku di banyak route (auth, validasi) ditulis sekali dapat digunakan dimana saja. Controller berfungsi untuk mengurus request dan response, Model berfungsi untuk bentuk data dan database. Request masuk lewat express.json(), diarahkan router ke /items, lalu melewati middleware auth yang memverifikasi JWT, kemudian middleware validasi zod. Setelah lolos, controller memproses dan menyimpannya lewat model Mongoose ke MongoDB Atlas. Error ditangkap error handler terpusat. Saya memisahkan logic ini supaya tiap bagian punya satu tanggung jawab.

2. Keamanan & Token: Dimana sebaiknya frontend menyimpan token JWT yang dikembalikan oleh API ini (Local Storage atau HttpOnly Cookie)? Apa alasan dan risiko keamanannya?
  Jawab : Menurut saya, sebaiknya HttpOnly Cookie. Karena, localStorage seperti dapat diakses siapa saja. Misalnya, dapat diakses melalui celah XSS. HttpOnly cookie kemungkinan token tidak bisa dibaca oleh Javascript. 

3. Penanganan Konkurensi (Concurrency): Misalkan API Anda dipublish ke publik, lalu ada 2 user yang secara TEPAT BERSAMAAN melakukan request untuk mengurangi stok barang X (stok tersisa: 1). Bagaimana cara Anda mencegah stok menjadi -1 di database?
  Jawab : Pada kode saat ini, update stok lewat PUT menimpa nilai, sehingga rawan lost update kalau ada dua request bersamaan. Mungkin menurut saya untuk mencegah stok menjadi -1, menggunakan filter stock >= quantity. Pada mongodb menjadi atomisitas di level dokumen, sehingga request kedua gagal dan mendapat 409. 

## Dokumentasi Postman
https://documenter.getpostman.com/view/27379651/2sBYHXPy6X
