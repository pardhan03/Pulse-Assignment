import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../common/Loading';

export const HomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [user, loading, navigate]);

  return <Loading />;
};
