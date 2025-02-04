import express from "express"
import loadMarketData from "../controllers/loadMarketData.controller.js";

const router = express.Router();

router.get('/', loadMarketData);

export default router;