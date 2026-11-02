import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Error MONGO_URI or JWT_SECRET");
  process.exit(1);
}

await connectDB(process.env.MONGO_URI);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
