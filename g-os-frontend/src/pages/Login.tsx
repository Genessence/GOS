import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Sun, Moon, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const [email, setEmail] = useState('kavya.chopra@genessence.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('Director');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
     const success = await login(email,password);
     if(success){
      // Determine role from context or localStorage
      const stored = localStorage.getItem('user');
      const currentUser = stored ? JSON.parse(stored) : null;
      const userRole = currentUser?.role as string | undefined;

      // Redirect based on role
      if (userRole === 'Admin') navigate('/admin-dashboard');
      else if (userRole === 'Manager') navigate('/manager-dashboard');
      else if (userRole === 'Employee') navigate('/employee-dashboard');
      else navigate('/user-dashboard');
     }
     else{
      setError('Invalid email, password');
      {error && <div className="text-sm text-red-500">{error}</div>}
     }
    } catch  {
       setError('Login Failed')
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const success = await login('kavya.chopra@genessence.com', 'password123');
      if (success) {
        const stored = localStorage.getItem('user');
        const currentUser = stored ? JSON.parse(stored) : null;
        const userRole = currentUser?.role as string | undefined;
        if (userRole === 'Admin') navigate('/admin-dashboard');
        else if (userRole === 'Manager') navigate('/manager-dashboard');
        else if (userRole === 'Employee') navigate('/employee-dashboard');
        else navigate('/user-dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFirstNameFromEmail = (emailStr: string) => {
    if (!emailStr) return 'Kavya';
    const localPart = emailStr.split('@')[0];
    if (!localPart) return 'Kavya';
    const firstPart = localPart.split('.')[0] || localPart;
    return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen w-screen overflow-x-hidden font-sans ${
      isDark ? 'bg-[#0f111a] text-slate-100' : 'bg-slate-50 text-slate-900'
    } transition-colors duration-300`}>
      
      {/* Left Branding Panel (50%) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#07122E] via-[#090b14] to-[#2A145F] p-8 md:p-16 flex flex-col justify-between relative overflow-hidden border-r border-slate-800/40 min-h-[600px] md:min-h-screen">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/15 blur-[120px] pointer-events-none" />

        {/* Logo and Name */}
        <div className="flex items-center space-x-3.5 z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6D4AFF] to-[#2A145F] flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white m-0 leading-none">G-OS</h1>
            <span className="text-[9px] text-indigo-400 font-semibold tracking-wider uppercase block mt-1">Genessence Operating System</span>
          </div>
        </div>

        {/* Headline & Paragraph */}
        <div className="my-auto py-8 z-10 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            One Workspace.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D4AFF] via-purple-400 to-pink-400">Everything Connected.</span>
          </h2>
          <p className="text-slate-450 text-sm leading-relaxed mb-10 max-w-md">
            G-OS brings together people, tools, and workflows into a single intelligent platform to help teams move faster and achieve more.
          </p>

          {/* Isometric G-OS Centerpiece & Connecting Floating Nodes */}
          <div className="relative w-80 h-80 mx-auto my-4 flex items-center justify-center">
            {/* Glowing isometric connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320">
              <defs>
                <linearGradient id="glowLine" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6d4aff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6d4aff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* Lines from center (160, 160) to icons */}
              <line x1="160" y1="160" x2="80" y2="110" stroke="url(#glowLine)" strokeWidth="1.5" strokeDasharray="3" />
              <line x1="160" y1="160" x2="240" y2="110" stroke="url(#glowLine)" strokeWidth="1.5" strokeDasharray="3" />
              <line x1="160" y1="160" x2="50" y2="210" stroke="url(#glowLine)" strokeWidth="1.5" strokeDasharray="3" />
              <line x1="160" y1="160" x2="270" y2="210" stroke="url(#glowLine)" strokeWidth="1.5" strokeDasharray="3" />
              <line x1="160" y1="160" x2="160" y2="80" stroke="url(#glowLine)" strokeWidth="1.5" strokeDasharray="3" />
            </svg>

            {/* Central 3D core chip engine node */}
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-[#6D4AFF] to-[#2A145F] flex items-center justify-center shadow-2xl shadow-indigo-500/40 z-20 border border-indigo-400/20 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div className="absolute inset-0 rounded-3xl border border-indigo-400/30 animate-pulse pointer-events-none" />
            </div>

            {/* Gmail node (Top Left) */}
            <div className="absolute top-[60px] left-[50px] w-12 h-12 rounded-xl bg-[#14172a]/90 border border-slate-800 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="3" fill="#ea4335" />
                <path d="M22 6l-10 7L2 6" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Google Calendar node (Top Center) */}
            <div className="absolute top-[20px] left-[136px] w-12 h-12 rounded-xl bg-[#14172a]/90 border border-slate-800 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="#4285f4" />
                <text x="12" y="15" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">31</text>
              </svg>
            </div>

            {/* GitHub node (Top Right) */}
            <div className="absolute top-[60px] right-[50px] w-12 h-12 rounded-xl bg-[#14172a]/90 border border-slate-800 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>

            {/* Google Drive node (Bottom Left) */}
            <div className="absolute bottom-[60px] left-[20px] w-12 h-12 rounded-xl bg-[#14172a]/90 border border-slate-800 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 4h7l6 10h-7L8.5 4z" fill="#00a86b" />
                <path d="M2.5 14l6-10h7l-6 10h-7z" fill="#fbb03b" />
                <path d="M8.5 14h13l-3 6h-13l3-6z" fill="#0071bc" />
              </svg>
            </div>

            {/* Slack node (Bottom Right) */}
            <div className="absolute bottom-[60px] right-[20px] w-12 h-12 rounded-xl bg-[#14172a]/90 border border-slate-800 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9.5" cy="5.5" r="2" fill="#e01e5a" />
                <rect x="8.5" y="8" width="2" height="6" rx="1" fill="#2eb67d" />
                <circle cx="14.5" cy="9.5" r="2" fill="#ecb22e" />
                <rect x="14" y="12" width="2" height="6" rx="1" fill="#36c5f0" />
              </svg>
            </div>
          </div>

          {/* Pillars Indicators */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D4AFF]" />
              <span>Unified Workspace</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D4AFF]" />
              <span>Smart Automation</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D4AFF]" />
              <span>Real-time Insights</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D4AFF]" />
              <span>Secure & Reliable</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-slate-500 text-xs z-10">
          © 2026 Genessence. All rights reserved.
        </div>
      </div>

      {/* Right Login Form Panel (50%) */}
      <div className={`w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-between relative min-h-[600px] md:min-h-screen transition-colors ${
        isDark ? 'bg-[#0f111a]' : 'bg-white'
      }`}>
        {/* Top bar with theme toggle */}
        <div className="flex justify-end items-center">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition-all ${
              isDark 
                ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300' 
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-8">
          {/* Welcome Header */}
          <div className="text-center md:text-left">
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight m-0 ${isDark ? 'text-white' : 'text-[#07122E]'}`}>
              Welcome back,
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-[#6D4AFF] mt-1.5 m-0">
              {getFirstNameFromEmail(email)} 👋
            </h2>
            <p className={`mt-2.5 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sign in to continue to your G-OS workspace
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Address */}
              <div>
                <label htmlFor="email" className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#6D4AFF] ${
                      isDark 
                        ? 'bg-[#141624] border-slate-800 text-white placeholder-slate-500 focus:border-[#6D4AFF]' 
                        : 'bg-[#F7F8FC] border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#6D4AFF]'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Password
                  </label>
                  <a href="#" className="text-[10px] font-semibold text-[#6D4AFF] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#6D4AFF] ${
                      isDark 
                        ? 'bg-[#141624] border-slate-800 text-white placeholder-slate-500 focus:border-[#6D4AFF]' 
                        : 'bg-[#F7F8FC] border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#6D4AFF]'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection for testing authentication */}
              {/* <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Access Role (Simulation Mode)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Director', 'Project Lead', 'Engineer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-3 text-[10px] font-bold rounded-xl border transition-all ${
                        role === r
                          ? 'border-[#6D4AFF] bg-[#6D4AFF]/10 text-[#6D4AFF]'
                          : isDark
                          ? 'border-slate-800 bg-[#141624] text-slate-400 hover:text-slate-200'
                          : 'border-slate-250 bg-slate-100/80 text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6D4AFF] to-[#5136c4] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6D4AFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#6D4AFF]/20"
              >
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-4 text-[10px] tracking-wider font-semibold ${isDark ? 'bg-[#0f111a] text-slate-500' : 'bg-white text-slate-450'}`}>
                or
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-3 py-3 px-4 border rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                isDark 
                  ? 'border-slate-800 bg-[#141624] hover:bg-[#1b1e32] text-white' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>

        {/* Contact Admin */}
        <div className="text-center">
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            New to G-OS?{' '}
            <a href="#" className="font-bold text-[#6D4AFF] hover:underline">
              Contact your admin
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Login;
