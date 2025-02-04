"use client"
import React, { useState } from 'react'
import axios from "axios"

const Reports
   = () => {

       const [stockSymbol, setStockSymbol] = useState('');
       const [marketData, setMarketData] = useState([]);

       const getMarketData = async () => {
           const res = await axios.get('http://localhost:4000/getOHLCData',{params:{symbol:stockSymbol}});
           console.log('Data received : ', res);
           setMarketData(res.data.candles);
       }

       return (
           <div>
               <div className="flex flex-col items-center justify-center h-screen">
                   <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
                       <h2 className="text-2xl font-semibold mb-4">Educosys Stock Broker App Reports</h2>
                       <input
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                           type="text"
                           placeholder="Enter Stock Symbol"
                           value={stockSymbol}
                           onChange={(e) => setStockSymbol(e.target.value)}
                       />
                       <button
                           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                           onClick={getMarketData}
                       >
                           Get Market Data
                       </button>
                   </div>
               </div>
           </div>
       )
   }

export default Reports


