import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../supabase';
export default function CompleteProfile() {
  const [mobileNumber, setMobileNumber] = useState('+91 ');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();
  
        if (profile?.mobile_number && profile?.date_of_birth) {
          navigate('/home');
        }
      } else {
        navigate('/login');
      }
    };
    checkProfile();
  }, [navigate]);
  

const handleMobileChange = (e) => {
    const value = e.target.value;
    if (e.nativeEvent.inputType === 'deleteContentBackward') {
      if (value.length <= 4) {
        setMobileNumber('+91 ');
        return;
      }
      setMobileNumber(value);
      return;
    }
  
    const digits = value.replace(/\D/g, '');
    if (!value.startsWith('+91') && digits.length > 0) {
      const newDigits = digits.slice(0, 10);
      setMobileNumber(`+91 ${newDigits}`);
      return;
    }
  
    const newDigits = digits.slice(2, 12);
    const formatted = newDigits.length > 5
      ? `+91 ${newDigits.slice(0, 5)} ${newDigits.slice(5)}`
      : `+91 ${newDigits}`;
  
    setMobileNumber(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobileNumber.length < 12) {
      setError('Please enter a valid mobile number');
      return;
    }
    if (!dateOfBirth) {
      setError('Date of birth is required');
      return;
    }
  
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No authenticated user');
      const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: user.user_metadata.full_name || user.user_metadata.name,
        email: user.email,
        mobile_number: mobileNumber,
        date_of_birth: dateOfBirth
      });
  
      if (error) throw error;
      
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="w-full px-6 py-8 relative flex justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-4 top-8 text-orange-500"
        >
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-white text-2xl font-bold">Complete Profile</h1>
      </div>

      <div className="bg-gray-200 flex-1 rounded-t-3xl px-6 pt-8 pb-6 flex flex-col">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-black mb-2 font-medium">Mobile Number</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={handleMobileChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block text-black mb-2 font-medium">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-black"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-full mt-6 font-medium text-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}