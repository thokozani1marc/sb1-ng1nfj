import React, { useState, useEffect } from 'react';
import { ChildData } from '../../types/auth';
import { ChildrenService } from '../../services/children.service';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { EditChildForm } from './EditChildForm';

export function ChildrenList() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingChild, setEditingChild] = useState<ChildData | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadChildren();
    }
  }, [user?.id]);

  const loadChildren = async () => {
    if (!user?.id) return;
    
    try {
      const data = await ChildrenService.getChildren(user.id);
      setChildren(data);
    } catch (error) {
      toast.error('Failed to load children');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (childId: string) => {
    if (!confirm('Are you sure you want to remove this child?')) return;

    try {
      await ChildrenService.deleteChild(childId);
      setChildren(prev => prev.filter(child => child.id !== childId));
      toast.success('Child removed successfully');
    } catch (error) {
      toast.error('Failed to remove child');
    }
  };

  const handleAddSuccess = () => {
    setIsAddingChild(false);
    loadChildren();
  };

  const handleEditSuccess = () => {
    setEditingChild(null);
    loadChildren();
  };

  if (isLoading) {
    return <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Children</h3>
        <button
          onClick={() => setIsAddingChild(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Child
        </button>
      </div>

      {isAddingChild && (
        <EditChildForm
          onCancel={() => setIsAddingChild(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {children.length === 0 && !isAddingChild ? (
        <p className="text-gray-500 text-center py-4">No children added yet</p>
      ) : (
        <div className="space-y-4">
          {children.map(child => (
            <div
              key={child.id}
              className="bg-white shadow rounded-lg p-4"
            >
              {editingChild?.id === child.id ? (
                <EditChildForm
                  child={child}
                  onCancel={() => setEditingChild(null)}
                  onSuccess={handleEditSuccess}
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {child.first_name} {child.last_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Grade: {child.school_grade}
                    </p>
                    <p className="text-sm text-gray-500">
                      DOB: {new Date(child.date_of_birth).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingChild(child)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(child.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}