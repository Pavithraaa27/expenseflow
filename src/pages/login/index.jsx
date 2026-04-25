import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import AuthLinks from './components/AuthLinks';
import CompanyDetection from './components/CompanyDetection';

const LoginPage = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [emailForDetection, setEmailForDetection] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/employee-dashboard');
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Listen for email changes from LoginForm
  useEffect(() => {
    const handleEmailChange = (event) => {
      if (event?.detail && event?.detail?.email) {
        setEmailForDetection(event?.detail?.email);
      }
    };

    window.addEventListener('emailDetection', handleEmailChange);
    return () => window.removeEventListener('emailDetection', handleEmailChange);
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Sign In - ExpenseFlow</title>
        <meta name="description" content="Sign in to your ExpenseFlow account to manage expenses, approvals, and company reimbursements securely." />
        <meta name="keywords" content="expense management, login, business expenses, reimbursement" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
        {/* Header */}
        <header className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Receipt" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                ExpenseFlow
              </span>
            </Link>
            
            <div className="hidden sm:flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(currentTime)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Icon name="LogIn" size={32} className="text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to your ExpenseFlow account to manage your business expenses
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-6">
              <LoginForm />
              
              <CompanyDetection email={emailForDetection} />
              
              <div className="mt-6">
                <AuthLinks />
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-6">
              <TrustSignals />
            </div>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-md">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    Demo Credentials
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Admin:</strong> admin@company.com / admin123</p>
                    <p><strong>Manager:</strong> manager@company.com / manager123</p>
                    <p><strong>Employee:</strong> employee@company.com / employee123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full p-4 border-t border-border bg-card/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <Link to="/help" className="hover:text-foreground transition-hover">
                  Help Center
                </Link>
                <Link to="/contact" className="hover:text-foreground transition-hover">
                  Contact Support
                </Link>
                <Link to="/status" className="hover:text-foreground transition-hover">
                  System Status
                </Link>
              </div>
              
              <div className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} ExpenseFlow. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LoginPage;