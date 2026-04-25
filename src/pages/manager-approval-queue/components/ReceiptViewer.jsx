import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { formatCurrency, formatDate } from '../../../utils';

const ReceiptViewer = ({ expense, isOpen, onClose, onApprove, onReject }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const handleReject = () => {
    if (rejectComment?.trim()) {
      onReject(expense?.id, rejectComment);
      setShowRejectModal(false);
      setRejectComment('');
      onClose();
    }
  };

  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="Receipt" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Receipt Details</h2>
              <p className="text-sm text-muted-foreground">
                {expense?.employeeName} • {formatCurrency(expense?.amount, expense?.currency)}
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

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Receipt Image */}
          <div className="flex-1 p-4 lg:p-6 bg-muted/30">
            <div className="relative h-full min-h-[300px] lg:min-h-[500px]">
              {expense?.receiptUrl ? (
                <div className="relative h-full">
                  <Image
                    src={expense?.receiptUrl}
                    alt="Expense receipt"
                    className={`w-full h-full object-contain rounded-md border border-border cursor-pointer transition-transform ${
                      isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setIsZoomed(!isZoomed)}
                    >
                      <Icon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={16} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => window.open(expense?.receiptUrl, '_blank')}
                    >
                      <Icon name="ExternalLink" size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted rounded-md">
                  <div className="text-center">
                    <Icon name="ImageOff" size={48} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No receipt image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expense Details */}
          <div className="w-full lg:w-96 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
            <div className="space-y-6">
              {/* OCR Extracted Data */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Scan" size={16} />
                  <span>OCR Extracted Data</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(expense?.amount, expense?.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendor:</span>
                    <span className="text-foreground">{expense?.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="text-foreground">{formatDate(expense?.expenseDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="text-foreground">{expense?.category}</span>
                  </div>
                </div>
              </div>

              {/* Employee Information */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Employee Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <p className="text-foreground mt-1">{expense?.description}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Business Purpose:</span>
                    <p className="text-foreground mt-1">{expense?.businessPurpose}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{expense?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span className="text-foreground">{formatDate(expense?.submissionDate)}</span>
                  </div>
                </div>
              </div>

              {/* Approval Chain */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Approval Chain</h3>
                <div className="space-y-2">
                  {expense?.approvalChain?.map((approval, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-md bg-muted/50">
                      <div className={`w-2 h-2 rounded-full ${
                        approval?.status === 'approved' ? 'bg-success' :
                        approval?.status === 'rejected' ? 'bg-error' :
                        approval?.status === 'pending' ? 'bg-warning' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{approval?.approverName}</div>
                        <div className="text-xs text-muted-foreground">{approval?.role}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {approval?.status === 'pending' ? 'Pending' : 
                         approval?.status === 'approved' ? 'Approved' : 'Rejected'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-border">
                <Button
                  variant="success"
                  onClick={() => {
                    onApprove(expense?.id);
                    onClose();
                  }}
                  iconName="Check"
                  iconPosition="left"
                  className="flex-1"
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectModal(true)}
                  iconName="X"
                  iconPosition="left"
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
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
                  disabled={!rejectComment?.trim()}
                  className="flex-1"
                >
                  Reject Expense
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptViewer;