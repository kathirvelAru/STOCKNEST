"use client";
import 'chartjs-adapter-moment';
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useCurrentStockDataStore } from '../zustand/useCurrentStockDataStore';

const StockChart = () => {
  const { currentStock } = useCurrentStockDataStore();
  const [marketData, setMarketData] = useState([]);

  const getMarketData = async () => {
    try {
      if (!currentStock) return;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MD_BE_URI}/getDataMonthlyInterval`, { params: { instrumentKey: currentStock.instrumentKey } });
      console.log('Data received : ', res);
      console.log(res.data.candles);
      setMarketData(res.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }

  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    getMarketData();
  }, [currentStock])

  useEffect(() => {
    console.log('market data ', marketData);
    if (marketData && chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');

      // Destroy previous chart instance if it exists
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }

      const dates = marketData.data?.candles.map(item => item[0]);
      const prices = marketData.data?.candles.map(item => item[4]);

      console.log('Dates:', dates);
      console.log('Prices:', prices);

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Stock Prices',
            data: prices,
            borderColor: 'rgba(0, 123, 255, 1)', // Bootstrap primary color
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
          }]
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'month'
              },
              title: {
                display: true,
                text: 'Date',
                font: {
                  size: 14,
                  weight: 'bold',
                },
                color: '#333',
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price',
                font: {
                  size: 14,
                  weight: 'bold',
                },
                color: '#333',
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            }
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 14,
                  weight: 'bold',
                },
                color: '#333',
              }
            }
          }
        }
      });
    }

    // Clean up function
    return () => {
      // Ensure chart instance is destroyed when component unmounts
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }
    };
  }, [marketData]);

  return (
    <div className="bg-gradient-to-r from-black to-red-500 p-4 rounded-lg shadow-lg">
      <div className='font-semibold m-3 flex justify-center text-2xl text-gray-300'>
        {currentStock.name}
      </div>
      <div>
        <canvas ref={chartContainer} />
      </div>
    </div>
  );
};

export default StockChart;