
import { z } from 'zod';

// Validation schema for profile data
export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  age: z.number().min(18, 'Age must be at least 18').max(120, 'Age must be less than 120'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  profilePicture: z.string().optional(),
  resume: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string;
}

// Mock API service - simulates backend API calls
class ProfileApiService {
  private simulateNetworkDelay = () => 
    new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

  async validateProfile(data: ProfileData): Promise<ApiResponse<ProfileData>> {
    await this.simulateNetworkDelay();
    
    try {
      const validatedData = profileSchema.parse(data);
      console.log('Profile validation successful:', validatedData);
      
      return {
        success: true,
        data: validatedData,
        message: 'Profile validated successfully'
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => err.message),
          message: 'Validation failed'
        };
      }
      
      return {
        success: false,
        errors: ['An unexpected error occurred'],
        message: 'Validation failed'
      };
    }
  }

  async saveProfile(data: ProfileData): Promise<ApiResponse<{ id: string }>> {
    await this.simulateNetworkDelay();
    
    // Simulate occasional API failures for demonstration
    if (Math.random() < 0.1) {
      return {
        success: false,
        errors: ['Server temporarily unavailable'],
        message: 'Failed to save profile'
      };
    }

    console.log('Profile saved successfully:', data);
    
    return {
      success: true,
      data: { id: `profile-${Date.now()}` },
      message: 'Profile saved successfully'
    };
  }
}

// Orchestration layer - coordinates API calls and validation
export class ProfileOrchestrator {
  private apiService = new ProfileApiService();

  async submitProfile(formData: ProfileData): Promise<ApiResponse<{ id: string }>> {
    console.log('Starting profile submission orchestration...');
    
    try {
      // Step 1: Validate the profile data
      console.log('Step 1: Validating profile data...');
      const validationResult = await this.apiService.validateProfile(formData);
      
      if (!validationResult.success) {
        console.log('Validation failed:', validationResult.errors);
        return validationResult as ApiResponse<{ id: string }>;
      }

      // Step 2: Save the validated profile
      console.log('Step 2: Saving validated profile...');
      const saveResult = await this.apiService.saveProfile(validationResult.data!);
      
      if (!saveResult.success) {
        console.log('Save failed:', saveResult.errors);
        return saveResult;
      }

      console.log('Profile submission completed successfully');
      return saveResult;
      
    } catch (error) {
      console.error('Orchestration error:', error);
      return {
        success: false,
        errors: ['An unexpected error occurred during profile submission'],
        message: 'Submission failed'
      };
    }
  }
}

export const profileOrchestrator = new ProfileOrchestrator();
