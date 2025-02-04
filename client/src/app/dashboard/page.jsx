"use client"
import React from 'react'
import SideBar from '../_components/sidebar'
import StockChart from '../_components/stockchart';

const Dashboard = () => {
  return (
    <div className='h-screen flex'>
        <div className='w-2/5'>
            <SideBar />
        </div>
        <div className='w-3/5'>
            <div>
                <StockChart />
            </div>
        </div>
    </div>
  )
}

export default Dashboard