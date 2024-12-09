import { supabase } from '../lib/supabase';
import { ChildData } from '../types/auth';
import { AuthError } from '../utils/error.utils';

export class ChildrenService {
  static async getChildren(userId: string): Promise<ChildData[]> {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('profile_id', userId);

      if (error) throw new AuthError('Failed to fetch children', error);
      return data || [];
    } catch (error) {
      console.error('Error fetching children:', error);
      throw new AuthError('Failed to fetch children', error);
    }
  }

  static async updateChild(childId: string, data: Partial<ChildData>) {
    try {
      const { error } = await supabase
        .from('children')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', childId);

      if (error) throw new AuthError('Failed to update child', error);
    } catch (error) {
      console.error('Error updating child:', error);
      throw new AuthError('Failed to update child', error);
    }
  }

  static async deleteChild(childId: string) {
    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw new AuthError('Failed to delete child', error);
    } catch (error) {
      console.error('Error deleting child:', error);
      throw new AuthError('Failed to delete child', error);
    }
  }

  static async addChild(userId: string, child: Omit<ChildData, 'id'>) {
    try {
      const { error } = await supabase
        .from('children')
        .insert([
          {
            profile_id: userId,
            ...child,
          },
        ]);

      if (error) throw new AuthError('Failed to add child', error);
    } catch (error) {
      console.error('Error adding child:', error);
      throw new AuthError('Failed to add child', error);
    }
  }
}