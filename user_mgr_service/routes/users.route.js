import express from "express"
import getFunds from "../controllers/users.controller.js"

const router = express.Router();

router.get('/getFunds', getFunds);

export default router;