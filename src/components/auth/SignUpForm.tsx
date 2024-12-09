import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SignUpFormData } from '../../types/auth';
import { ParentInfoStep } from './steps/ParentInfoStep';
import { ChildInfoStep } from './steps/ChildInfoStep';
import { ArrowLeft, ArrowRight, Loader2, Bot } from 'lucide-react';

const STEPS = ['Parent Information', 'Child Information'];

export function SignUpForm({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    parent_first_name: '',
    parent_last_name: '',
    phone_number: '',
    emergency_contact: '',
    street_address: '',
    apartment: '',
    city: '',
    state_province: '',
    children: [
      {
        first_name: '',
        last_name: '',
        school_grade: '',
        date_of_birth: '',
      },
    ],
  });

  const { signUp, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }
    try {
      await signUp(formData);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const updateFormData = (data: Partial<SignUpFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="text-center">
        <Bot className="mx-auto h-12 w-12 text-indigo-600" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight">Create your account</h2>
        <div className="mt-4">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-5">
              {STEPS.map((step, index) => (
                <li key={step} className="flex items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      index <= currentStep
                        ? 'bg-indigo-600 text-white'
                        : 'border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 0 && (
          <ParentInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 1 && (
          <ChildInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => currentStep === 0 ? onBack() : setCurrentStep(currentStep - 1)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : currentStep < STEPS.length - 1 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}