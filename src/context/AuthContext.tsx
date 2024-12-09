import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { User, AuthState, SignUpFormData } from '../types/auth';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { AuthError, getErrorMessage, isUserExistsError } from '../utils/error.utils';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpFormData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    AuthService.getSession().then((session) => {
      setState({
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      });
    });

    const subscription = AuthService.onAuthStateChange((session) => {
      setState({
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await AuthService.signIn(email, password);
      toast.success('Successfully signed in!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signUp = async (data: SignUpFormData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // First check if user exists
      const userExists = await AuthService.checkUserExists(data.email);
      if (userExists) {
        toast.error('An account with this email already exists. Please sign in instead.');
        return;
      }

      const { user } = await AuthService.signUp(data);
      if (!user?.id) throw new AuthError('User ID not found after signup');

      // Wait for profile to be created by the database trigger
      const profileExists = await ProfileService.waitForProfile(user.id);
      if (!profileExists) {
        throw new AuthError('Profile creation failed. Please try again.');
      }

      // Update profile with user information
      await ProfileService.updateProfile(user.id, data);
      
      // Add children information
      if (data.children.length > 0) {
        await ProfileService.addChildren(user.id, data.children);
      }

      toast.success('Successfully signed up! Please check your email for verification.');
    } catch (error) {
      if (!isUserExistsError(error)) {
        const message = getErrorMessage(error);
        toast.error(message);
      }
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      toast.success('Successfully signed out!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};