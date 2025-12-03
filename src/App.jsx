import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  Trash2,
  Bell,
  Clock,
  Home,
  List,
  Zap,
  CheckCircle,
  X,
  Droplet,
  Landmark,
  PieChart as PieChartIcon,
  Download,
  LogOut,
  User,
  Eye,
  EyeOff,
  Pencil,
  PiggyBank,
  ArrowRight,
  Search,
  Lock,
  Unlock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

// NOTE: Uncomment ONLY if plugin is installed
import { LocalNotifications } from "@capacitor/local-notifications";

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyC_bDfjuMTDnN8uNzkRghQJobG9CQ1l4DQ",
  authDomain: "pocketmoney-4df59.firebaseapp.com",
  projectId: "pocketmoney-4df59",
  storageBucket: "pocketmoney-4df59.firebasestorage.app",
  messagingSenderId: "729693702700",
  appId: "1:729693702700:web:aa5fe51d4990d4ae73df89",
  measurementId: "G-YRCB8JKV6J",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "pocketmoney-app-v1";

// --- UI COMPONENTS ---
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-4 py-3 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2 touch-manipulation";
  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-200",
    danger: "bg-red-50 text-red-600 border border-red-100",
    ghost: "text-slate-500 hover:bg-slate-100",
    outline: "border-2 border-slate-200 text-slate-600",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- TOAST COMPONENT ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-300 ${
        type === "error" ? "bg-red-600 text-white" : "bg-slate-800 text-white"
      }`}
    >
      {type === "success" && (
        <CheckCircle className="w-4 h-4 text-emerald-400" />
      )}
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
};

// --- LOCK SCREEN COMPONENT ---
const LockScreen = ({ onUnlock, isSettingUp }) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(isSettingUp ? "create" : "enter"); // create, confirm, enter
  const [error, setError] = useState("");

  const handlePress = (num) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => setPin(pin.slice(0, -1));

  const handleSubmit = () => {
    if (pin.length !== 4) return;

    if (step === "enter") {
      const savedPin = localStorage.getItem("pocketmoney_pin");
      if (pin === savedPin) {
        onUnlock(true);
      } else {
        setError("Incorrect PIN");
        setPin("");
        setTimeout(() => setError(""), 2000);
      }
    } else if (step === "create") {
      setConfirmPin(pin);
      setPin("");
      setStep("confirm");
    } else if (step === "confirm") {
      if (pin === confirmPin) {
        localStorage.setItem("pocketmoney_pin", pin);
        onUnlock(true);
      } else {
        setError("PINs do not match. Try again.");
        setStep("create");
        setPin("");
        setConfirmPin("");
      }
    }
  };

  useEffect(() => {
    if (pin.length === 4) handleSubmit();
  }, [pin]);

  return (
    <div className="fixed inset-0 bg-slate-900 z-[60] flex flex-col items-center justify-center p-6 text-white">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-1">
          {step === "enter"
            ? "App Locked"
            : step === "create"
            ? "Create PIN"
            : "Confirm PIN"}
        </h2>
        <p className="text-slate-400 text-sm">
          {error ||
            (step === "enter" ? "Enter your 4-digit PIN" : "Secure your data")}
        </p>
      </div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all ${
              i < pin.length ? "bg-blue-500 scale-110" : "bg-slate-700"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handlePress(num.toString())}
            className="h-16 w-16 rounded-full bg-slate-800 text-2xl font-bold active:bg-blue-600 transition-colors mx-auto flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handlePress("0")}
          className="h-16 w-16 rounded-full bg-slate-800 text-2xl font-bold active:bg-blue-600 transition-colors mx-auto flex items-center justify-center"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="h-16 w-16 rounded-full text-slate-400 active:text-white flex items-center justify-center mx-auto"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {step === "enter" && (
        <button
          onClick={() => {
            localStorage.removeItem("pocketmoney_pin");
            window.location.reload();
          }}
          className="mt-12 text-slate-500 text-xs underline"
        >
          Forgot PIN? (Resets App Lock)
        </button>
      )}
      {isSettingUp && (
        <button
          onClick={() => onUnlock(false)}
          className="mt-12 text-slate-400 text-sm font-bold"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

// --- AUTH SCREEN ---
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  // Initialize email from localStorage if available
  const [email, setEmail] = useState(
    () => localStorage.getItem("pocketmoney_email") || ""
  );
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // Save email to localStorage on successful login for convenience
        localStorage.setItem("pocketmoney_email", email);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name });
        localStorage.setItem("pocketmoney_email", email);
      }
    } catch (err) {
      setError(err.message.replace("Firebase:", "").trim());
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
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Name
                </label>
                <input
                  required
                  type="text"
                  autoComplete="name"
                  className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">
                Email
              </label>
              <input
                required
                type="email"
                autoComplete="email"
                className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 z-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <Button className="w-full mt-4" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- MODAL COMPONENT ---
const Modal = ({ type, close, save, initialData }) => {
  const [data, setData] = useState({
    amount: "",
    description: "",
    type: "expense",
    category: "General",
    totalAmount: "",
    emiAmount: "",
    emiDay: "1",
    dueDate: "",
    title: "",
    dayOfMonth: "1",
    name: "",
  });

  useEffect(() => {
    if (initialData) {
      setData({
        ...initialData,
        amount: initialData.amount || initialData.limit,
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    save({
      ...data,
      amount: parseFloat(data.amount || 0), // Prevent NaN
      totalAmount: parseFloat(data.totalAmount || 0),
      emiAmount: parseFloat(data.emiAmount || 0),
    });
  };

  const getTitle = () => {
    if (type === "savings_add") return "Add to Savings";
    if (type === "savings_withdraw") return "Withdraw Savings";
    if (type === "misc") return "Set Misc Budget";
    if (type === "bill") return "Monthly Bill";
    if (type === "loan") return "Loan / EMI";
    return `New ${type}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {initialData ? "Edit" : ""} {getTitle()}
          </h2>
          <button
            onClick={close}
            className="p-2 bg-slate-100 rounded-full text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "transaction" && (
            <>
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setData({ ...data, type: "expense" })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold ${
                    data.type === "expense"
                      ? "bg-white shadow-sm text-red-600"
                      : "text-slate-500"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setData({ ...data, type: "income" })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold ${
                    data.type === "income"
                      ? "bg-white shadow-sm text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  Income
                </button>
              </div>
              <input
                required
                placeholder="Amount"
                type="number"
                className="w-full text-3xl font-bold text-center py-4 border-b-2 border-slate-100 outline-none focus:border-blue-500 bg-transparent"
                value={data.amount}
                onChange={(e) => setData({ ...data, amount: e.target.value })}
              />
              <input
                required
                placeholder="What is this for?"
                className="w-full p-4 bg-slate-50 rounded-xl outline-none"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
              <select
                className="w-full p-4 bg-slate-50 rounded-xl outline-none text-slate-600"
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
              >
                <option>General</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Bills</option>
                <option>Shopping</option>
                <option>Miscellaneous</option>
              </select>
            </>
          )}
          {type === "bill" && (
            <>
              <input
                required
                placeholder="Name (e.g. Phone, Petrol)"
                className="w-full p-4 bg-slate-50 rounded-xl outline-none"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-1">
                    Fixed Amount
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                    value={data.amount}
                    onChange={(e) =>
                      setData({ ...data, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-1">
                    Due Date (1-31)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="31"
                    placeholder="10"
                    className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                    value={data.dayOfMonth}
                    onChange={(e) =>
                      setData({ ...data, dayOfMonth: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          )}
          {type === "loan" && (
            <>
              <input
                required
                placeholder="Loan Name (e.g. Home Loan)"
                className="w-full p-4 bg-slate-50 rounded-xl outline-none"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-1">
                    Total Debt
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                    value={data.totalAmount}
                    onChange={(e) =>
                      setData({ ...data, totalAmount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-1">
                    EMI Amount
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                    value={data.emiAmount}
                    onChange={(e) =>
                      setData({ ...data, emiAmount: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1">
                  EMI Date (1-31)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  max="31"
                  className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                  value={data.emiDay}
                  onChange={(e) => setData({ ...data, emiDay: e.target.value })}
                />
              </div>
            </>
          )}
          {type === "due" && (
            <>
              <input
                required
                placeholder="Name (e.g. Friend Debt)"
                className="w-full p-4 bg-slate-50 rounded-xl outline-none"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-1">
                    Amount
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                    value={data.amount}
                    onChange={(e) =>
                      setData({ ...data, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-1">
                    Due Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full p-3 bg-slate-50 rounded-xl outline-none"
                    value={data.dueDate}
                    onChange={(e) =>
                      setData({ ...data, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          )}
          {type === "misc" && (
            <>
              <label className="text-xs font-bold text-slate-400 ml-1">
                Set Monthly Misc Limit
              </label>
              <input
                required
                type="number"
                placeholder="e.g. 2000"
                className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xl font-bold"
                value={data.amount}
                onChange={(e) => setData({ ...data, amount: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-2">
                Any transaction with category 'Miscellaneous' will be deducted
                from this budget.
              </p>
            </>
          )}
          {type === "savings_add" && (
            <>
              <label className="text-xs font-bold text-slate-400 ml-1">
                Amount to Add to Savings
              </label>
              <input
                required
                type="number"
                placeholder="e.g. 500"
                className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xl font-bold"
                value={data.amount}
                onChange={(e) => setData({ ...data, amount: e.target.value })}
              />
            </>
          )}
          {type === "savings_withdraw" && (
            <>
              <label className="text-xs font-bold text-slate-400 ml-1">
                Withdraw Amount
              </label>
              <input
                required
                type="number"
                placeholder="e.g. 200"
                className="w-full p-4 bg-slate-50 rounded-xl outline-none text-xl font-bold"
                value={data.amount}
                onChange={(e) => setData({ ...data, amount: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-2">
                This will add money back to your main wallet.
              </p>
            </>
          )}
          <Button className="w-full mt-4 py-4 text-lg">Save Record</Button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayPrompt, setShowPayPrompt] = useState(false);
  const [modalType, setModalType] = useState("transaction");
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Lock Screen State
  const [isLocked, setIsLocked] = useState(
    () => !!localStorage.getItem("pocketmoney_pin")
  );
  const [showPinSetup, setShowPinSetup] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null); // { message, type }
  const showToast = (message, type = "success") => setToast({ message, type });

  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [bills, setBills] = useState([]);
  const [dues, setDues] = useState([]);
  const [miscSettings, setMiscSettings] = useState({ limit: 0, savings: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const getColl = (name) =>
      collection(db, "artifacts", appId, "users", user.uid, name);
    const unsubTxn = onSnapshot(getColl("transactions"), (snap) =>
      setTransactions(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      )
    );
    const unsubLoans = onSnapshot(getColl("loans"), (snap) =>
      setLoans(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubBills = onSnapshot(getColl("bills"), (snap) =>
      setBills(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubDues = onSnapshot(getColl("dues"), (snap) =>
      setDues(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubMisc = onSnapshot(doc(getColl("settings"), "misc"), (doc) => {
      if (doc.exists()) setMiscSettings(doc.data());
    });
    return () => {
      unsubTxn();
      unsubLoans();
      unsubBills();
      unsubDues();
      unsubMisc();
    };
  }, [user]);

  // Logic
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const currentMonthIdx = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const isPaidThisMonth = (lastPaidDate) => {
    if (!lastPaidDate) return false;
    const paid = new Date(lastPaidDate);
    return (
      paid.getMonth() === currentMonthIdx && paid.getFullYear() === currentYear
    );
  };

  const getDaysRemaining = (dayOfMonth) => {
    const today = new Date();
    let targetDate = new Date(currentYear, currentMonthIdx, dayOfMonth);
    if (today.getDate() > dayOfMonth)
      targetDate = new Date(currentYear, currentMonthIdx + 1, dayOfMonth);
    return Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
  };

  const pendingPayments = useMemo(() => {
    const list = [];
    bills.forEach((bill) => {
      if (!isPaidThisMonth(bill.lastPaidDate))
        list.push({
          type: "bill",
          id: bill.id,
          title: bill.title,
          amount: bill.amount,
          daysLeft: getDaysRemaining(bill.dayOfMonth),
          meta: "Monthly Bill",
        });
    });
    loans.forEach((loan) => {
      if (loan.pendingAmount > 0 && !isPaidThisMonth(loan.lastPaidDate))
        list.push({
          type: "loan",
          id: loan.id,
          title: `EMI: ${loan.name}`,
          amount: loan.emiAmount,
          daysLeft: getDaysRemaining(loan.emiDay),
          meta: `Loan Bal: ${formatCurrency(loan.pendingAmount)}`,
        });
    });
    dues.forEach((due) => {
      if (!due.isPaid) {
        const daysLeft = Math.ceil(
          (new Date(due.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        list.push({
          type: "due",
          id: due.id,
          title: due.title,
          amount: due.amount,
          daysLeft,
          meta: `Due Date: ${due.dueDate}`,
        });
      }
    });
    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [bills, loans, dues]);

  // --- NOTIFICATION LOGIC (Optional) ---

  useEffect(() => {
    const checkAndNotify = async () => {
      if (pendingPayments.length > 0) {
        try {
          const perm = await LocalNotifications.requestPermissions();
          if (perm.display === "granted") {
            const today = new Date().toISOString().split("T")[0];
            const lastNotified = localStorage.getItem("last_notified");

            if (lastNotified !== today) {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Payments Due",
                    body: `You have ${pendingPayments.length} pending payments.`,
                    id: 1,
                    schedule: { at: new Date(Date.now() + 5000) },
                  },
                ],
              });
              localStorage.setItem("last_notified", today);
            }
          }
        } catch (e) {
          console.log("Notif error");
        }
      }
    };
    checkAndNotify();
  }, [pendingPayments.length]);

  const currentMonthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear;
  });
  const totalIncome = transactions.reduce(
    (acc, t) => (t.type === "income" ? acc + t.amount : acc),
    0
  );
  const totalExpense = transactions.reduce(
    (acc, t) => (t.type === "expense" ? acc + t.amount : acc),
    0
  );
  const walletBalance = totalIncome - totalExpense;
  const monthIncome = currentMonthTxns.reduce(
    (acc, t) => (t.type === "income" ? acc + t.amount : acc),
    0
  );
  const totalCommitments = pendingPayments.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  const freeCash = walletBalance - totalCommitments;
  const miscSpent = currentMonthTxns
    .filter((t) => t.type === "expense" && t.category === "Miscellaneous")
    .reduce((acc, t) => acc + t.amount, 0);
  const miscBalance = Math.max(0, (miscSettings.limit || 0) - miscSpent);

  const expenseData = useMemo(() => {
    const data = {};
    currentMonthTxns
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        data[t.category] = (data[t.category] || 0) + t.amount;
      });
    return Object.keys(data).map((key) => ({ name: key, value: data[key] }));
  }, [transactions]);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];
  const getColl = (name) =>
    collection(db, "artifacts", appId, "users", user.uid, name);

  const handlePayItem = async (item) => {
    const todayStr = new Date().toISOString().split("T")[0];
    await addDoc(getColl("transactions"), {
      amount: item.amount,
      description: item.title,
      type: "expense",
      category: "Bills",
      date: todayStr,
    });
    if (item.type === "bill")
      await updateDoc(doc(getColl("bills"), item.id), {
        lastPaidDate: new Date().toISOString(),
      });
    else if (item.type === "loan") {
      const loan = loans.find((l) => l.id === item.id);
      if (loan)
        await updateDoc(doc(getColl("loans"), item.id), {
          pendingAmount: Math.max(0, loan.pendingAmount - loan.emiAmount),
          lastPaidDate: new Date().toISOString(),
        });
    } else if (item.type === "due")
      await updateDoc(doc(getColl("dues"), item.id), { isPaid: true });
    showToast("Payment Successful!", "success");
  };

  const handlePayAll = () => {
    pendingPayments.forEach((item) => handlePayItem(item));
    setShowPayPrompt(false);
  };

  const handleDownloadReport = () => {
    if (currentMonthTxns.length === 0) {
      showToast("No transactions to download", "error");
      return;
    }
    const headers = ["Date", "Description", "Type", "Category", "Amount"];
    const rows = currentMonthTxns.map((t) =>
      [t.date, t.description, t.type, t.category, t.amount].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `MoneyManager_Report_${currentMonthName}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Report Downloaded!");
  };

  const handleSave = async (data) => {
    if (
      data.id &&
      modalType !== "savings_add" &&
      modalType !== "savings_withdraw"
    ) {
      const collName =
        modalType === "bill"
          ? "bills"
          : modalType === "loan"
          ? "loans"
          : "dues";
      await updateDoc(doc(getColl(collName), data.id), data);
      showToast("Updated Successfully!");
    } else {
      if (modalType === "transaction") {
        await addDoc(getColl("transactions"), {
          ...data,
          date: new Date().toISOString().split("T")[0],
        });
        if (data.type === "income" && pendingPayments.length > 0)
          setTimeout(() => setShowPayPrompt(true), 500);
      } else if (modalType === "bill")
        await addDoc(getColl("bills"), { ...data, lastPaidDate: null });
      else if (modalType === "loan")
        await addDoc(getColl("loans"), {
          ...data,
          pendingAmount: parseFloat(data.totalAmount),
          lastPaidDate: null,
        });
      else if (modalType === "due")
        await addDoc(getColl("dues"), { ...data, isPaid: false });
      else if (modalType === "misc")
        await setDoc(doc(getColl("settings"), "misc"), {
          ...miscSettings,
          limit: parseFloat(data.amount),
        });
      else if (modalType === "savings_add") {
        const newSavings =
          (miscSettings.savings || 0) + parseFloat(data.amount);
        await setDoc(doc(getColl("settings"), "misc"), {
          ...miscSettings,
          savings: newSavings,
        });
      } else if (modalType === "savings_withdraw") {
        const val = parseFloat(data.amount);
        if (val > (miscSettings.savings || 0)) {
          showToast("Insufficient savings!", "error");
          return;
        }
        const newSavings = (miscSettings.savings || 0) - val;
        await setDoc(doc(getColl("settings"), "misc"), {
          ...miscSettings,
          savings: newSavings,
        });
        await addDoc(getColl("transactions"), {
          amount: val,
          description: "Withdrawal from Savings",
          type: "income",
          category: "Savings",
          date: new Date().toISOString().split("T")[0],
        });
      }
      showToast("Saved Successfully!");
    }
    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this item?")) return;
    const collName =
      type === "transaction"
        ? "transactions"
        : type === "bill"
        ? "bills"
        : type === "loan"
        ? "loans"
        : "dues";
    await deleteDoc(doc(getColl(collName), id));
    showToast("Deleted Successfully!");
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setModalType(type);
    setShowAddModal(true);
  };
  const triggerSavingsAdd = () => {
    setModalType("savings_add");
    setShowAddModal(true);
  };
  const triggerSavingsWithdraw = () => {
    setModalType("savings_withdraw");
    setShowAddModal(true);
  };
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loadingAuth)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  if (!user) return <AuthScreen />;

  // Show Lock Screen if locked
  if (isLocked) {
    return (
      <LockScreen
        onUnlock={(success) => {
          if (success) setIsLocked(false);
          else setShowPinSetup(false);
        }}
        isSettingUp={showPinSetup}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24 md:max-w-md md:mx-auto md:border-x md:border-slate-200 flex flex-col h-screen overflow-hidden">
      {/* FIXED TOP BAR */}
      <div className="flex-none sticky top-0 bg-white/80 backdrop-blur-md z-10 px-5 py-4 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">
            PocketMoney
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowPinSetup(true);
              setIsLocked(true);
            }}
            className="p-1 bg-slate-100 rounded-full text-slate-500"
          >
            <Lock className="w-5 h-5" />
          </button>
          <div className="relative">
            <Bell className="w-6 h-6 text-slate-400" />
            {pendingPayments.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                {pendingPayments.length}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="p-1 bg-slate-100 rounded-full text-slate-500"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-40">
        {activeTab === "home" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-30"></div>
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Current Balance
                  </p>
                  <h1 className="text-4xl font-bold tracking-tight">
                    {formatCurrency(walletBalance)}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Income added in {currentMonthName}:{" "}
                    <span className="text-emerald-400 font-bold">
                      +{formatCurrency(monthIncome)}
                    </span>
                  </p>

                  {/* NEW: Savings & Misc Summary Row */}
                  <div className="flex gap-4 mt-4 mb-2">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 flex-1">
                      <div className="p-1.5 bg-white/20 rounded-full">
                        <PiggyBank className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-200">Savings</p>
                        <p className="text-sm font-bold">
                          {formatCurrency(miscSettings.savings || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 flex-1">
                      <div className="p-1.5 bg-white/20 rounded-full">
                        <List className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-200">
                          Miscellaneous Exp.. Left
                        </p>
                        <p className="text-sm font-bold">
                          {formatCurrency(miscBalance)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-300 mb-1">
                      <div className="p-1 bg-emerald-500/20 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide">
                        Free to Spend
                      </span>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(freeCash)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                      {currentMonthName} Payables
                    </p>
                    <p className="text-lg font-semibold text-slate-200">
                      -{formatCurrency(totalCommitments)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex justify-between items-center">
                <span>{currentMonthName} Commitments</span>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">
                  {pendingPayments.length} Left
                </span>
              </h3>
              {pendingPayments.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <p className="text-emerald-800 text-sm font-medium">
                    All bills & EMIs paid for {currentMonthName}!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.map((item, idx) => (
                    <Card
                      key={`${item.type}-${item.id}-${idx}`}
                      className="p-4 border-l-4 border-l-blue-500 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600`}
                          >
                            {item.type === "loan" ? (
                              <Landmark className="w-5 h-5" />
                            ) : item.type === "bill" ? (
                              <Zap className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.daysLeft <= 0 ? (
                                <span className="text-red-500 font-bold">
                                  Due Now
                                </span>
                              ) : (
                                `In ${item.daysLeft} days`
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEdit(item, item.type)}
                          className="text-slate-300 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <span className="font-bold text-slate-800 text-lg">
                          {formatCurrency(item.amount)}
                        </span>
                        <button
                          onClick={() => handlePayItem(item)}
                          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold active:scale-95"
                        >
                          Pay
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === "smb" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-slate-800">
              Savings & Budget
            </h2>

            {/* Savings Card */}
            <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <PiggyBank className="w-5 h-5" /> Savings Pot
                </div>
                <span className="text-2xl font-bold text-emerald-800">
                  {formatCurrency(miscSettings.savings || 0)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={triggerSavingsWithdraw}
                  className="flex-1 py-2 bg-white text-emerald-700 text-xs font-bold rounded-lg shadow-sm border border-emerald-100 active:scale-95"
                >
                  Withdraw
                </button>
                <button
                  onClick={triggerSavingsAdd}
                  className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-200 active:scale-95"
                >
                  Add Money
                </button>
              </div>
            </Card>

            {/* Misc Budget Card */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <List className="w-4 h-4" /> Miscellaneous Budget
                </div>
                <button
                  onClick={() => {
                    setModalType("misc");
                    setShowAddModal(true);
                  }}
                  className="p-1 bg-slate-100 rounded-full text-slate-500 hover:text-blue-600"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
              <div className="flex justify-between text-sm mb-1 text-slate-500">
                <span>Spent: {formatCurrency(miscSpent)}</span>
                <span>Limit: {formatCurrency(miscSettings.limit || 0)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    miscBalance < 100 ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (miscSpent / (miscSettings.limit || 1)) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">
                  {formatCurrency(miscBalance)} left
                </span>
                {miscBalance > 0 && (
                  <button
                    onClick={triggerSavingsAdd}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full flex items-center gap-1"
                  >
                    Roll to Savings <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </Card>
          </div>
        )}
        {activeTab === "reports" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                Report: {currentMonthName}
              </h2>
              <button
                onClick={handleDownloadReport}
                className="text-blue-600 flex items-center gap-1 text-sm font-bold"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
            </div>
            <Card className="p-4 h-64 flex flex-col items-center justify-center">
              {expenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 text-sm">
                  No expense data for this month.
                </p>
              )}
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 uppercase">
                  Total Income
                </p>
                <p className="text-xl font-bold text-emerald-800">
                  {formatCurrency(monthIncome)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase">
                  Total Spent
                </p>
                <p className="text-xl font-bold text-red-800">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === "list" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex p-1 bg-slate-200 rounded-xl">
              <button
                onClick={() => setModalType("transaction")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg ${
                  modalType === "transaction"
                    ? "bg-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                History
              </button>
              <button
                onClick={() => setModalType("bill")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg ${
                  modalType === "bill" ? "bg-white shadow-sm" : "text-slate-500"
                }`}
              >
                Manage
              </button>
            </div>
            {modalType === "transaction" ? (
              <div className="space-y-4">
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
                  {filteredTransactions.map((t) => (
                    <Card
                      key={t.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            t.type === "income"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {t.type === "income" ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {t.description}
                          </p>
                          <p className="text-xs text-slate-500">
                            {t.date} • {t.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-bold ${
                            t.type === "income"
                              ? "text-emerald-600"
                              : "text-slate-800"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}
                          {formatCurrency(t.amount)}
                        </span>
                        <button
                          onClick={() => handleDelete(t.id, "transaction")}
                          className="text-slate-300 text-xs mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {loans.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">
                      Active Loans
                    </h3>
                    {loans.map((l) => (
                      <Card
                        key={l.id}
                        className="p-4 mb-3 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <div>
                            <h4 className="font-bold text-slate-800">
                              {l.name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              EMI Day: {l.emiDay} •{" "}
                              {formatCurrency(l.emiAmount)}/mo
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(l, "loan")}
                              className="text-slate-300"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(l.id, "loan")}
                              className="text-slate-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="relative z-10">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">
                              Paid:{" "}
                              {formatCurrency(l.totalAmount - l.pendingAmount)}
                            </span>
                            <span className="text-slate-800 font-bold">
                              Left: {formatCurrency(l.pendingAmount)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{
                                width: `${
                                  ((l.totalAmount - l.pendingAmount) /
                                    l.totalAmount) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                {bills.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">
                      Recurring Bills
                    </h3>
                    {bills.map((b) => (
                      <Card
                        key={b.id}
                        className="p-4 mb-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                            {b.title.toLowerCase().includes("petrol") ? (
                              <Droplet className="w-5 h-5" />
                            ) : (
                              <Zap className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {b.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              Day {b.dayOfMonth}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-slate-800">
                            {formatCurrency(b.amount)}
                          </p>
                          <button
                            onClick={() => handleEdit(b, "bill")}
                            className="text-slate-300"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id, "bill")}
                            className="text-slate-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                {dues.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">
                      One-time Dues
                    </h3>
                    {dues.map((d) => (
                      <Card
                        key={d.id}
                        className="p-4 mb-3 flex items-center justify-between border-l-4 border-amber-400"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {d.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              Due: {d.dueDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-slate-800">
                            {formatCurrency(d.amount)}
                          </p>
                          <button
                            onClick={() => handleEdit(d, "due")}
                            className="text-slate-300"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(d.id, "due")}
                            className="text-slate-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FIXED BOTTOM SECTION (Action Buttons + Nav) */}
      <div className="flex-none bg-white border-t border-slate-200 z-40 pb-safe shadow-lg">
        {/* ACTION BUTTONS DOCK - Only show on Home */}
        {activeTab === "home" && (
          <div className="px-4 py-3 border-b border-slate-100 flex gap-3 justify-between overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setModalType("transaction");
                setEditingItem(null);
                setShowAddModal(true);
              }}
              className="flex-1 min-w-[80px] bg-blue-600 text-white p-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95 shadow-md shadow-blue-200"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-bold">Txn</span>
            </button>
            <button
              onClick={() => {
                setModalType("bill");
                setEditingItem(null);
                setShowAddModal(true);
              }}
              className="flex-1 min-w-[80px] bg-white border-2 border-slate-100 text-slate-700 p-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95 hover:bg-slate-50"
            >
              <Zap className="w-6 h-6 text-slate-600" />
              <span className="text-xs font-bold">Bill</span>
            </button>
            <button
              onClick={() => {
                setModalType("loan");
                setEditingItem(null);
                setShowAddModal(true);
              }}
              className="flex-1 min-w-[80px] bg-white border-2 border-slate-100 text-slate-700 p-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95 hover:bg-slate-50"
            >
              <Landmark className="w-6 h-6 text-slate-600" />
              <span className="text-xs font-bold">EMI</span>
            </button>
            <button
              onClick={() => {
                setModalType("due");
                setEditingItem(null);
                setShowAddModal(true);
              }}
              className="flex-1 min-w-[80px] bg-white border-2 border-slate-100 text-slate-700 p-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95 hover:bg-slate-50"
            >
              <Clock className="w-6 h-6 text-slate-600" />
              <span className="text-xs font-bold">Due</span>
            </button>
          </div>
        )}

        {/* NAVIGATION BAR */}
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === "home"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Home
              className={`w-6 h-6 ${
                activeTab === "home" ? "fill-current" : ""
              }`}
            />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === "reports"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <PieChartIcon
              className={`w-6 h-6 ${
                activeTab === "reports" ? "fill-current" : ""
              }`}
            />
            <span className="text-[10px] font-bold">Report</span>
          </button>
          <button
            onClick={() => setActiveTab("smb")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === "smb"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <PiggyBank
              className={`w-6 h-6 ${activeTab === "smb" ? "fill-current" : ""}`}
            />
            <span className="text-[10px] font-bold">SMB</span>
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === "list"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <List className="w-6 h-6" />
            <span className="text-[10px] font-bold">Manage</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <Modal
          type={modalType}
          initialData={editingItem}
          close={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          save={handleSave}
        />
      )}
      {showPayPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Income Added! 💰
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                You have{" "}
                <span className="font-bold text-slate-800">
                  {formatCurrency(totalCommitments)}
                </span>{" "}
                in upcoming payments.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
              {pendingPayments.map((r, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0"
                >
                  <div>
                    <p className="font-bold text-sm text-slate-700">
                      {r.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{r.meta}</p>
                  </div>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(r.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handlePayAll} className="w-full bg-blue-600">
                Pay All Now ({formatCurrency(totalCommitments)})
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowPayPrompt(false)}
                className="w-full"
              >
                I'll pay later
              </Button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
