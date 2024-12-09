import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface ProfileData {
  id: string;
  parent_first_name: string;
  parent_last_name: string;
  email: string;
  phone_number: string;
  emergency_contact: string;
  street_address: string;
  apartment?: string;
  city: string;
  state_province: string;
  updated_at: string;
}

export interface ChildData {
  id: string;
  first_name: string;
  last_name: string;
  school_grade: string;
  date_of_birth: string;
}

export interface User extends Omit<SupabaseUser, 'app_metadata' | 'user_metadata'> {
  profile?: ProfileData;
  children?: ChildData[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignUpFormData {
  email: string;
  password: string;
  parent_first_name: string;
  parent_last_name: string;
  phone_number: string;
  emergency_contact: string;
  street_address: string;
  apartment: string;
  city: string;
  state_province: string;
  children: {
    first_name: string;
    last_name: string;
    school_grade: string;
    date_of_birth: string;
  }[];
}

export type AuthStateChangeCallback = (session: Session | null) => void;