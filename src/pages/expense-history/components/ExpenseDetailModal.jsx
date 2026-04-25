import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const ExpenseDetailModal = ({ expense, isOpen, onClose }) => {
  if (!isOpen || !expense) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <Icon name="CheckCircle" size={20} className="text-success" />;
      case 'rejected':
        return <Icon name="XCircle" size={20} className="text-error" />;
      case 'reimbursed':
        return <Icon name="DollarSign" size={20} className="text-accent" />;
      default:
        return <Icon name="Clock" size={20} className="text-warning" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-success/10 text-success`;
      case 'rejected':
        return `${baseClasses} bg-error/10 text-error`;
      case 'reimbursed':
        return `${baseClasses} bg-accent/10 text-accent`;
      default:
        return `${baseClasses} bg-warning/10 text-warning`;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            {getStatusIcon(expense?.status)}
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Expense Details
              </h2>
              <p className="text-sm text-muted-foreground">
                Submitted on {formatDate(expense?.submissionDate)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(expense?.amount, expense?.currency)}
                  </div>
                  {expense?.originalCurrency !== expense?.currency && (
                    <div className="text-sm text-muted-foreground">
                      Original: {formatCurrency(expense?.originalAmount, expense?.originalCurrency)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <span className={getStatusBadge(expense?.status)}>
                      {expense?.status?.charAt(0)?.toUpperCase() + expense?.status?.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="text-sm text-foreground mt-1">{expense?.category}</div>
                </div>

                {expense?.vendor && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                    <div className="text-sm text-foreground mt-1">{expense?.vendor}</div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <div className="text-sm text-foreground mt-1 p-3 bg-muted/30 rounded-md">
                    {expense?.description}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expense Date</label>
                  <div className="text-sm text-foreground mt-1">
                    {formatDate(expense?.expenseDate)}
                  </div>
                </div>

                {expense?.reimbursementDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reimbursement Date</label>
                    <div className="text-sm text-foreground mt-1">
                      {formatDate(expense?.reimbursementDate)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt */}
            {expense?.receipt && (
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">Receipt</label>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-center h-64 bg-background rounded-md overflow-hidden">
                    <Image
                      src={expense?.receipt}
                      alt="Expense receipt"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Download Receipt
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Approval Chain */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">Approval Chain</label>
              <div className="space-y-3">
                {expense?.approvalChain?.map((approval, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-md">
                    <div className="mt-0.5">
                      {approval?.status === 'approved' && (
                        <Icon name="CheckCircle" size={16} className="text-success" />
                      )}
                      {approval?.status === 'rejected' && (
                        <Icon name="XCircle" size={16} className="text-error" />
                      )}
                      {approval?.status === 'pending' && (
                        <Icon name="Clock" size={16} className="text-warning" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-foreground">
                          {approval?.approver}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {approval?.date && formatDate(approval?.date)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {approval?.role}
                      </div>
                      {approval?.comment && (
                        <div className="text-sm text-muted-foreground mt-1">
                          "{approval?.comment}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Expense ID: {expense?.id}
          </div>
          <div className="flex items-center space-x-2">
            {expense?.status === 'rejected' && (
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
              >
                Resubmit
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailModal;