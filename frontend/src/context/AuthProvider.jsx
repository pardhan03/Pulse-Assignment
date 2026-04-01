import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../api/axios";
import { initializeSocket } from "../SocketIO/socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkIsUserLogedIn = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user) {
            try {
                setToken(token);
                setAuthUser(JSON.parse(user));
                initializeSocket(token);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        } else {
            console.log("No LoggedIn Usre found");
            setAuthUser(null);
        }
        setLoading(false);
    };

    const handleRegister = async (userData) => {
        try {
            const response = await signup(userData);
            const { token: newToken, user: newUser } = response?.data?.data;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));

            setAuthUser(user);
            setToken(newToken);
            initializeSocket(token)
            return { success: true };
        } catch (err) {
            console.log('Error while signup:', err)
        }
    };

    const handleLogin = async (data) => {
        try {
            const response = await login(data);
            const { token: newToken, user: newUser } = response?.data?.data;
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
            setAuthUser(user);
            setToken(newToken);
            initializeSocket(token)
            return { success: true };
        } catch (err) {
            console.log('Error while login:', err)
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        checkIsUserLogedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, token, loading, handleRegister, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
