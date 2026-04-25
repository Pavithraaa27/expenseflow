import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const AuthLinks = () => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:text-primary/80 transition-hover inline-flex items-center space-x-1"
        >
          <Icon name="Key" size={14} />
          <span>Forgot your password?</span>
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            New to ExpenseFlow?
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/register"
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary bg-primary/5 border border-primary/20 rounded-md hover:bg-primary/10 transition-hover space-x-2"
        >
          <Icon name="UserPlus" size={16} />
          <span>Create Company Account</span>
        </Link>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:text-primary/80 transition-hover">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:text-primary/80 transition-hover">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLinks;