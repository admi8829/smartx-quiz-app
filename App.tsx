import { useState, useMemo, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, LogIn, UserPlus, Zap, Eye, EyeOff, Loader2 } from "lucide-react";

// --- Types & Constants ---
interface FormErrors {
  email?: string;
  password?: string;
}

// Adsgram type definition for window
declare global {
  interface Window {
    Adsgram?: {
      init: (options: { blockId: string }) => {
        show: () => Promise<any>;
      };
    };
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe: {
          user?: {
            first_name: string;
            last_name?: string;
            username?: string;
            id: number;
          };
        };
      };
    };
  }
}

const ADS_BLOCK_ID = "YOUR_BLOCK_ID_HERE"; // Placeholder for Adsgram block ID

export default function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "dashboard">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // --- Initialization ---
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const tgUser = useMemo(() => {
    return window.Telegram?.WebApp?.initDataUnsafe?.user;
  }, []);

  // --- Handlers ---

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentPage("dashboard");
  };

  const showAd = async () => {
    if (isAdLoading) return;
    setIsAdLoading(true);

    try {
      if (window.Adsgram) {
        const AdController = window.Adsgram.init({ blockId: ADS_BLOCK_ID });
        const result = await AdController.show();
        console.log("Ad completed:", result);
        alert("Reward Granted: Premium Access Activated!");
      } else {
        alert("Adsgram SDK not loaded yet.");
      }
    } catch (err) {
      console.error("Ad error:", err);
      alert("No ads available at the moment. Try again later.");
    } finally {
      setIsAdLoading(false);
    }
  };

  // --- UI Components ---

  const LoginPage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md z-10"
    >
      {/* User Status Bar */}
      {tgUser && (
        <div className="flex items-center justify-center gap-2 mb-6 animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">
            Connected as {tgUser.first_name}
          </span>
        </div>
      )}

        {/* Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-[0_8px_30px_rgb(59,130,246,0.3)]">
            <Zap className="w-8 h-8 text-white fill-white/20" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
            Smart X Academy
          </h1>
          <p className="text-blue-400/60 text-sm font-medium uppercase tracking-[0.2em]">Next-Gen Learning</p>
        </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-30 transition duration-1000 group-hover:opacity-50" />
        <div className="relative bg-[#121212]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-5 h-5" /> Login</>}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/20"><span className="bg-[#121212]/0 px-3">auth methods</span></div>
            </div>

            <button
              type="button"
              className="w-full bg-[#24A1DE]/10 border border-[#24A1DE]/20 hover:bg-[#24A1DE]/20 text-[#24A1DE] font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              Continue with Telegram
            </button>

            <div className="flex justify-center pt-2">
              <p className="text-white/40 text-xs">Don't have an account? <span className="text-blue-400 font-semibold cursor-pointer">Sign Up</span></p>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );

  const Dashboard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md z-10 space-y-6"
    >
      <div className="bg-[#121212]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <UserPlus className="w-10 h-10 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Hello, {tgUser?.first_name || "Scholar"}!</h2>
          <p className="text-white/40 text-sm mt-1">Welcome to Smart X Academy Dashboard</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Status</p>
            <p className="text-sm font-semibold text-green-400">Active</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Plan</p>
            <p className="text-sm font-semibold">Standard</p>
          </div>
        </div>

        <button
          onClick={showAd}
          disabled={isAdLoading}
          className="w-full bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20 disabled:opacity-50"
        >
          {isAdLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 fill-current" /> Watch Ad for Premium</>}
        </button>

        <button 
          onClick={() => setCurrentPage("login")}
          className="text-white/20 hover:text-white/40 text-xs py-2 transition-colors"
        >
          Logout Session
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-hidden relative flex items-center justify-center px-4 py-10">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {currentPage === "login" ? <LoginPage key="login" /> : <Dashboard key="dashboard" />}
      </AnimatePresence>

      <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/10 uppercase tracking-[0.4em] font-bold pointer-events-none">
        Secure Neural Layer
      </p>
    </div>
  );
}
