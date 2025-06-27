
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import ProfilePictureUpload from './ProfilePictureUpload';
import { ProfileData, profileOrchestrator } from '@/services/profileOrchestrator';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    firstName: '',
    lastName: '',
    email: '',
    age: undefined,
    phoneNumber: '',
    profilePicture: null,
    resume: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'age' ? parseInt(e.target.value) || undefined : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
      setSubmitStatus('idle');
    }
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setValidationErrors([]);

    try {
      console.log('Submitting profile form with data:', formData);
      
      const result = await profileOrchestrator.submitProfile(formData as ProfileData);
      
      if (result.success) {
        setSubmitStatus('success');
        toast({
          title: "Success!",
          description: result.message || "Profile submitted successfully",
        });
        console.log('Profile submitted successfully with ID:', result.data?.id);
      } else {
        setSubmitStatus('error');
        setValidationErrors(result.errors || ['Submission failed']);
        toast({
          title: "Submission Failed",
          description: result.message || "Please check the form and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      setSubmitStatus('error');
      setValidationErrors(['An unexpected error occurred']);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Complete your profile information</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Create Your Profile</CardTitle>
            <CardDescription className="text-blue-100">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex justify-center mb-8">
                <ProfilePictureUpload
                  onImageChange={handleImageChange}
                  currentImage={formData.profilePicture}
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    placeholder="Enter your first name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    placeholder="Enter your last name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Enter your email address"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Age and Phone Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={handleInputChange('age')}
                    placeholder="Enter your age"
                    min="18"
                    max="120"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange('phoneNumber')}
                    placeholder="Enter your phone number"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Resume Field */}
              <div className="space-y-2">
                <Label htmlFor="resume" className="text-sm font-medium">
                  Resume / Bio
                </Label>
                <Textarea
                  id="resume"
                  value={formData.resume}
                  onChange={handleInputChange('resume')}
                  placeholder="Tell us about yourself, your experience, and qualifications..."
                  rows={6}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle size={20} className="text-red-500" />
                    <h4 className="text-red-800 font-medium">Please fix the following errors:</h4>
                  </div>
                  <ul className="list-disc list-inside text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={20} className="text-green-500" />
                    <p className="text-green-800 font-medium">Profile submitted successfully!</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Profile...
                  </>
                ) : (
                  'Submit Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileForm;
