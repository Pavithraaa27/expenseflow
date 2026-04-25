import React from 'react';
import { Helmet } from 'react-helmet';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Create Account - ExpenseFlow</title>
        <meta name="description" content="Join ExpenseFlow and streamline your expense management with automated approvals, OCR receipt scanning, and multi-currency support." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column - Header and Trust Signals */}
              <div className="lg:col-span-1 space-y-8">
                <div className="lg:sticky lg:top-8">
                  <RegistrationHeader />
                  <div className="mt-8 hidden lg:block">
                    <TrustSignals />
                  </div>
                </div>
              </div>

              {/* Right Column - Registration Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl shadow-elevation-2 border border-border p-6 lg:p-8">
                  <RegistrationForm />
                </div>

                {/* Mobile Trust Signals */}
                <div className="mt-8 lg:hidden">
                  <div className="bg-card rounded-xl shadow-elevation-1 border border-border p-6">
                    <TrustSignals />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} ExpenseFlow. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <a href="/terms" className="text-muted-foreground hover:text-foreground transition-hover">
                  Terms of Service
                </a>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-hover">
                  Privacy Policy
                </a>
                <a href="/support" className="text-muted-foreground hover:text-foreground transition-hover">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Register;