import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChildrenService } from '../../services/children.service';
import { ChildData } from '../../types/auth';
import { toast } from 'react-hot-toast';

interface EditChildFormProps {
  child?: ChildData;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditChildForm({ child, onCancel, onSuccess }: EditChildFormProps) {
  const [formData, setFormData] = useState({
    first_name: child?.first_name || '',
    last_name: child?.last_name || '',
    school_grade: child?.school_grade || '',
    date_of_birth: child?.date_of_birth || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      if (child?.id) {
        await ChildrenService.updateChild(child.id, formData);
        toast.success('Child information updated successfully!');
      } else {
        await ChildrenService.addChild(user.id, formData);
        toast.success('Child added successfully!');
      }
      onSuccess();
    } catch (error) {
      toast.error(child?.id ? 'Failed to update child' : 'Failed to add child');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="school_grade" className="block text-sm font-medium text-gray-700">
            School Grade
          </label>
          <input
            type="text"
            id="school_grade"
            name="school_grade"
            required
            value={formData.school_grade}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            required
            value={formData.date_of_birth}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Saving...' : child?.id ? 'Update Child' : 'Add Child'}
        </button>
      </div>
    </form>
  );
}