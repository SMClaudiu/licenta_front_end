import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '../services/authService';
import { ClientDTO, LoginRequest, SigninRequest } from '../types/api';
import { storage } from "../utils/storage";

interface AuthContextType {
    userData: ClientDTO | null;
    isLoadingAuth: boolean;
    isLoading: boolean;
    logIn: (credentials: LoginRequest) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (signinData: SigninRequest) => Promise<void>;
    updatedAuthUserData: (newUserData : ClientDTO)=> void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_DATA_KEY = 'userData';
const USER_TOKEN_KEY = 'userToken';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<ClientDTO | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Start with true
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            console.log("🔄 AuthContext: Loading user data from storage...");
            setIsLoadingAuth(true);

            try {
                const storedData = storage.get(USER_DATA_KEY);
                const storedToken = storage.get(USER_TOKEN_KEY);

                console.log("📦 Stored data:", storedData ? "Found" : "Not found");
                console.log("🔑 Stored token:", storedToken ? "Found" : "Not found");

                if (storedData && storedToken) {
                    const parsedData: ClientDTO = JSON.parse(storedData);
                    console.log("✅ AuthContext: User data loaded from storage:", parsedData);
                    setUserData(parsedData);
                } else {
                    console.log("❌ AuthContext: No valid user data found in storage");
                    setUserData(null);
                }
            } catch (err) {
                console.error('💥 AuthContext: Failed to load user data from storage:', err);
                storage.remove(USER_DATA_KEY);
                storage.remove(USER_TOKEN_KEY);
                setUserData(null);
            } finally {
                setIsLoadingAuth(false);
                console.log("🏁 AuthContext: Finished loading user data");
            }
        };

        loadUserData();
    }, []);

    // Add this useEffect to debug userData changes
    useEffect(() => {
        console.log("👤 AuthContext: userData changed:", userData);
        console.log("⏳ AuthContext: isLoadingAuth:", isLoadingAuth);
    }, [userData, isLoadingAuth]);

    const logIn = async (credentials: LoginRequest) => {
        console.log("🔐 AuthContext: Starting sign-in process");
        setIsLoading(true);

        try {
            const authResponse = await AuthService.login(credentials.email, credentials.password);

            const { token, client } = authResponse;

            storage.set(USER_TOKEN_KEY, token);
            storage.set(USER_DATA_KEY, JSON.stringify(client));
            setUserData(authResponse.client);

            console.log('✅ AuthContext: Sign-in successful for user:', authResponse.client.email);
        } catch (err) {
            console.error('💥 AuthContext: Sign-in failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
            alert(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        console.log("🚪 AuthContext: Starting sign-out process");
        setIsLoading(true);

        try {
            setUserData(null);
            storage.remove(USER_DATA_KEY);
            storage.remove(USER_TOKEN_KEY);
            console.log('✅ AuthContext: User signed out successfully');
        } catch (err) {
            console.error('💥 AuthContext: Sign-out error:', err);
            alert('An error occurred during sign out.');
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (signinData: SigninRequest) => {
        setIsLoading(true);
        try {
            const {token, client} = await AuthService.signin(signinData);

            storage.set(USER_TOKEN_KEY, token)
            storage.set(USER_DATA_KEY, JSON.stringify(client))
            setUserData(client);

            alert("Signup successful for user " + client.email);
            console.log('✅ AuthContext: Signup successful');
        } catch (err) {
            console.error('💥 AuthContext: Sign-up failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
            alert(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updatedAuthUserData = (newUserData : ClientDTO)=> {
        setUserData(newUserData);
        storage.set(USER_DATA_KEY, JSON.stringify(newUserData));
        console.log("🔄 AuthContext: User data updated via updatedAuthUserData");
    }
    return (
        <AuthContext.Provider value={{
            userData,
            isLoadingAuth,
            isLoading,
            logIn,
            signOut,
            signUp,
            updatedAuthUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};