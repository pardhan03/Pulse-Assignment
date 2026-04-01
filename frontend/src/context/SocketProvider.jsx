import { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../SocketIO/socket';
import { useAuth } from './AuthProvider';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [processingUpdates, setProcessingUpdates] = useState({});

  useEffect(() => {
    if (token) {
      try {
        const socketInstance = getSocket();
        setSocket(socketInstance);

        socketInstance.on('processing-update', (data) => {
          setProcessingUpdates(prev => ({
            ...prev,
            [data.videoId]: data
          }));
        });

        socketInstance.on('processing-complete', (data) => {
          setProcessingUpdates(prev => ({
            ...prev,
            [data.videoId]: { ...data, progress: 100, status: 'Complete!' }
          }));
        });

        socketInstance.on('processing-failed', (data) => {
          setProcessingUpdates(prev => ({
            ...prev,
            [data.videoId]: { ...data, status: 'Failed', progress: 0 }
          }));
        });

        return () => {
          socketInstance.off('processing-update');
          socketInstance.off('processing-complete');
          socketInstance.off('processing-failed');
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, processingUpdates }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);