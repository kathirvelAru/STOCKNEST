import express from "express";
import addWatchList, {getWatchLists, addStockToWatchList} from "../controllers/watchlist.controller.js"

const router = express.Router();

router.post('/add', addWatchList);
router.post('/addStock', addStockToWatchList);
router.get('/get', getWatchLists);

export default router;
