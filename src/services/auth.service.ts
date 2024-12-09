import { SignUpFormData } from '../types/auth';
import { supabase } from '../lib/supabase';
import type { AuthStateChangeCallback } from '../types/auth';

export class AuthService {
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }

  static async signUp(data: SignUpFormData) {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (signUpError) throw signUpError;
    if (!authData.user?.id) throw new Error('User ID not found after signup');

    return authData;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  static onAuthStateChange(callback: AuthStateChangeCallback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return subscription;
  }

  static async checkUserExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });
      
      if (error && error.status === 422) {
        return false; // User doesn't exist
      }
      
      return true; // User exists
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }
}