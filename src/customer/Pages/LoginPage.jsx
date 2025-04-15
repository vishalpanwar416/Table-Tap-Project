import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('example@example.com');
  const [password, setPassword] = useState('************');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen flex flex-col items-center overflow-hidden font-spartan-medium">
      {/* Header */}
      <div className="w-full px-6 py-8 relative flex justify-center">
        <button className="absolute left-4 top-8 text-orange-500"
        onClick={() => navigate('/home')}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-gray-300 text-2xl font-medium">Log In</h1>
      </div>
      
      {/* Login Container */}
      <div className="bg-gray-200 w-full flex-1 rounded-t-3xl px-6 pt-10 pb-6 flex flex-col">
        <h2 className="text-black text-2xl font-semibold mb-12">Welcome</h2>
        
        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-black mb-2 text-lg">Email or Mobile Number</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-black"
            />
          </div>
          
          <div>
            <label className="block text-black mb-2 text-lg">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white text-black pr-12"
              />
              <button 
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button className="text-black text-sm">Forget Password</button>
            </div>
          </div>
        </div>
        
        {/* Login Button */}
        <button className="bg-gray-600 text-white py-3 rounded-full mt-8 font-medium text-lg">
          Log In
        </button>
        
        {/* Alternative Login */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">or sign up with</p>
          <div className="flex justify-center mt-4 gap-4">
            <button className="w-[110px] h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-xl font-normal ">Google</span>
            </button> 

            <button className="w-[150px] h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-xl font-normal ">Phone Number</span>
            </button> 

          </div>
        </div>
        
        {/* Sign Up Link */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-gray-600 text-xl pb-[150px]">
            Don't have an account? <span className="text-red-500 font-medium">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}