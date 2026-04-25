import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ExpenseCard = ({ expense, onViewDetails }) => {
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'rejected':
        return 'XCircle';
      case 'processing':
        return 'Loader2';
      default:
        return 'Circle';
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={expense?.categoryIcon} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{expense?.description}</h3>
              <p className="text-sm text-muted-foreground">{expense?.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(expense?.date)}</span>
            </span>
            {expense?.merchant && (
              <span className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{expense?.merchant}</span>
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-foreground mb-1">
            {formatCurrency(expense?.amount, expense?.currency)}
          </div>
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense?.status)}`}>
            <Icon name={getStatusIcon(expense?.status)} size={12} />
            <span>{expense?.status}</span>
          </div>
        </div>
      </div>
      {/* Receipt Preview */}
      {expense?.receiptUrl && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Paperclip" size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Receipt attached</span>
          </div>
          <div className="w-16 h-16 rounded-md overflow-hidden border border-border">
            <Image
              src={expense?.receiptUrl}
              alt="Receipt preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      {/* Approval Progress */}
      {expense?.approvalChain && expense?.approvalChain?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Approval Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            {expense?.approvalChain?.map((approver, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  approver?.status === 'approved' ?'bg-success text-success-foreground' 
                    : approver?.status === 'rejected' ?'bg-error text-error-foreground'
                    : approver?.status === 'pending' ?'bg-warning text-warning-foreground' :'bg-muted text-muted-foreground'
                }`}>
                  {approver?.status === 'approved' ? (
                    <Icon name="Check" size={12} />
                  ) : approver?.status === 'rejected' ? (
                    <Icon name="X" size={12} />
                  ) : (
                    <span>{approver?.name?.charAt(0)}</span>
                  )}
                </div>
                {index < expense?.approvalChain?.length - 1 && (
                  <Icon name="ChevronRight" size={12} className="text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Comments */}
      {expense?.comments && expense?.comments?.length > 0 && (
        <div className="mb-4">
          <div className="bg-muted/50 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <Icon name="MessageSquare" size={14} className="text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{expense?.comments?.[expense?.comments?.length - 1]?.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {expense?.comments?.[expense?.comments?.length - 1]?.author} • {formatDate(expense?.comments?.[expense?.comments?.length - 1]?.date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          ID: {expense?.id}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(expense)}
          iconName="Eye"
          iconPosition="left"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ExpenseCard;