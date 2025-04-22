import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate,Link } from 'react-router-dom';
export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    email: '',
    mobileNumber: '+91 ',
    dateOfBirth: ''
  });
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format mobile number input
    if (name === 'mobileNumber') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      const formatted = cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
      setFormData(prev => ({ ...prev, [name]: `+91 ${formatted}` }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic here
    console.log('Google Sign-In initiated');
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full px-6 py-8 relative flex justify-center">
        <button 
        onClick={() => navigate('/home')}
        className="absolute left-4 top-8 text-orange-500">
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-white text-2xl font-bold">Create New Account</h1>
      </div>
      
      {/* Form Container */}
      <div className="bg-gray-200 flex-1 rounded-t-3xl px-6 pt-8 pb-6 flex flex-col">
        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-black mb-2 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl bg-white text-black"
              required
            />
          </div>
          
          {/* Password */}
          <div>
            <label className="block text-black mb-2 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-xl bg-white text-black pr-12"
                minLength="8"
                required
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-black mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              className="w-full px-4 py-3 rounded-xl bg-white text-black"
              required
            />
          </div>
          
          {/* Mobile Number */}
          <div>
            <label className="block text-black mb-2 font-medium">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-white text-black"
              pattern="^\+91\s?\d{5}\s?\d{5}$"
              required
            />
          </div>
          
          {/* Date of Birth */}
          <div>
            <label className="block text-black mb-2 font-medium">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white text-black"
              required
            />
          </div>
        </form>
        
        {/* Terms Agreement */}
        <div className="text-center mt-4 text-sm">
        <p className="text-gray-600">
          By continuing, you agree to our{' '}
          <Link 
            to="/terms" 
            className="text-red-500 font-medium hover:underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link 
            to="/privacy" 
            className="text-red-500 font-medium hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
        {/* Sign Up Button */}
        <button className="bg-orange-500 text-white py-3 rounded-full mt-6 font-medium text-lg hover:bg-orange-600 transition-colors">
          Create Account
        </button>
        
        {/* Google Sign-In */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-4">or continue with</p>
          <button 
            onClick={handleGoogleSignIn}
            className="w-full max-w-xs mx-auto bg-white text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
            >
              {/* <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              /> */}
            </svg>
            Continue with Google
          </button>
        </div>
        
        {/* Login Link */}
        <div className="mt-6 text-center">
        <p className="text-black text-sm">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-red-500 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
}