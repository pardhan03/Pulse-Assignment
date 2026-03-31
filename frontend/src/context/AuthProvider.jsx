import React, { createContext, useContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const localUser = localStorage.getItem("user");
    const [token, setToken] = useState(localStorage.getItem('token'));
    console.log(localUser, '---------')
    const [authUser, setAuthUser] = useState(
        localUser ? JSON.parse(localUser) : null
    );

    return (
        <AuthContext.Provider value=
            {{
                authUser,
                setAuthUser,
                token,
                setToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
