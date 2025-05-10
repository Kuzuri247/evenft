'use client';

import { useState } from 'react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; socialLink: string }) => void;
  isLoading: boolean;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}: RegistrationModalProps) {
  const [fullName, setFullName] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [errors, setErrors] = useState({ fullName: '', socialLink: '' });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = { fullName: '', socialLink: '' };
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!socialLink.trim()) {
      newErrors.socialLink = 'Social link is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ fullName, socialLink });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Complete Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="socialLink" className="block text-sm font-medium text-gray-700 mb-1">
              Social Link
            </label>
            <input
              id="socialLink"
              type="text"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Twitter, LinkedIn, etc."
            />
            {errors.socialLink && <p className="text-red-500 text-sm mt-1">{errors.socialLink}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 