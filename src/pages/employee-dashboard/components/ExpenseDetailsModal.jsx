import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
const ExpenseDetailsModal = ({ expense, isOpen, onClose }) => {
  if (!isOpen || !expense) return null;

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'rejected':
        return 'text-error bg-error/10';
      case 'processing':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={expense?.categoryIcon} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{expense?.description}</h2>
              <p className="text-sm text-muted-foreground">Expense ID: {expense?.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(expense?.amount, expense?.currency)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <div className="text-foreground">{expense?.category}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <div className="text-foreground">{formatDate(expense?.date)}</div>
              </div>
              {expense?.merchant && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Merchant</label>
                  <div className="text-foreground">{expense?.merchant}</div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(expense?.status)}`}>
                  <Icon name="Circle" size={8} />
                  <span>{expense?.status}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                <div className="text-foreground">{formatDate(expense?.submittedDate)}</div>
              </div>
              {expense?.approvedDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {expense?.status === 'Approved' ? 'Approved' : 'Last Updated'}
                  </label>
                  <div className="text-foreground">{formatDate(expense?.approvedDate)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Receipt */}
          {expense?.receiptUrl && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">Receipt</label>
              <div className="border border-border rounded-lg overflow-hidden">
                <Image
                  src={expense?.receiptUrl}
                  alt="Expense receipt"
                  className="w-full h-64 object-contain bg-muted"
                />
              </div>
            </div>
          )}

          {/* Approval Chain */}
          {expense?.approvalChain && expense?.approvalChain?.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">Approval Chain</label>
              <div className="space-y-3">
                {expense?.approvalChain?.map((approver, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        approver?.status === 'approved' ?'bg-success text-success-foreground' 
                          : approver?.status === 'rejected' ?'bg-error text-error-foreground'
                          : approver?.status === 'pending' ?'bg-warning text-warning-foreground' :'bg-muted-foreground text-muted'
                      }`}>
                        {approver?.status === 'approved' ? (
                          <Icon name="Check" size={16} />
                        ) : approver?.status === 'rejected' ? (
                          <Icon name="X" size={16} />
                        ) : (
                          <span>{approver?.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{approver?.name}</div>
                        <div className="text-sm text-muted-foreground">{approver?.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium capitalize ${
                        approver?.status === 'approved' ? 'text-success' :
                        approver?.status === 'rejected' ? 'text-error' :
                        approver?.status === 'pending'? 'text-warning' : 'text-muted-foreground'
                      }`}>
                        {approver?.status}
                      </div>
                      {approver?.date && (
                        <div className="text-xs text-muted-foreground">
                          {formatDate(approver?.date)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {expense?.comments && expense?.comments?.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">Comments</label>
              <div className="space-y-3">
                {expense?.comments?.map((comment, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-md">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-secondary-foreground">
                          {comment?.author?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-foreground">{comment?.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment?.date)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment?.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {expense?.status?.toLowerCase() === 'pending' && (
            <Button variant="destructive" iconName="X" iconPosition="left">
              Cancel Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailsModal;