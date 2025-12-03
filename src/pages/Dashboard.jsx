import React from 'react';
import { TrendingUp, Plus, Zap, CheckCircle, Landmark, Clock, PiggyBank, List, ArrowRight, Pencil } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Dashboard = ({ 
    walletBalance, monthIncome, currentMonthName, freeCash, totalCommitments, 
    miscSettings, miscSpent, miscBalance, pendingPayments, formatCurrency,
    handlePayItem, triggerSavingsAdd, triggerSavingsWithdraw, 
    setModalType, handleEdit, setShowAddModal 
}) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Balance Card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-30"></div>
                <div className="relative z-10"><div className="mb-6"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Current Balance</p><h1 className="text-4xl font-bold tracking-tight">{formatCurrency(walletBalance)}</h1><p className="text-xs text-slate-500 mt-1">Income added in {currentMonthName}: <span className="text-emerald-400 font-bold">+{formatCurrency(monthIncome)}</span></p></div><div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/5 flex items-center justify-between"><div><div className="flex items-center gap-2 text-emerald-300 mb-1"><div className="p-1 bg-emerald-500/20 rounded-full"><TrendingUp className="w-3 h-3" /></div><span className="text-[10px] font-bold uppercase tracking-wide">Free to Spend</span></div><p className="text-2xl font-bold">{formatCurrency(freeCash)}</p></div><div className="text-right"><p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">{currentMonthName} Payables</p><p className="text-lg font-semibold text-slate-200">-{formatCurrency(totalCommitments)}</p></div></div></div>
            </div>

            {/* Miscellaneous & Savings Section */}
            <div className="grid grid-cols-1 gap-4">
                {/* SAVINGS CARD */}
                <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold"><PiggyBank className="w-5 h-5" /> Savings Pot</div>
                        <span className="text-2xl font-bold text-emerald-800">{formatCurrency(miscSettings.savings || 0)}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={triggerSavingsWithdraw} className="flex-1 py-2 bg-white text-emerald-700 text-xs font-bold rounded-lg shadow-sm border border-emerald-100 active:scale-95">Withdraw</button>
                        <button onClick={triggerSavingsAdd} className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-200 active:scale-95">Add Money</button>
                    </div>
                </Card>

                {/* MISC CARD */}
                <Card className="p-4">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 font-bold text-slate-700"><List className="w-4 h-4" /> Misc. Budget</div>
                        <button onClick={() => { setModalType('misc'); setShowAddModal(true)}} className="p-1 bg-slate-100 rounded-full text-slate-500 hover:text-blue-600"><Pencil className="w-3 h-3"/></button>
                    </div>
                    <div className="flex justify-between text-sm mb-1 text-slate-500"><span>Spent: {formatCurrency(miscSpent)}</span><span>Limit: {formatCurrency(miscSettings.limit || 0)}</span></div><div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden"><div className={`h-full rounded-full ${miscBalance < 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (miscSpent / (miscSettings.limit || 1)) * 100)}%` }}></div></div><div className="flex justify-between items-center"><span className="font-bold text-slate-800">{formatCurrency(miscBalance)} left</span>{miscBalance > 0 && <button onClick={triggerSavingsAdd} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full flex items-center gap-1">Roll to Savings <ArrowRight className="w-3 h-3"/></button>}</div>
                </Card>
            </div>

            {/* Upcoming Payments (Vertical List) */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex justify-between items-center"><span>{currentMonthName} Commitments</span><span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{pendingPayments.length} Left</span></h3>
                {pendingPayments.length === 0 ? <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3"><CheckCircle className="w-6 h-6 text-emerald-500" /><p className="text-emerald-800 text-sm font-medium">All bills & EMIs paid for {currentMonthName}!</p></div> : (
                    <div className="space-y-3">
                        {pendingPayments.map((item, idx) => (
                            <Card key={`${item.type}-${item.id}-${idx}`} className="p-4 border-l-4 border-l-blue-500 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600`}>{item.type === 'loan' ? <Landmark className="w-5 h-5"/> : (item.type === 'bill' ? <Zap className="w-5 h-5"/> : <Clock className="w-5 h-5"/>)}</div>
                                        <div><p className="font-bold text-slate-800 text-sm">{item.title}</p><p className="text-xs text-slate-500">{item.daysLeft <= 0 ? <span className="text-red-500 font-bold">Due Now</span> : `In ${item.daysLeft} days`}</p></div>
                                    </div>
                                    <button onClick={() => handleEdit(item, item.type)} className="text-slate-300 hover:text-blue-600"><Pencil className="w-4 h-4"/></button>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                    <span className="font-bold text-slate-800 text-lg">{formatCurrency(item.amount)}</span>
                                    <button onClick={() => handlePayItem(item)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold active:scale-95">Pay</button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2">
                <button onClick={() => { setModalType('transaction'); setEditingItem(null); setShowAddModal(true)}} className="flex flex-col items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform"><Plus className="w-5 h-5 mb-1"/><span className="font-bold text-[10px]">Txn</span></button>
                <button onClick={() => { setModalType('bill'); setEditingItem(null); setShowAddModal(true)}} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm active:bg-slate-50 transition-transform"><Zap className="w-5 h-5 mb-1"/><span className="font-bold text-[10px]">Bill</span></button>
                <button onClick={() => { setModalType('loan'); setEditingItem(null); setShowAddModal(true)}} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm active:bg-slate-50 transition-transform"><Landmark className="w-5 h-5 mb-1"/><span className="font-bold text-[10px]">EMI</span></button>
                <button onClick={() => { setModalType('due'); setEditingItem(null); setShowAddModal(true)}} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm active:bg-slate-50 transition-transform"><Clock className="w-5 h-5 mb-1"/><span className="font-bold text-[10px]">Due</span></button>
            </div>
        </div>
    );
};