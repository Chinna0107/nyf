import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const API = config.apiUrl;

const InputField = ({ label, type, name, value, onChange, placeholder, error, children }) => (
  <div className="mb-5">
    <label className="block mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-12 text-sm font-medium text-black transition-all duration-300 focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/5"
      />
      {children}
    </div>
    {error && <p className="text-red-500 text-xs font-semibold mt-1.5">{error}</p>}
  </div>
);

// Signup steps: 'form' → 'otp' → 'password'
const STEPS = { FORM: 'form', OTP: 'otp', PASSWORD: 'password' };

const Login = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', success: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Signup multi-step
  const [step, setStep] = useState(STEPS.FORM);
  const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '' });
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirm: '' });
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  const setError = (field, msg) => setErrors(prev => ({ ...prev, [field]: msg }));
  const clearError = (field) => setErrors(prev => ({ ...prev, [field]: '' }));

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginData.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(loginData.email)) errs.email = 'Enter a valid email';
    if (!loginData.password.trim()) errs.password = 'Password is required';
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setMessage({ text: '', success: false });
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginData.email.trim(), password: loginData.password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Invalid email or password');
      const data = await res.json();

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', loginData.email.trim());
      localStorage.setItem('userName', data.user?.firstName || data.user?.first_name || data.user?.name || loginData.email.split('@')[0]);
      localStorage.setItem('userFirstName', data.user?.firstName || data.user?.first_name || data.user?.name || '');
      localStorage.setItem('userLastName', data.user?.lastName || data.user?.last_name || '');
      localStorage.setItem('userRole', data.user?.role || 'user');
      if (data.token) localStorage.setItem('authToken', data.token);

      setMessage({ text: 'Welcome back! Redirecting...', success: true });
      setTimeout(() => {
        window.dispatchEvent(new Event('auth-change'));
        navigate(data.user?.role === 'admin' ? '/admin' : '/');
      }, 1500);
    } catch (err) {
      setMessage({ text: err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  // ── SIGNUP STEP 1: Send OTP ──
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!signupData.firstName.trim()) errs.firstName = 'Required';
    if (!signupData.lastName.trim()) errs.lastName = 'Required';
    if (!signupData.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(signupData.email)) errs.email = 'Enter a valid email';
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setMessage({ text: '', success: false });
    try {
      const res = await fetch(`${API}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupData.email.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to send OTP');
      setStep(STEPS.OTP);
      setOtpTimer(60);
      setMessage({ text: `OTP sent to ${signupData.email}`, success: true });
    } catch (err) {
      setMessage({ text: err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  // ── SIGNUP STEP 2: Verify OTP ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) return setError('otp', 'Enter the 6-digit OTP');

    setLoading(true);
    setMessage({ text: '', success: false });
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupData.email.trim(), otp: otp.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Invalid OTP');
      setStep(STEPS.PASSWORD);
      setMessage({ text: 'OTP verified! Set your password.', success: true });
    } catch (err) {
      setMessage({ text: err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  // ── SIGNUP STEP 3: Set Password & Register ──
  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.password) errs.password = 'Password is required';
    else if (passwords.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!passwords.confirm) errs.confirm = 'Please confirm your password';
    else if (passwords.password !== passwords.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setMessage({ text: '', success: false });
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: signupData.firstName.trim(),
          lastName: signupData.lastName.trim(),
          email: signupData.email.trim(),
          password: passwords.password,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      const data = await res.json();

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', signupData.email.trim());
      localStorage.setItem('userName', signupData.firstName.trim());
      localStorage.setItem('userFirstName', signupData.firstName.trim());
      localStorage.setItem('userLastName', signupData.lastName.trim());
      localStorage.setItem('userRole', data.user?.role || 'user');
      if (data.token) localStorage.setItem('authToken', data.token);

      setMessage({ text: 'Account created! Redirecting...', success: true });
      setTimeout(() => {
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
      }, 1500);
    } catch (err) {
      setMessage({ text: err.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setStep(STEPS.FORM);
    setErrors({});
    setMessage({ text: '', success: false });
    setOtp('');
    setPasswords({ password: '', confirm: '' });
  };

  const leftPanel = (
    <div className="relative flex flex-col justify-between overflow-hidden bg-[#0c0c0e] p-12 text-white">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#d4af37]/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <a href="/" className="inline-block mb-16">
          <span className="text-xl font-bold tracking-[0.25em] text-[#d4af37]">NYF TOTH</span>
        </a>
        <h1 className="mb-4 text-5xl font-bold leading-tight tracking-tight text-white">
          Your fit,<br /><span className="text-[#d4af37]">curated elegantly.</span>
        </h1>
        <p className="max-w-xs text-sm font-light leading-relaxed text-gray-400">
          Premium styling and tailored silhouettes crafted for individuals who value exquisite details.
        </p>
      </div>

      <div className="relative z-10 space-y-6">
        {[
          { title: 'Premium Curation', desc: 'Expertly designed cuts & luxurious fits' },
          { title: 'Harsha valeti\'s Styling Guide', desc: 'Bespoke wear processes directly integrated' },
          { title: 'Secure Concierge Delivery', desc: 'Expedited tracking to your doorstep' },
        ].map(({ title, desc }) => (
          <div key={title} className="flex items-start gap-4">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d4af37]" />
            <div>
              <p className="font-bold text-sm text-white">{title}</p>
              <p className="text-gray-400 text-xs font-light mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 border-t border-white/10 pt-6">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">
          © {new Date().getFullYear()} NYF TOTH ATELIER. All rights reserved.
        </p>
      </div>
    </div>
  );

  const stepLabel = step === STEPS.FORM ? 'Create Account' : step === STEPS.OTP ? 'Verify OTP' : 'Set Password';
  const stepDesc = step === STEPS.FORM ? 'Join the NYF TOTH community.' : step === STEPS.OTP ? `Enter the OTP sent to ${signupData.email}` : 'Choose a strong password.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfbfc] p-4">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #fff inset !important; -webkit-text-fill-color: #0c0c0e !important; }
      `}</style>

      <div className={`fade-up w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl ${isMobile ? '' : 'grid grid-cols-2 min-h-[640px]'}`}>
        {!isMobile && leftPanel}

        <div className="flex flex-col justify-center bg-white p-8 md:p-14">
          {isMobile && (
            <div className="flex justify-center mb-8">
              <span className="text-xl font-bold tracking-[0.25em] text-[#d4af37]">NYF TOTH</span>
            </div>
          )}

          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0c0c0e]">
              {isLogin ? 'Sign In' : stepLabel}
            </h2>
            <p className="text-sm text-gray-500 font-light">
              {isLogin ? 'Welcome back — enter your credentials.' : stepDesc}
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold text-center ${message.success ? 'border-emerald-150 bg-emerald-50 text-emerald-800' : 'border-red-150 bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField label="Email" type="email" name="email" value={loginData.email}
                onChange={e => { setLoginData(p => ({ ...p, email: e.target.value })); clearError('email'); }}
                placeholder="you@example.com" error={errors.email} />

              <InputField label="Password" type={showPassword ? 'text' : 'password'} name="password" value={loginData.password}
                onChange={e => { setLoginData(p => ({ ...p, password: e.target.value })); clearError('password'); }}
                placeholder="••••••••" error={errors.password}>
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-[#d4af37] transition-colors">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </InputField>

              <button type="submit" disabled={loading}
                className="mt-6 w-full py-4 bg-[#0c0c0e] hover:bg-[#d4af37] hover:text-[#0c0c0e] text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* ── SIGNUP STEP 1: Details ── */}
          {!isLogin && step === STEPS.FORM && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" type="text" name="firstName" value={signupData.firstName}
                  onChange={e => { setSignupData(p => ({ ...p, firstName: e.target.value })); clearError('firstName'); }}
                  placeholder="John" error={errors.firstName} />
                <InputField label="Last Name" type="text" name="lastName" value={signupData.lastName}
                  onChange={e => { setSignupData(p => ({ ...p, lastName: e.target.value })); clearError('lastName'); }}
                  placeholder="Doe" error={errors.lastName} />
              </div>
              <InputField label="Email" type="email" name="email" value={signupData.email}
                onChange={e => { setSignupData(p => ({ ...p, email: e.target.value })); clearError('email'); }}
                placeholder="you@example.com" error={errors.email} />

              <button type="submit" disabled={loading}
                className="mt-6 w-full py-4 bg-[#0c0c0e] hover:bg-[#d4af37] hover:text-[#0c0c0e] text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* ── SIGNUP STEP 2: OTP ── */}
          {!isLogin && step === STEPS.OTP && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="mb-5">
                <label className="block mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Enter OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); clearError('otp'); }}
                  placeholder="6-digit OTP"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-center text-sm font-bold tracking-[0.5em] text-[#0c0c0e] focus:border-[#d4af37] focus:outline-none focus:ring-4 focus:ring-[#d4af37]/5 transition-all duration-300"
                />
                {errors.otp && <p className="text-red-500 text-xs font-semibold mt-1.5">{errors.otp}</p>}
              </div>

              <div className="flex items-center justify-between mb-5 text-xs">
                <span className="font-semibold text-gray-400">
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : ''}
                </span>
                {otpTimer === 0 && (
                  <button type="button" onClick={handleSendOtp} className="font-bold text-[#d4af37] underline transition-colors hover:text-[#0c0c0e]">
                    Resend OTP
                  </button>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#0c0c0e] hover:bg-[#d4af37] hover:text-[#0c0c0e] text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {/* ── SIGNUP STEP 3: Set Password ── */}
          {!isLogin && step === STEPS.PASSWORD && (
            <form onSubmit={handleRegister} className="space-y-4">
              <InputField label="Password" type={showPassword ? 'text' : 'password'} name="password" value={passwords.password}
                onChange={e => { setPasswords(p => ({ ...p, password: e.target.value })); clearError('password'); }}
                placeholder="Min. 6 characters" error={errors.password}>
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-[#d4af37] transition-colors">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </InputField>

              <InputField label="Confirm Password" type={showConfirm ? 'text' : 'password'} name="confirm" value={passwords.confirm}
                onChange={e => { setPasswords(p => ({ ...p, confirm: e.target.value })); clearError('confirm'); }}
                placeholder="Re-enter password" error={errors.confirm}>
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-[#d4af37] transition-colors">
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </InputField>

              <button type="submit" disabled={loading}
                className="mt-6 w-full py-4 bg-[#0c0c0e] hover:bg-[#d4af37] hover:text-[#0c0c0e] text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-500 font-light">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button onClick={switchMode}
              className="rounded-full border border-[#0c0c0e] hover:bg-[#0c0c0e] hover:text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0c0c0e] transition-all duration-300">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <button onClick={() => navigate('/')} className="mt-6 text-left text-xs font-bold text-gray-400 hover:text-[#d4af37] transition-colors">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
