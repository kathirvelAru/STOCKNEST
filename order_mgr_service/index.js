import express from 'express';
import dotenv from "dotenv"
import cors from "cors";
import ordersRouter from './routes/orders.route.js'




dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 8087;
app.use(cors());


app.use('/orders',ordersRouter);


app.get('/', async (req, res) => {
   res.json({ message: 'HHLD Stock Broker orders Manager Service' });
});

app.listen(port, () => {
   console.log(`Server is listening at http://localhost:${port}`);
})
