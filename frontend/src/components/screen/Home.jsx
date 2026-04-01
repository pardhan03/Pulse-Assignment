import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../common/Loading';

export const HomePage = () => {
  const { authUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (authUser) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [authUser, loading, navigate]);

  return <Loading />;
};
