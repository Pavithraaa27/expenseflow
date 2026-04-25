import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { formatCurrency, formatDate, getStatusColor, getCategoryIcon } from '../../../utils';

const ExpenseCard = ({ expense, onApprove, onReject, onViewDetails, isProcessing }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const handleReject = () => {
    if (rejectComment?.trim()) {
      onReject(expense?.id, rejectComment);
      setShowRejectModal(false);
      setRejectComment('');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      default: return 'text-success bg-success/10';
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
        {/* Main Card Content */}
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Employee & Expense Info */}
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={20} color="white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {expense?.employeeName}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(expense?.urgency)}`}>
                    {expense?.urgency} priority
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center space-x-1">
                    <Icon name={getCategoryIcon(expense?.category)} size={16} />
                    <span>{expense?.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={16} />
                    <span>{formatDate(expense?.submissionDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={16} />
                    <span>{expense?.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(expense?.amount, expense?.currency)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                    iconPosition="right"
                  >
                    {isExpanded ? 'Less' : 'Details'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => onApprove(expense?.id)}
                disabled={isProcessing}
                iconName="Check"
                iconPosition="left"
                className="flex-1 lg:flex-none lg:w-24"
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                iconName="X"
                iconPosition="left"
                className="flex-1 lg:flex-none lg:w-24"
              >
                Reject
              </Button>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Expense Details</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-sm text-foreground mt-1">{expense?.description}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Business Purpose</label>
                      <p className="text-sm text-foreground mt-1">{expense?.businessPurpose}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expense Date</label>
                        <p className="text-sm text-foreground mt-1">{formatDate(expense?.expenseDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                        <p className="text-sm text-foreground mt-1">{expense?.vendor}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Receipt & Approval Chain */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Receipt & Approval</h4>
                  
                  {expense?.receiptUrl && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Receipt</label>
                      <div className="relative">
                        <Image
                          src={expense?.receiptUrl}
                          alt="Expense receipt"
                          className="w-full h-32 object-cover rounded-md border border-border cursor-pointer hover:opacity-80 transition-smooth"
                          onClick={() => onViewDetails(expense)}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-smooth rounded-md">
                          <Icon name="ZoomIn" size={24} color="white" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Approval Chain</label>
                    <div className="mt-2 space-y-2">
                      {expense?.approvalChain?.map((approval, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(approval?.status)}`} />
                          <span className="text-foreground">{approval?.approverName}</span>
                          <span className="text-muted-foreground">({approval?.role})</span>
                          {approval?.status === 'pending' && (
                            <span className="text-warning font-medium">Pending</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Reject Expense</h3>
                  <p className="text-sm text-muted-foreground">
                    {expense?.employeeName} - {formatCurrency(expense?.amount, expense?.currency)}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason for rejection *
                </label>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e?.target?.value)}
                  placeholder="Please provide a reason for rejecting this expense..."
                  className="w-full h-24 px-3 py-2 border border-border rounded-md text-sm text-foreground bg-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectComment('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectComment?.trim() || isProcessing}
                  className="flex-1"
                >
                  Reject Expense
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpenseCard;