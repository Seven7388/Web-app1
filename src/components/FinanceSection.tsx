import React, { useState, useEffect } from "react";
import { StockInfo } from "../types";
import { TrendingUp, TrendingDown, Plus, Trash2, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, RefreshCw } from "lucide-react";

interface FinanceSectionProps {
  stocks: StockInfo[];
  onUpdateStocks: (stocks: StockInfo[]) => void;
}

export default function FinanceSection({ stocks, onUpdateStocks }: FinanceSectionProps) {
  const [selectedStock, setSelectedStock] = useState<StockInfo>(stocks[0]);
  const [newSymbol, setNewSymbol] = useState("");
  const [newStockName, setNewStockName] = useState("");
  const [newPrice, setNewPrice] = useState("100");
  
  // Paper Trading State
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem("sixbravo_cash_balance");
    return saved ? parseFloat(saved) : 10000.00;
  });
  
  const [portfolio, setPortfolio] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("sixbravo_portfolio");
    return saved ? JSON.parse(saved) : { SXB: 20, GOOGL: 5 };
  });

  const [tradeAmount, setTradeAmount] = useState<number>(1);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    localStorage.setItem("sixbravo_cash_balance", balance.toFixed(2));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("sixbravo_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  const handleSelectStock = (stk: StockInfo) => {
    setSelectedStock(stk);
  };

  const handleBuy = () => {
    const cost = selectedStock.price * tradeAmount;
    if (balance < cost) {
      setFeedbackMsg("❌ Insufficient mock cash balance.");
      return;
    }
    setBalance(prev => prev - cost);
    setPortfolio(prev => ({
      ...prev,
      [selectedStock.symbol]: (prev[selectedStock.symbol] || 0) + tradeAmount
    }));
    setFeedbackMsg(`✅ Successfully bought ${tradeAmount} shares of ${selectedStock.symbol}!`);
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleSell = () => {
    const currentOwned = portfolio[selectedStock.symbol] || 0;
    if (currentOwned < tradeAmount) {
      setFeedbackMsg("❌ You do not own enough shares to execute this sale.");
      return;
    }
    const proceeds = selectedStock.price * tradeAmount;
    setBalance(prev => prev + proceeds);
    setPortfolio(prev => {
      const updated = { ...prev };
      updated[selectedStock.symbol] -= tradeAmount;
      if (updated[selectedStock.symbol] <= 0) {
        delete updated[selectedStock.symbol];
      }
      return updated;
    });
    setFeedbackMsg(`✅ Successfully sold ${tradeAmount} shares of ${selectedStock.symbol}!`);
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol || !newStockName) return;

    const sym = newSymbol.toUpperCase().trim();
    if (stocks.some(s => s.symbol === sym)) {
      setFeedbackMsg("❌ Symbol already exists in your active index.");
      return;
    }

    const priceNum = parseFloat(newPrice) || 50.00;
    const randomHistory = Array.from({ length: 6 }, () => priceNum * (0.95 + Math.random() * 0.1));
    randomHistory[5] = priceNum;

    const newStock: StockInfo = {
      symbol: sym,
      name: newStockName.trim(),
      price: priceNum,
      change: (Math.random() * 4) - 2,
      changePercent: (Math.random() * 3) - 1.5,
      history: randomHistory
    };

    const updated = [...stocks, newStock];
    onUpdateStocks(updated);
    setSelectedStock(newStock);
    setNewSymbol("");
    setNewStockName("");
    setNewPrice("100");
    setFeedbackMsg(`🚀 Added ${sym} to index!`);
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleDeleteStock = (symbolToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = stocks.filter(s => s.symbol !== symbolToDelete);
    onUpdateStocks(updated);
    if (selectedStock.symbol === symbolToDelete && updated.length > 0) {
      setSelectedStock(updated[0]);
    }
  };

  // Portfolio valuation
  const portfolioValue = Object.entries(portfolio).reduce((acc, [symbol, qty]) => {
    const stk = stocks.find(s => s.symbol === symbol);
    const price = stk ? stk.price : 100;
    return acc + ((qty as number) * price);
  }, 0);

  const totalWealth = balance + portfolioValue;

  return (
    <div className="space-y-6" id="finance-section">
      
      {/* 1. Watchlist Ticker Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
        {stocks.map(stk => {
          const isUp = stk.change >= 0;
          return (
            <div
              key={stk.symbol}
              onClick={() => handleSelectStock(stk)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all shrink-0 text-left ${
                selectedStock.symbol === stk.symbol
                  ? "bg-indigo-700 text-white border-indigo-700 shadow-md shadow-indigo-100"
                  : "bg-white border-slate-150 hover:border-slate-200"
              }`}
            >
              <div>
                <p className={`text-xs font-black ${selectedStock.symbol === stk.symbol ? "text-indigo-100" : "text-slate-900"}`}>
                  {stk.symbol}
                </p>
                <p className={`text-[10px] font-mono leading-none ${selectedStock.symbol === stk.symbol ? "text-indigo-200" : "text-slate-400"}`}>
                  ${stk.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-0.5 text-xs font-black px-1.5 py-0.5 rounded-md ${
                  isUp
                    ? (selectedStock.symbol === stk.symbol ? "bg-indigo-600 text-white" : "bg-green-50 text-green-700")
                    : (selectedStock.symbol === stk.symbol ? "bg-red-500 text-white" : "bg-red-50 text-red-700")
                }`}>
                  {isUp ? "+" : ""}{stk.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Stock Detail & Interactive SVG Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                  Active Security
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                  {selectedStock.name} ({selectedStock.symbol})
                </h3>
                <p className="text-xs text-slate-400">Listed Index • Real-time mock valuation feed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900 font-mono">${selectedStock.price.toFixed(2)}</p>
                <div className={`flex items-center justify-end gap-1.5 font-bold text-xs mt-1 ${
                  selectedStock.change >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {selectedStock.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{selectedStock.change >= 0 ? "+" : ""}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>

            {/* Custom SVG glowing chart representing history points */}
            <div className="h-48 relative mt-6" id="stock-chart">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4338ca" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid Lines */}
                <line x1="0" y1="25" x2="500" y2="25" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="125" x2="500" y2="125" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Plot Area */}
                {(() => {
                  const data = selectedStock.history;
                  const min = Math.min(...data) * 0.98;
                  const max = Math.max(...data) * 1.02;
                  const range = max - min || 1;

                  const points = data.map((val, idx) => {
                    const x = (idx / (data.length - 1)) * 500;
                    const y = 150 - ((val - min) / range) * 120 - 15;
                    return { x, y, val };
                  });

                  const dPath = `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`;
                  const fillPath = `${dPath} L 500 150 L 0 150 Z`;

                  return (
                    <>
                      {/* Gradient Fill */}
                      <path d={fillPath} fill="url(#chartGradient)" />
                      {/* Stroke Line */}
                      <path d={dPath} fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      
                      {/* Data dots */}
                      {points.map((p, i) => (
                        <g key={i} className="group/dot cursor-pointer">
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            fill="#4338ca"
                            stroke="white"
                            strokeWidth="2.5"
                            className="transition-all duration-300 group-hover/dot:r="
                          />
                          <text
                            x={p.x}
                            y={p.y - 10}
                            textAnchor="middle"
                            fill="#1e1b4b"
                            className="text-[9px] font-mono font-bold bg-white opacity-0 group-hover/dot:opacity-100 transition-all pointer-events-none"
                          >
                            ${p.val.toFixed(2)}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
            
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 border-t border-slate-100 pt-3">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Today</span>
            </div>
          </div>

          {/* 2. Paper Trading Center */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-indigo-700" />
              Mock Portfolio Execution Desk
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Available Cash</p>
                <p className="text-lg font-black text-indigo-700 font-mono">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Securities Value</p>
                <p className="text-lg font-black text-slate-800 font-mono">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Net Portfolio Value</p>
                <p className="text-lg font-black text-green-700 font-mono">${totalWealth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Trading Action Bar */}
            <div className="flex flex-wrap items-center gap-4 justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-600">Trading Quantity:</span>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-18 p-1.5 border border-gray-200 rounded-lg text-center font-mono font-bold text-xs"
                />
                <span className="text-[10px] text-gray-400">Total cost: ${(tradeAmount * selectedStock.price).toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBuy}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Buy Shares
                </button>
                <button
                  onClick={handleSell}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Sell Shares
                </button>
              </div>
            </div>

            {feedbackMsg && (
              <p className="text-xs text-left font-bold mt-4 animate-fade-in text-gray-700">
                {feedbackMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Watchlist Editor & Current Holdings */}
        <div className="space-y-6 text-left">
          
          {/* Portfolio Holdings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-150 pb-2">
              Your Holdings ({Object.keys(portfolio).length})
            </h4>
            
            {Object.keys(portfolio).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Your paper portfolio is empty. Execute a buy order to acquire shares!</p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(portfolio).map(([symbol, qty]) => {
                  const stk = stocks.find(s => s.symbol === symbol);
                  const currPrice = stk ? stk.price : 100;
                  const value = (qty as number) * currPrice;
                  return (
                    <div key={symbol} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 border border-slate-150">
                      <div>
                        <p className="text-xs font-black text-slate-900">{symbol}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{qty} shares owned</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-800 font-mono">${value.toFixed(2)}</p>
                        <p className="text-[9px] text-slate-400 font-mono">${currPrice.toFixed(2)} / share</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Stock to Index Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              Index Editor
            </h4>
            <form onSubmit={handleAddStock} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Ticker Symbol</label>
                <input
                  type="text"
                  placeholder="e.g. NVDA"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  maxLength={6}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs uppercase font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. NVIDIA Corporation"
                  value={newStockName}
                  onChange={(e) => setNewStockName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Initial Price ($)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-semibold"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Security to Index
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
