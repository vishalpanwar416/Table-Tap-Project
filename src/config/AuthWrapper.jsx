// AuthWrapper.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AuthWrapper({ children, publicOnly = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndProfile = async (user) => {
      if (publicOnly && user) {
        // If this is a public-only route and user is logged in, redirect to home
        navigate('/home');
        return;
      }

      if (!publicOnly && !user) {
        // If this is a protected route and no user, redirect to login
        navigate('/login');
        return;
      }

      // Existing profile completion check logic
      if (user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('mobile_number, date_of_birth')
            .eq('id', user.id)
            .single();

          const needsCompletion = !profile?.mobile_number || !profile?.date_of_birth;

          if (needsCompletion && location.pathname !== '/complete-profile') {
            navigate('/complete-profile');
          } else if (!needsCompletion && location.pathname === '/complete-profile') {
            navigate('/home');
          }
        } catch (error) {
          console.error("Profile check error:", error);
        }
      }
      
      setChecking(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAuthAndProfile(session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') checkAuthAndProfile(session.user);
      if (event === 'SIGNED_OUT') checkAuthAndProfile(null);
    });

    return () => subscription?.unsubscribe();
  }, [navigate, location, publicOnly]);
  
  if (checking) return <div className="text-center p-8">Checking authentication...</div>;
  return children;
}