import React from 'react';

export const Button = ({ children, onClick, variant = "primary", className = "", ...props }) => {
  const baseStyle = "px-4 py-3 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2 touch-manipulation";
  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-200",
    danger: "bg-red-50 text-red-600 border border-red-100",
    ghost: "text-slate-500 hover:bg-slate-100",
    outline: "border-2 border-slate-200 text-slate-600"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};