import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SubmissionSuccess = ({ 
  submittedExpense, 
  onSubmitAnother, 
  onViewHistory 
}) => {
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'auto_approved':
        return 'text-success bg-success/10 border-success/20';
      case 'pending_manager':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'pending_finance':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'auto_approved':
        return 'Auto-Approved';
      case 'pending_manager':
        return 'Pending Manager Approval';
      case 'pending_finance':
        return 'Pending Finance Approval';
      default:
        return 'Submitted';
    }
  };

  const getNextSteps = (status) => {
    switch (status) {
      case 'auto_approved':
        return [
          'Your expense has been automatically approved',
          'Reimbursement will be processed in the next payroll cycle',
          'You will receive an email confirmation shortly'
        ];
      case 'pending_manager':
        return [
          'Your manager has been notified for approval',
          'You will receive an email once approved or if additional information is needed',
          'Typical approval time: 1-2 business days'
        ];
      case 'pending_finance':
        return [
          'Your expense is in the finance approval queue',
          'This may take 3-5 business days for review',
          'You will be notified of any status changes'
        ];
      default:
        return [
          'Your expense has been submitted successfully',
          'You will receive updates via email',
          'Check your expense history for status updates'
        ];
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={40} className="text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Expense Submitted Successfully!
        </h1>
        <p className="text-muted-foreground">
          Your expense has been submitted and is now in the approval workflow.
        </p>
      </div>
      {/* Expense Summary Card */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Expense Summary</h2>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submittedExpense?.status)}`}>
            {getStatusText(submittedExpense?.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Expense ID</p>
            <p className="font-mono text-sm font-medium text-foreground">
              {submittedExpense?.id}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Amount</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(submittedExpense?.amount, submittedExpense?.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Category</p>
            <p className="text-sm font-medium text-foreground">
              {submittedExpense?.categoryLabel}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
            <p className="text-sm font-medium text-foreground">
              {submittedExpense?.submittedAt?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {submittedExpense?.description && (
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground">
              {submittedExpense?.description}
            </p>
          </div>
        )}
      </div>
      {/* Next Steps */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Clock" size={20} className="mr-2 text-primary" />
          What Happens Next?
        </h3>
        
        <div className="space-y-3">
          {getNextSteps(submittedExpense?.status)?.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">{index + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button
          variant="default"
          onClick={onSubmitAnother}
          iconName="Plus"
          iconPosition="left"
          className="flex-1"
        >
          Submit Another Expense
        </Button>
        
        <Button
          variant="outline"
          onClick={onViewHistory}
          iconName="History"
          iconPosition="left"
          className="flex-1"
        >
          View Expense History
        </Button>
      </div>
      {/* Quick Links */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Links</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            to="/employee-dashboard"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-hover p-2 rounded-md hover:bg-muted/50"
          >
            <Icon name="LayoutDashboard" size={16} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/expense-history"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-hover p-2 rounded-md hover:bg-muted/50"
          >
            <Icon name="FileText" size={16} />
            <span>All Expenses</span>
          </Link>
        </div>
      </div>
      {/* Support Information */}
      <div className="text-center mt-8 p-4 bg-muted/20 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          Need help or have questions about your expense?
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            iconName="Mail"
            iconPosition="left"
          >
            Contact Finance Team
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="HelpCircle"
            iconPosition="left"
          >
            View Help Center
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;