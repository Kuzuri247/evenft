'use client';

import { useState, useEffect } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

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
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className={`relative w-full max-w-md transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} transition-all duration-300 ease-in-out`}>
        <div className="relative bg-background/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-800/30 overflow-hidden">
          {/* Glow effects */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 blur-xl"></div>
          <div className="absolute top-0 left-[-10%] right-[-10%] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          
          <div className="relative p-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 mb-6">Complete Registration</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-indigo-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.fullName}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="socialLink" className="block text-sm font-medium text-indigo-200 mb-2">
                  Social Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    id="socialLink"
                    type="text"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Twitter, LinkedIn, etc."
                  />
                </div>
                {errors.socialLink && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.socialLink}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg overflow-hidden transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 bg-background/40 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                  <span className="absolute inset-0 border border-indigo-400/30 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative text-indigo-200">Cancel</span>
                </button>
                
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-medium rounded-lg overflow-hidden transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className={`absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 ${isLoading ? 'opacity-70' : 'opacity-90 group-hover:opacity-100'} transition-opacity`}></span>
                  <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative text-white flex items-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <svg className="ml-2 -mr-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 