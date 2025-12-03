import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Trash2, Pencil, Search, Droplet, Zap, Clock, Landmark } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const HistoryList = ({ 
    transactions, loans, bills, dues, formatCurrency, 
    handleDelete, handleEdit, setModalType 
}) => {
    const [subTab, setSubTab] = useState('transaction'); // transaction vs manage
    const [searchTerm, setSearchTerm] = useState(''); // NEW SEARCH STATE

    // Filter transactions based on search
    const filteredTransactions = transactions.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex p-1 bg-slate-200 rounded-xl">
                <button onClick={() => setSubTab('transaction')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${subTab === 'transaction' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>History</button>
                <button onClick={() => setSubTab('manage')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${subTab === 'manage' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Manage</button>
            </div>

            {subTab === 'transaction' ? (
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="w-full pl-10 p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        {filteredTransactions.map(t => (
                            <Card key={t.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>{t.type === 'income' ? <TrendingUp className="w-5 h-5"/> : <TrendingDown className="w-5 h-5"/>}</div><div><p className="font-bold text-slate-800 text-sm">{t.description}</p><p className="text-xs text-slate-500">{t.date} • {t.category}</p></div></div>
                                <div className="flex flex-col items-end"><span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}</span><button onClick={() => handleDelete(t.id, 'transaction')} className="text-slate-300 text-xs mt-1"><Trash2 className="w-3 h-3"/></button></div>
                            </Card>
                        ))}
                        {filteredTransactions.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No transactions found.</p>}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* MANAGE SECTION (Edit buttons added) */}
                    {loans.length > 0 && <div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Active Loans</h3>{loans.map(l => (<Card key={l.id} className="p-4 mb-3 relative overflow-hidden"><div className="flex justify-between items-start mb-2 relative z-10"><div><h4 className="font-bold text-slate-800">{l.name}</h4><p className="text-xs text-slate-500">EMI Day: {l.emiDay} • {formatCurrency(l.emiAmount)}/mo</p></div><div className="flex gap-2"><button onClick={() => handleEdit(l, 'loan')} className="text-slate-300"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(l.id, 'loan')} className="text-slate-300"><Trash2 className="w-4 h-4" /></button></div></div><div className="relative z-10"><div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Paid: {formatCurrency(l.totalAmount - l.pendingAmount)}</span><span className="text-slate-800 font-bold">Left: {formatCurrency(l.pendingAmount)}</span></div><div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-blue-600 h-full rounded-full" style={{ width: `${((l.totalAmount - l.pendingAmount) / l.totalAmount) * 100}%` }}></div></div></div></Card>))}</div>}
                    {bills.length > 0 && <div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Recurring Bills</h3>{bills.map(b => (<Card key={b.id} className="p-4 mb-3 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">{b.title.toLowerCase().includes('petrol') ? <Droplet className="w-5 h-5"/> : <Zap className="w-5 h-5"/>}</div><div><p className="font-bold text-slate-800">{b.title}</p><p className="text-xs text-slate-500">Day {b.dayOfMonth}</p></div></div><div className="flex items-center gap-3"><p className="font-bold text-slate-800">{formatCurrency(b.amount)}</p><button onClick={() => handleEdit(b, 'bill')} className="text-slate-300"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(b.id, 'bill')} className="text-slate-300"><Trash2 className="w-3 h-3"/></button></div></Card>))}</div>}
                    {dues.length > 0 && <div><h3 className="text-xs font-bold text-slate-500 uppercase mb-2">One-time Dues</h3>{dues.map(d => (<Card key={d.id} className="p-4 mb-3 flex items-center justify-between border-l-4 border-amber-400"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 text-amber-600"><Clock className="w-5 h-5"/></div><div><p className="font-bold text-slate-800">{d.title}</p><p className="text-xs text-slate-500">Due: {d.dueDate}</p></div></div><div className="flex items-center gap-3"><p className="font-bold text-slate-800">{formatCurrency(d.amount)}</p><button onClick={() => handleEdit(d, 'due')} className="text-slate-300"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(d.id, 'due')} className="text-slate-300"><Trash2 className="w-3 h-3"/></button></div></Card>))}</div>}
                </div>
            )}
        </div>
    );
};