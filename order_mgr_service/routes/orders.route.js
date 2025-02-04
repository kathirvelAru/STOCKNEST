import express from "express"
import getOrders,{addOrder,cancelOrder}from "../controllers/orders.controller.js"

const router = express.Router();

router.get('/get', getOrders);
router.post('/add', addOrder);
router.delete('/cancel', cancelOrder);


export default router;