import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../supabaseClient'; 
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    companyName: '',
    country: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Mock countries data with currency mapping
  const countries = [
    { value: 'US', label: 'United States', currency: 'USD' },
    { value: 'IN', label: 'INDIA', currency: 'INR' },
    { value: 'CA', label: 'Canada', currency: 'CAD' },
    { value: 'AU', label: 'Australia', currency: 'AUD' },
    { value: 'DE', label: 'Germany', currency: 'EUR' },
    { value: 'FR', label: 'France', currency: 'EUR' },
    { value: 'IN', label: 'India', currency: 'INR' },
    { value: 'JP', label: 'Japan', currency: 'JPY' },
    { value: 'SG', label: 'Singapore', currency: 'SGD' },
    { value: 'NL', label: 'Netherlands', currency: 'EUR' }
  ];

  const roles = [
    { 
      value: 'admin', 
      label: 'Company Administrator',
      description: 'Full system control, user management, and expense oversight'
    },
    { 
      value: 'manager', 
      label: 'Manager',
      description: 'Team expense approval and budget management'
    },
    { 
      value: 'employee', 
      label: 'Employee',
      description: 'Submit expenses and track reimbursements'
    }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[a-z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password) && /[^A-Za-z0-9]/?.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Calculate password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    if (formData?.role === 'admin' && !formData?.companyName?.trim()) {
      newErrors.companyName = 'Company name is required for administrators';
    }

    if (!formData?.country) {
      newErrors.country = 'Please select your country';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms of service';
    }

    if (!formData?.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
  e?.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setIsLoading(true);

  try {
    // 1️⃣ Register user with Supabase
    const { data: user, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });

    if (signupError) {
      setErrors({ submit: signupError.message });
      setIsLoading(false);
      return;
    }

    console.log("Signup successful:", user);

    // 2️⃣ Insert user into manager approval queue
    const { data: queueData, error: queueError } = await supabase
      .from('manager_approval_queue')
      .insert([{ user_id: user.user.id, status: 'pending' }]);

    if (queueError) {
      console.error("Error inserting into manager queue:", queueError.message);
      setErrors({ submit: 'Failed to add to manager queue. Contact admin.' });
      setIsLoading(false);
      return;
    }

    console.log("User added to manager queue:", queueData);

    // 3️⃣ Navigate based on role
    if (formData.role === 'admin') {
      navigate('/employee-dashboard');
    } else if (formData.role === 'manager') {
      navigate('/manager-approval-queue');
    } else {
      navigate('/employee-dashboard');
    }
  } catch (error) {
    console.error(error);
    setErrors({ submit: 'Registration failed. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};


  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-error';
    if (passwordStrength < 50) return 'bg-warning';
    if (passwordStrength < 75) return 'bg-accent';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            value={formData?.firstName}
            onChange={(e) => handleInputChange('firstName', e?.target?.value)}
            error={errors?.firstName}
            required
          />
          
          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            value={formData?.lastName}
            onChange={(e) => handleInputChange('lastName', e?.target?.value)}
            error={errors?.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your business email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          description="We'll use this for account verification and notifications"
          required
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          
          {formData?.password && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password strength:</span>
                <span className={`font-medium ${
                  passwordStrength < 50 ? 'text-error' : 
                  passwordStrength < 75 ? 'text-warning' : 'text-success'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
      </div>
      {/* Role Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Role & Company</h3>
        
        <Select
          label="Select Your Role"
          placeholder="Choose your role in the organization"
          options={roles?.map(role => ({
            value: role?.value,
            label: role?.label,
            description: role?.description
          }))}
          value={formData?.role}
          onChange={(value) => handleInputChange('role', value)}
          error={errors?.role}
          required
        />

        {formData?.role === 'admin' && (
          <Input
            label="Company Name"
            type="text"
            placeholder="Enter your company name"
            value={formData?.companyName}
            onChange={(e) => handleInputChange('companyName', e?.target?.value)}
            error={errors?.companyName}
            description="This will be used to create your company account"
            required
          />
        )}

        <Select
          label="Country"
          placeholder="Select your country"
          options={countries}
          value={formData?.country}
          onChange={(value) => handleInputChange('country', value)}
          error={errors?.country}
          description="This will set your company's default currency and locale"
          searchable
          required
        />

        {formData?.country && (
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span className="text-sm text-accent font-medium">
                Default currency will be set to {countries?.find(c => c?.value === formData?.country)?.currency}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Terms and Privacy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Legal Agreement</h3>
        
        <div className="space-y-3">
          <Checkbox
            label={
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              </span>
            }
            checked={formData?.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
            error={errors?.agreeToTerms}
            required
          />
          
          <Checkbox
            label={
              <span>
                I agree to the{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            }
            checked={formData?.agreeToPrivacy}
            onChange={(e) => handleInputChange('agreeToPrivacy', e?.target?.checked)}
            error={errors?.agreeToPrivacy}
            required
          />
        </div>
      </div>
      {/* Submit Button */}
      <div className="space-y-4">
        {errors?.submit && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error">{errors?.submit}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;