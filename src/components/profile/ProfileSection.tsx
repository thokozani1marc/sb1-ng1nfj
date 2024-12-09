import React, { useState, useEffect } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileService } from '../../services/profile.service';
import { ProfileData } from '../../types/auth';
import { EditProfileForm } from './EditProfileForm';
import { ChildrenList } from './ChildrenList';
import { toast } from 'react-hot-toast';

export function ProfileSection() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    try {
      const data = await ProfileService.getProfile(user.id);
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    loadProfile();
  };

  if (isLoading || !profile) {
    return <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <EditProfileForm
                profile={profile}
                onCancel={() => setIsEditing(false)}
                onSuccess={handleEditSuccess}
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.parent_first_name} {profile.parent_last_name}
                </h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user?.email}</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <ChildrenList />
      </div>
    </div>
  );
}