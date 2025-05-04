import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndProfile = async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

  // if (location.pathname === '/complete-profile') return;
      try {

        await new Promise(resolve => setTimeout(resolve, 500));

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('mobile_number, date_of_birth')
        .eq('id', user.id)
        .single();

        if (!error) {
          const needsCompletion = !profile?.mobile_number || !profile?.date_of_birth;
          if (needsCompletion && location.pathname !== '/complete-profile') {
            navigate('/complete-profile');
          }
          if (!needsCompletion && location.pathname === '/complete-profile') {
            navigate('/home');
          }
        }
      } catch (error) {
        console.error("Profile check error:", error);
        navigate('/complete-profile');
      }
    };

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => checkAuthAndProfile(user));

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') await checkAuthAndProfile(session.user);
        if (event === 'SIGNED_OUT') navigate('/login');
      }
    );

    return () => subscription?.unsubscribe();
  }, [navigate, location]);

  return children;
}