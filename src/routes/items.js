import { Router } from "express";
import { listItems, createItem, updateItem, deleteItem } from "../controllers/itemController.js";
import { validate } from "../middlewares/validate.js";
import { createItemSchema, updateItemSchema } from "../validators/schemas.js";

const router = Router();

router.get("/", listItems);
router.post("/", validate(createItemSchema), createItem);
router.put("/:id", validate(updateItemSchema), updateItem);
router.delete("/:id", deleteItem);

export default router;
