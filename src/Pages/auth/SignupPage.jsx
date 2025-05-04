import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import GoogleButton from '../../components/auth/GoogleButton';
export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
    email: '',
    mobileNumber: '+91 ',
    dateOfBirth: ''
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) navigate('/home');
    };
    checkSession();
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobileNumber') {
      if (e.nativeEvent.inputType === 'deleteContentBackward') {
        if (value.length <= 4) {
          setFormData(prev => ({ ...prev, [name]: '+91 ' }));
          return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
        return;
      }
      const digits = value.replace(/\D/g, '');
      if (!value.startsWith('+91') && digits.length > 0) {
        const newDigits = digits.slice(0, 10);
        setFormData(prev => ({ ...prev, [name]: `+91 ${newDigits}` }));
        return;
      }
      const newDigits = digits.slice(2, 12);
      const formatted = newDigits.length > 5
        ? `+91 ${newDigits.slice(0, 5)} ${newDigits.slice(5)}`
        : `+91 ${newDigits}`;
  
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters');
      return false;
    }
    if (formData.mobileNumber.length < 12) {
      setError('Please enter a valid mobile number');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      setLoading(true);
      setError('');

      const { data : {user}, error : authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            mobile_number: formData.mobileNumber,
            date_of_birth: formData.dateOfBirth,
          },
        }
      });
  
      if (authError) throw authError;
    if (!user) throw new Error('User creation failed');

      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{
          id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          mobile_number: formData.mobileNumber,
          date_of_birth: formData.dateOfBirth
        }]);
  
      if (profileError) throw profileError;
      navigate('/home'); 
    } catch (err) {
        console.error("Signup error:", err);
        let errorMessage = 'Registration failed. Please check your details';
        
        if (err.message.includes('duplicate')) {
          if (err.message.includes('profiles_email_key')) {
            errorMessage = 'Email already registered';
          }
          else if (err.message.includes('profiles_mobile_number_key')) {
            errorMessage = 'Mobile number already registered';
          }
  
  
  setError(errorMessage);
}
    } finally {
      setLoading(false);
    }
  };
  
  // SignupPage.jsx - Update Google handler
const handleGoogleSignIn = async () => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/complete-profile`,
        queryParams: {
          prompt: 'consent',
          screen_hint: 'signup',
          include_granted_scopes: 'true'
        }
      }
    });
    if (error) throw error;
  } catch (err) {
    setError(err.message.includes('already') 
      ? 'Google account already registered' 
      : 'Failed to sign in with Google');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full px-6 py-8 relative flex justify-center">
        <button 
          onClick={() => navigate('/')}
          className="absolute left-4 top-8 text-orange-500"
        >
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-white text-2xl font-bold">Create New Account</h1>
      </div>
      
      {/* Form Container */}
      <div className="bg-gray-200 flex-1 rounded-t-3xl px-6 pt-8 pb-6 flex flex-col">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
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
                minLength="6"
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
          <div>
          <label className="block text-black mb-2 font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 rounded-xl bg-white text-black pr-12"
              minLength="6"
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
          <div className="mb-4">
            <label className="block text-black mb-2 font-medium">Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                required
              />
            </div>
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
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-full mt-6 font-medium text-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        {/* Google Sign-In */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-4">or continue with</p>
          <GoogleButton 
            onClick={handleGoogleSignIn} 
            loading={loading}
            redirectTo="/complete-profile"
          />
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