// src/views/AuthView.tsx
import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

interface AuthViewProps {
  onClose: () => void;
  onAuthSuccess: (username: string, email?: string) => void;
}

export function AuthView({ onClose, onAuthSuccess }: AuthViewProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Input fields matching backend schemas
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmitAction = async () => {
    // 1. Structural Guard Checks based on Mode
    if (authMode === 'signup' && (!usernameInput || !emailInput || !passwordInput)) {
      setErrorMessage('Please fill in all fields (Username, Email, and Password).');
      return;
    }
    if (authMode === 'login' && (!emailInput || !passwordInput)) {
      setErrorMessage('Please enter your Username/Email and Password.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      console.log("Attempting network request to backend...");
      if (authMode === 'signup') {
        // Registration payload matching UserAuth schema
        await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ 
            username: usernameInput, 
            email: emailInput, 
            password: passwordInput 
          }),
        });
        setAuthMode('login');
        setSuccessMessage('Signed up successfully! Please login.');
        setPasswordInput('');
        setUsernameInput('');
      } else {
        // Login payload matching adaptive UserLogin schema
        const data = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ 
            identifier: emailInput, // Pass the single input box value directly
            password: passwordInput 
          }),
        });

        const loggedInUsername = data.username;

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('username', loggedInUsername);
        
        onAuthSuccess(loggedInUsername, data.username);
        onClose();
      }
    } catch (err: any) {
      console.error("Network integration failed catch block:", err);
      setErrorMessage(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between no-scrollbar overflow-y-auto pb-4 relative">
      {/* Floating Success Notification */}
      {successMessage && (
        <div className="absolute top-16 left-4 right-4 p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-xl flex items-center gap-2 animate-fadeIn z-50 shadow-xl backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400 shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
          <span className="text-xs font-normal text-emerald-400 tracking-wide">{successMessage}</span>
        </div>
      )}

      {/* Floating Error Notification */}
      {errorMessage && (
        <div className="absolute top-16 left-4 right-4 p-3 bg-rose-950/90 border border-rose-500/40 rounded-xl flex items-center gap-2 animate-fadeIn z-50 shadow-xl backdrop-blur-md">
          <span className="text-xs font-normal text-rose-400 tracking-wide">{errorMessage}</span>
        </div>
      )}

      <div>
        {/* Header Section */}
        <div className="flex justify-between items-start mt-2">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-white">Welcome</h1>
            <p className="text-3xl font-medium tracking-tight text-blue-500 mt-1">
              {authMode === 'login' ? 'Back!' : 'to App!'}
            </p>
          </div>
          <button onClose={onClose} className="text-gray-500 hover:text-white transition-colors pt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="h-6 w-full" />

        {/* 3D Padlock Body */}
        <div className="flex justify-center mb-6 relative select-none">
          <div className="w-56 h-56 bg-gradient-to-tr from-blue-900/40 via-indigo-950/20 to-transparent rounded-full blur-2xl absolute opacity-80"></div>
          <div className="relative z-10 w-44 h-44 flex items-center justify-center">
            <div className="relative w-28 h-24 bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-950 rounded-[22px] shadow-[inset_0_4px_12px_rgba(255,255,255,0.3),0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-center mt-8">
              <div className="absolute -top-10 w-20 h-20 border-[14px] border-b-0 border-blue-500 rounded-t-full -z-10 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"></div>
              <div className="absolute -top-10 w-20 h-10 border-[14px] border-b-0 border-black/40 rounded-t-full -z-10 mix-blend-overlay"></div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-black rounded-full shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]"></div>
                <div className="w-2.5 h-5 bg-black -mt-1 rounded-b-sm shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]"></div>
              </div>
              <div className="absolute top-2 left-4 right-4 h-[1px] bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-normal text-white mb-2">
            {authMode === 'login' ? 'Login to continue' : 'Sign up to continue'}
          </h2>
          <p className="text-sm text-gray-500 font-light px-4">Track your expenses and manage your finances</p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          
          {/* USERNAME FIELD (Only shows on Registration / Signup Mode) */}
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs text-gray-400 font-light mb-2 pl-1">Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                </span>
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="johndoe" 
                  className="w-full bg-[#0d0d0e] border border-gray-950 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-blue-600/30 transition-colors"
                />
              </div>
            </div>
          )}

          {/* DYNAMIC FIELD (Acts as pure Email on Signup, or Identifier on Login) */}
          <div>
            <label className="block text-xs text-gray-400 font-light mb-2 pl-1">
              {authMode === 'login' ? 'Username or Email' : 'Email'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              </span>
              <input 
                type={authMode === 'login' ? "text" : "email"} 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={authMode === 'login' ? "Enter username or email" : "you@example.com"} 
                className="w-full bg-[#0d0d0e] border border-gray-950 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-blue-600/30 transition-colors"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label className="block text-xs text-gray-400 font-light mb-2 pl-1">Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
              </span>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#0d0d0e] border border-gray-950 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-blue-600/30 transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-500 hover:text-gray-300">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Submission */}
      <div className="mt-8">
        <button 
          onClick={handleSubmitAction}
          disabled={isLoading}
          className="w-full bg-gradient-to-b from-[#2539DC] via-[#172186] to-[#0A0D2B] text-white rounded-2xl py-3.5 font-medium tracking-wide shadow-2xl active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign up'}
        </button>

        <div className="flex items-center my-4 opacity-20">
          <div className="flex-1 h-[1px] bg-gray-800"></div>
          <span className="px-3 text-xs text-gray-500 font-light">or</span>
          <div className="flex-1 h-[1px] bg-gray-800"></div>
        </div>

        <div className="text-center pb-2 text-sm text-gray-400 font-light">
          {authMode === 'login' ? (
            <>Don't have an account? <button onClick={() => { setAuthMode('signup'); setErrorMessage(null); }} className="text-blue-500 font-normal hover:underline ml-1">Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setAuthMode('login'); setErrorMessage(null); }} className="text-blue-500 font-normal hover:underline ml-1">Login</button></>
          )}
        </div>
      </div>
    </div>
  );
}