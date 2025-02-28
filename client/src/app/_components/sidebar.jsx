"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useWatchlistsDataStore } from '../zustand/useWatchlistsDataStore';
import { useCurrentStockDataStore } from '../zustand/useCurrentStockDataStore';
import io from "socket.io-client";
import Modal from './modal';

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('watchlists');
    const [activeWatchlist, setActiveWatchlist] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [newStock, setNewStock] = useState({ name: '', instrumentKey: '' });
    const [socket, setSocket] = useState(null);
    const { watchlists, updateWatchlists, updateWatchlistWithTitle } = useWatchlistsDataStore();
    const { updateCurrentStock } = useCurrentStockDataStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [watchlistTitle, setwatchlistTitle] = useState('');
    const [mdActiveWatchlist, setmdActiveWatchlist] = useState([]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleWatchlistClick = (watchlist) => {
        setActiveTab('watchlist');
        setActiveWatchlist(watchlist);
        wsConnectToBE(watchlist.stocks);
    };

    const handleAddWatchlist = async (watchlistTitleText) => {
        try {
            setwatchlistTitle(watchlistTitleText);
            console.log('Adding watchlist ', watchlistTitleText);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlist/add`, {
                "title": watchlistTitleText
            });
            const newWatchlist = res.data;
            updateWatchlists([...watchlists, newWatchlist]);
        } catch (error) {
            console.log('Error in adding watchlist ', error.message);
        }
    };

    const handleStockClick = (stock) => {
        updateCurrentStock(stock);
    }

    const handleAddStock = async () => {
        try {
            console.log('Adding stock');
            const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlist/addStock`, {
                "watchlist": activeWatchlist.title,
                "stock": newStock
            });
            console.log(res);
            updateWatchlistWithTitle(activeWatchlist.title, newStock);
            setActiveWatchlist(watchlists[0]);
            setNewStock({ name: '', instrumentKey: '' });
        } catch (error) {
            console.log('Error in adding stock');
        }
    };

    const getWatchlists = async () => {
        try {
            console.log('Getting Watchlists');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlist/get`);
            console.log(res);
            updateWatchlists(res.data);
            //setting first watchlist as active by default
            if (res.data.length !== 0) {
                console.log('setting first watchlist as active');
                setActiveTab('watchlist');
                setActiveWatchlist(res.data[0]);
                wsConnectToBE(res.data[0].stocks);
            }
        } catch (error) {
            console.log('Error in getting watchlists', error.message);
        }
    }

    const searchStocks = async (e) => {
        setNewStock({ name: e.target.value });
        console.log(e.target.value);
        const stockNameToBeSearched = e.target.value;
        if (stockNameToBeSearched.length > 2) {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_AG_URI}`, { params: { q: stockNameToBeSearched } });
                console.log('Stocks received - ', res.data);
                const stockDetails = res.data.map(stock => ({
                    name: stock._source.name,
                    instrumentKey: stock._source.instrumentKey
                }));
                setSuggestions(stockDetails);
            } catch (error) {
                console.log("Error in searching : ", error.message);
            }
        } else {
            setSuggestions([]);
        }
    }

    const wsConnectToBE = (activeWatchlistStocks) => {
        const newSocket = io(`${process.env.NEXT_PUBLIC_MD_BE_URI}`);
        setSocket(newSocket);
        console.log('stocks ', activeWatchlistStocks);
        const instrumentKeys = activeWatchlistStocks?.map(item => item.instrumentKey);
        console.log('Emitting ', instrumentKeys);
        if (instrumentKeys) {
            newSocket.emit('market data', instrumentKeys);
        }
        newSocket.on('market data', (msg) => {
            console.log('Received msg ', msg);
            setmdActiveWatchlist(msg);
        });
    }

    useEffect(() => {
        getWatchlists();
    }, []);

    return (
        <div className="flex flex-col bg-gradient-to-b from-blue-200 to-blue-300 h-full min-h-screen border-r border-gray-300 shadow-lg">
            <div className="px-4 py-2">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Watchlists</h1>
                    <button
                        className={`text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition duration-200 ${isModalOpen ? 'hidden' : ''}`}
                        onClick={openModal}
                    >
                        +
                    </button>
                    {isModalOpen && (
                        <Modal onClose={closeModal} onSubmit={handleAddWatchlist} />
                    )}
                </div>
                <div>
                    <ul className="flex overflow-x-auto space-x-4">
                        {watchlists.map((watchlist, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer p-2 rounded-lg transition duration-200 
                                    ${activeTab === 'watchlist' && activeWatchlist === watchlist
                                    ? 'font-semibold bg-white shadow-md'
                                    : 'bg-blue-100 hover:bg-blue-200'
                                    }`}
                                onClick={() => handleWatchlistClick(watchlist)}
                            >
                                {watchlist.title}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {activeTab === 'watchlist' && (
                <div className="p-4 bg-white h-full shadow-md rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-semibold text-gray-800">{activeWatchlist.title}</h1>
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="border border-gray-400 rounded-md mr-2 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="New Stock"
                                value={newStock.name}
                                onChange={searchStocks}
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute left-0 border border-gray-400 bg-white shadow-lg rounded-md">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => {
                                                setNewStock({ name: suggestion.name, instrumentKey: suggestion.instrumentKey });
                                                setSuggestions([]);
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    {suggestion.name}
                                                </div>
                                                <div className='text-xs text-gray-500'>
                                                    {suggestion.instrumentKey}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button
                                className="text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition duration-200"
                                onClick={handleAddStock}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div>
                        <ul>
                            {watchlists
                                .find((watchlist) => watchlist === activeWatchlist)
                                ?.stocks.map((stock, index) => (
                                    <li key={index}
                                        className='hover:bg-gray-200 cursor-pointer p-2 rounded-md transition duration-200'
                                        onClick={() => handleStockClick(stock)}
                                    >
                                        <div className='flex'>
                                            <div className='w-4/5'>
                                                <div className='font-medium text-gray-800'>
                                                    {stock.name}
                                                </div>
                                                <div className='text -xs text-gray-500'>
                                                    {stock.instrumentKey}
                                                </div>
                                            </div>
                                            <div className='w-1/5 flex justify-center items-center text-gray-700'>
                                                {mdActiveWatchlist.find(item => item.instrumentKey === stock.instrumentKey)?.ltp}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;