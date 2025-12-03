import React from 'react';
import { Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Card } from '../components/ui/Card';

export const Reports = ({ currentMonthName, handleDownloadReport, expenseData, formatCurrency, COLORS, monthIncome, totalExpense }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center"><h2 className="text-xl font-bold text-slate-800">Report: {currentMonthName}</h2><button onClick={handleDownloadReport} className="text-blue-600 flex items-center gap-1 text-sm font-bold"><Download className="w-4 h-4"/> CSV</button></div>
            <Card className="p-4 h-64 flex flex-col items-center justify-center">{expenseData.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{expenseData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><RechartsTooltip formatter={(value) => formatCurrency(value)} /><Legend /></PieChart></ResponsiveContainer>) : (<p className="text-slate-400 text-sm">No expense data for this month.</p>)}</Card>
            <div className="grid grid-cols-2 gap-3"><div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100"><p className="text-xs font-bold text-emerald-600 uppercase">Total Income</p><p className="text-xl font-bold text-emerald-800">{formatCurrency(monthIncome)}</p></div><div className="bg-red-50 p-4 rounded-xl border border-red-100"><p className="text-xs font-bold text-red-600 uppercase">Total Spent</p><p className="text-xl font-bold text-red-800">{formatCurrency(totalExpense)}</p></div></div>
        </div>
    );
};