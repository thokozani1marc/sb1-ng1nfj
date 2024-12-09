import React from 'react';
import { SignUpFormData } from '../../../types/auth';
import { Plus, Trash2 } from 'lucide-react';

interface ChildInfoStepProps {
  formData: SignUpFormData;
  updateFormData: (data: Partial<SignUpFormData>) => void;
}

export function ChildInfoStep({ formData, updateFormData }: ChildInfoStepProps) {
  const handleChildChange = (index: number, field: string, value: string) => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    updateFormData({ children: newChildren });
  };

  const addChild = () => {
    updateFormData({
      children: [
        ...formData.children,
        { first_name: '', last_name: '', school_grade: '', date_of_birth: '' },
      ],
    });
  };

  const removeChild = (index: number) => {
    const newChildren = formData.children.filter((_, i) => i !== index);
    updateFormData({ children: newChildren });
  };

  return (
    <div className="space-y-6">
      {formData.children.map((child, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
          <div className="absolute right-4 top-4">
            {formData.children.length > 1 && (
              <button
                type="button"
                onClick={() => removeChild(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Child {index + 1}
          </h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                required
                value={child.first_name}
                onChange={(e) => handleChildChange(index, 'first_name', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                required
                value={child.last_name}
                onChange={(e) => handleChildChange(index, 'last_name', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                School Grade
              </label>
              <input
                type="text"
                required
                value={child.school_grade}
                onChange={(e) => handleChildChange(index, 'school_grade', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={child.date_of_birth}
                onChange={(e) => handleChildChange(index, 'date_of_birth', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addChild}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Child
      </button>
    </div>
  );
}