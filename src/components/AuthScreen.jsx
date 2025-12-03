import React, { useState } from 'react';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
            }
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-blue-200">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">PocketMoney</h1>
                    <p className="text-slate-500 mt-2">Manage your finances smarter.</p>
                </div>
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (<div><label className="text-xs font-bold text-slate-500 uppercase">Name</label><input required type="text" className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100" value={name} onChange={e => setName(e.target.value)} /></div>)}
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input required type="email" className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100" value={email} onChange={e => setEmail(e.target.value)} /></div>
                        <div className="relative"><label className="text-xs font-bold text-slate-500 uppercase">Password</label><div className="relative"><input required type={showPassword ? "text" : "password"} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 pr-10" value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 z-10">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                        <Button className="w-full mt-4" disabled={loading}>{loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}</Button>
                    </form>
                    <div className="mt-6 text-center"><button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 font-medium hover:underline">{isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}</button></div>
                </Card>
            </div>
        </div>
    );
};