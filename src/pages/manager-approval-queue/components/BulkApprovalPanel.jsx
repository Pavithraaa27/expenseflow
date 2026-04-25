import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { formatCurrency } from '../../../utils';

const BulkApprovalPanel = ({ 
  selectedExpenses, 
  expenses, 
  onSelectAll, 
  onSelectExpense, 
  onBulkApprove, 
  onBulkReject,
  isProcessing 
}) => {
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [bulkRejectComment, setBulkRejectComment] = useState('');

  const selectedExpenseData = expenses?.filter(expense => 
    selectedExpenses?.includes(expense?.id)
  );

  const totalAmount = selectedExpenseData?.reduce((sum, expense) => 
    sum + expense?.amount, 0
  );

  const allSelected = expenses?.length > 0 && selectedExpenses?.length === expenses?.length;
  const someSelected = selectedExpenses?.length > 0 && selectedExpenses?.length < expenses?.length;

  const handleBulkReject = () => {
    if (bulkRejectComment?.trim()) {
      onBulkReject(selectedExpenses, bulkRejectComment);
      setShowBulkRejectModal(false);
      setBulkRejectComment('');
    }
  };

  if (expenses?.length === 0) return null;

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-4 lg:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Selection Controls */}
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => onSelectAll(e?.target?.checked)}
              label="Select all expenses"
            />
            
            {selectedExpenses?.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="CheckSquare" size={16} />
                <span>
                  {selectedExpenses?.length} of {expenses?.length} selected
                </span>
                {selectedExpenseData?.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-foreground">
                      Total: {formatCurrency(totalAmount, selectedExpenseData?.[0]?.currency || 'USD')}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedExpenses?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => onBulkApprove(selectedExpenses)}
                disabled={isProcessing}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Approve Selected ({selectedExpenses?.length})
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkRejectModal(true)}
                disabled={isProcessing}
                iconName="XCircle"
                iconPosition="left"
              >
                Reject Selected ({selectedExpenses?.length})
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {selectedExpenses?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Selected:</span>
                <span className="ml-2 font-medium text-foreground">{selectedExpenses?.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="ml-2 font-medium text-foreground">
                  {formatCurrency(totalAmount, selectedExpenseData?.[0]?.currency || 'USD')}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg Amount:</span>
                <span className="ml-2 font-medium text-foreground">
                  {formatCurrency(totalAmount / selectedExpenses?.length, selectedExpenseData?.[0]?.currency || 'USD')}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Employees:</span>
                <span className="ml-2 font-medium text-foreground">
                  {new Set(selectedExpenseData.map(e => e.employeeName))?.size}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Bulk Reject Modal */}
      {showBulkRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Reject Multiple Expenses</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedExpenses?.length} expenses selected - {formatCurrency(totalAmount, selectedExpenseData?.[0]?.currency || 'USD')}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="bg-muted rounded-md p-3 max-h-32 overflow-y-auto">
                  <div className="text-sm space-y-1">
                    {selectedExpenseData?.slice(0, 5)?.map((expense) => (
                      <div key={expense?.id} className="flex justify-between">
                        <span className="text-foreground">{expense?.employeeName}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(expense?.amount, expense?.currency)}
                        </span>
                      </div>
                    ))}
                    {selectedExpenseData?.length > 5 && (
                      <div className="text-muted-foreground text-center pt-1">
                        +{selectedExpenseData?.length - 5} more expenses
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason for rejection *
                </label>
                <textarea
                  value={bulkRejectComment}
                  onChange={(e) => setBulkRejectComment(e?.target?.value)}
                  placeholder="Please provide a reason for rejecting these expenses..."
                  className="w-full h-24 px-3 py-2 border border-border rounded-md text-sm text-foreground bg-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBulkRejectModal(false);
                    setBulkRejectComment('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkReject}
                  disabled={!bulkRejectComment?.trim() || isProcessing}
                  className="flex-1"
                >
                  Reject All Selected
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkApprovalPanel;