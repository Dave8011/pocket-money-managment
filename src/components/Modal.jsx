import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';

export const Modal = ({ type, close, save, initialData }) => {
    const [data, setData] = useState({ amount: '', description: '', type: 'expense', category: 'General', totalAmount: '', emiAmount: '', emiDay: '1', dueDate: '', title: '', dayOfMonth: '1', name: '' });
    
    useEffect(() => {
        if(initialData) {
            setData({ ...initialData, amount: initialData.amount || initialData.limit });
        }
    }, [initialData]);

    const handleSubmit = (e) => { e.preventDefault(); save({ ...data, amount: parseFloat(data.amount), totalAmount: parseFloat(data.totalAmount), emiAmount: parseFloat(data.emiAmount) }); };
    
    // Helper to get title
    const getTitle = () => {
        if (type === 'savings_add') return 'Add to Savings';
        if (type === 'savings_withdraw') return 'Withdraw Savings';
        if (type === 'misc') return 'Set Misc Budget';
        if (type === 'bill') return 'Monthly Bill';
        if (type === 'loan') return 'Loan / EMI';
        return `New ${type}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-800 capitalize">{initialData ? 'Edit' : ''} {getTitle()}</h2><button onClick={close} className="p-2 bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5"/></button></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* TRANSACTIONS */}
                    {type === 'transaction' && ( <>
                            <div className="flex bg-slate-100 p-1 rounded-xl mb-4"><button type="button" onClick={() => setData({...data, type: 'expense'})} className={`flex-1 py-2 rounded-lg text-sm font-bold ${data.type === 'expense' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}>Expense</button><button type="button" onClick={() => setData({...data, type: 'income'})} className={`flex-1 py-2 rounded-lg text-sm font-bold ${data.type === 'income' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>Income</button></div>
                            <input required placeholder="Amount" type="number" className="w-full text-3xl font-bold text-center py-4 border-b-2 border-slate-100 outline-none focus:border-blue-500 bg-transparent" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} />
                            <input required placeholder="What is this for?" className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={data.description} onChange={e => setData({...data, description: e.target.value})} />
                            <select className="w-full p-4 bg-slate-50 rounded-xl outline-none text-slate-600" value={data.category} onChange={e => setData({...data, category: e.target.value})}><option>General</option><option>Food</option><option>Travel</option><option>Bills</option><option>Shopping</option><option>Miscellaneous</option></select>
                         </>)}
                    
                    {/* BILLS */}
                    {type === 'bill' && ( <>
                            <input required placeholder="Name (e.g. Phone, Petrol)" className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-400 ml-1">Fixed Amount</label><input required type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-400 ml-1">Due Date (1-31)</label><input required type="number" min="1" max="31" placeholder="10" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={data.dayOfMonth} onChange={e => setData({...data, dayOfMonth: e.target.value})} /></div></div>
                        </>)}
                    
                    {/* LOANS */}
                    {type === 'loan' && ( <>
                            <input required placeholder="Loan Name (e.g. Home Loan)" className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-400 ml-1">Total Debt</label><input required type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={data.totalAmount} onChange={e => setData({...data, totalAmount: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-400 ml-1">EMI Amount</label><input required type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={data.emiAmount} onChange={e => setData({...data, emiAmount: e.target.value})} /></div></div>
                            <div><label className="text-xs font-bold text-slate-400 ml-1">EMI Date (1-31)</label><input required type="number" min="1" max="31" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={data.emiDay} onChange={e => setData({...data, emiDay: e.target.value})} /></div>
                        </>)}
                    
                    {/* DUES */}
                    {type === 'due' && ( <>
                            <input required placeholder="Name (e.g. Friend Debt)" className="w-full p-4 bg-slate-50 rounded-xl outline-none" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-400 ml-1">Amount</label><input required type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-400 ml-1">Due Date</label><input required type="date" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={data.dueDate} onChange={e => setData({...data, dueDate: e.target.value})} /></div></div>
                        </>)}
                    
                    {/* MISC & SAVINGS */}
                    {type === 'misc' && ( <>
                            <label className="text-xs font-bold text-slate-400 ml-1">Set Monthly Misc Limit</label>
                            <input required type="number" placeholder="e.g. 2000" className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xl font-bold" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} />
                            <p className="text-xs text-slate-400 mt-2">Any transaction with category 'Miscellaneous' will be deducted from this budget.</p>
                        </>)}
                    
                    {type === 'savings_add' && ( <>
                            <label className="text-xs font-bold text-slate-400 ml-1">Amount to Add to Savings</label>
                            <input required type="number" placeholder="e.g. 500" className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xl font-bold" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} />
                        </>)}

                    {type === 'savings_withdraw' && ( <>
                            <label className="text-xs font-bold text-slate-400 ml-1">Withdraw Amount</label>
                            <input required type="number" placeholder="e.g. 200" className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xl font-bold" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} />
                            <p className="text-xs text-slate-400 mt-2">This will add money back to your main wallet.</p>
                        </>)}

                    <Button className="w-full mt-4 py-4 text-lg">Save Record</Button>
                </form>
            </div>
        </div>
    )
}