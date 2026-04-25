import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <Link to="/" className="inline-flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-elevation-2">
          <Icon name="Receipt" size={24} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">ExpenseFlow</h1>
          <p className="text-sm text-muted-foreground">Expense Management Platform</p>
        </div>
      </Link>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Join thousands of companies streamlining their expense management with automated workflows and intelligent approvals.
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="flex flex-col items-center space-y-2 p-4 bg-card rounded-lg border border-border">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Automated Approvals</h3>
          <p className="text-xs text-muted-foreground text-center">
            Smart routing based on amount and approval rules
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-4 bg-card rounded-lg border border-border">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Scan" size={20} className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">OCR Receipt Scanning</h3>
          <p className="text-xs text-muted-foreground text-center">
            Auto-extract data from receipts and invoices
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-4 bg-card rounded-lg border border-border">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Globe" size={20} className="text-success" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Multi-Currency</h3>
          <p className="text-xs text-muted-foreground text-center">
            Automatic conversion with real-time rates
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;