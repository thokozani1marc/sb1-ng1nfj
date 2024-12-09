import React from 'react';
import { SignUpFormData } from '../../../types/auth';

interface ParentInfoStepProps {
  formData: SignUpFormData;
  updateFormData: (data: Partial<SignUpFormData>) => void;
}

export function ParentInfoStep({ formData, updateFormData }: ParentInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label htmlFor="parent_first_name" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="parent_first_name"
          name="parent_first_name"
          required
          value={formData.parent_first_name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="parent_last_name" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="parent_last_name"
          name="parent_last_name"
          required
          value={formData.parent_last_name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          required
          value={formData.phone_number}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
          Emergency Contact
        </label>
        <input
          type="tel"
          id="emergency_contact"
          name="emergency_contact"
          required
          value={formData.emergency_contact}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          id="street_address"
          name="street_address"
          required
          value={formData.street_address}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
          Apartment (optional)
        </label>
        <input
          type="text"
          id="apartment"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          required
          value={formData.city}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="state_province" className="block text-sm font-medium text-gray-700">
          State/Province
        </label>
        <input
          type="text"
          id="state_province"
          name="state_province"
          required
          value={formData.state_province}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}