import { supabase } from '../lib/supabase';
import { SignUpFormData, ProfileData, ChildData } from '../types/auth';
import { AuthError } from '../utils/error.utils';

export class ProfileService {
  static async verifyProfile(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error verifying profile:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error verifying profile:', error);
      return false;
    }
  }

  static async createProfile(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            parent_first_name: '',
            parent_last_name: '',
            phone_number: '',
            emergency_contact: '',
            street_address: '',
            apartment: null,
            city: '',
            state_province: '',
            name: '',
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error('Error creating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      return false;
    }
  }

  static async waitForProfile(userId: string, maxAttempts = 5): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      const exists = await this.verifyProfile(userId);
      if (exists) return true;

      // Only try to create the profile on the first attempt
      if (i === 0) {
        const created = await this.createProfile(userId);
        if (created) return true;
      }

      // Exponential backoff with max delay of 1 second
      const delay = Math.min(Math.pow(1.5, i) * 100, 1000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
  }

  static async updateProfile(userId: string, data: Partial<ProfileData>) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw new AuthError('Failed to update profile', error);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new AuthError('Failed to update profile', error);
    }
  }

  static async deleteProfile(userId: string) {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw new AuthError('Failed to delete profile', error);
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw new AuthError('Failed to delete profile', error);
    }
  }

  static async getProfile(userId: string): Promise<ProfileData> {
    try {
      // First verify if profile exists
      const exists = await this.verifyProfile(userId);
      if (!exists) {
        // Try to create profile if it doesn't exist
        const created = await this.createProfile(userId);
        if (!created) {
          throw new AuthError('Failed to create profile');
        }
      }

      // Now fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw new AuthError('Failed to fetch profile', error);
      if (!data) throw new AuthError('Profile not found');
      
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new AuthError('Failed to fetch profile', error);
    }
  }

  static async addChildren(userId: string, children: SignUpFormData['children']) {
    if (children.length === 0) return;

    try {
      const profileExists = await this.verifyProfile(userId);
      if (!profileExists) {
        const created = await this.createProfile(userId);
        if (!created) {
          throw new AuthError('Failed to create profile');
        }
      }

      const { error } = await supabase
        .from('children')
        .insert(
          children.map(child => ({
            profile_id: userId,
            first_name: child.first_name,
            last_name: child.last_name,
            school_grade: child.school_grade,
            date_of_birth: child.date_of_birth,
          }))
        );

      if (error) throw new AuthError('Failed to add children', error);
    } catch (error) {
      console.error('Error adding children:', error);
      throw new AuthError('Failed to add children', error);
    }
  }
}