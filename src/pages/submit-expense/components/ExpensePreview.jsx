import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ExpensePreview = ({ 
  formData, 
  uploadedReceipts, 
  exchangeRates, 
  onEdit, 
  onConfirmSubmit,
  isSubmitting 
}) => {
  const calculateConvertedAmount = () => {
    if (!formData?.amount || !formData?.currency) return 0;
    
    if (formData?.currency === 'USD') {
      return parseFloat(formData?.amount);
    }
    
    const rate = exchangeRates?.[formData?.currency] || 1;
    return (parseFloat(formData?.amount) / rate)?.toFixed(2);
  };

  const getApprovalRoute = () => {
    const amount = parseFloat(calculateConvertedAmount());
    
    if (amount < 100) {
      return {
        level: 'Auto-Approved',
        approvers: ['System'],
        description: 'Expenses under $100 are automatically approved',
        icon: 'CheckCircle',
        color: 'text-success'
      };
    } else if (amount < 500) {
      return {
        level: 'Manager Approval',
        approvers: ['Sarah Johnson (Manager)'],
        description: 'Requires manager approval for expenses $100-$500',
        icon: 'User',
        color: 'text-warning'
      };
    } else {
      return {
        level: 'Multi-Level Approval',
        approvers: ['Sarah Johnson (Manager)', 'Michael Chen (Finance Director)'],
        description: 'Requires manager and finance approval for expenses over $500',
        icon: 'Users',
        color: 'text-error'
      };
    }
  };

  const approvalRoute = getApprovalRoute();

  const getCategoryLabel = (value) => {
    const categories = {
      'meals': 'Meals & Entertainment',
      'travel': 'Travel & Transportation',
      'accommodation': 'Accommodation',
      'office_supplies': 'Office Supplies',
      'software': 'Software & Subscriptions',
      'training': 'Training & Education',
      'marketing': 'Marketing & Advertising',
      'equipment': 'Equipment & Hardware',
      'communication': 'Communication',
      'other': 'Other'
    };
    return categories?.[value] || value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!formData?.amount || !formData?.category || !formData?.date || !formData?.description) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Preview Not Available</h3>
          <p className="text-sm text-muted-foreground">
            Complete the expense form to see a preview of your submission
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Expense Preview</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          iconName="Edit"
          iconPosition="left"
        >
          Edit
        </Button>
      </div>
      {/* Expense Summary */}
      <div className="space-y-6">
        {/* Amount Section */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expense Amount</p>
              <p className="text-2xl font-bold text-foreground">
                {formData?.amount} {formData?.currency}
              </p>
              {formData?.currency !== 'USD' && (
                <p className="text-sm text-muted-foreground">
                  ≈ ${calculateConvertedAmount()} USD (Company Currency)
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name="DollarSign" size={24} color="white" />
            </div>
          </div>
        </div>

        {/* Expense Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Category</p>
              <p className="text-sm text-muted-foreground">{getCategoryLabel(formData?.category)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Date</p>
              <p className="text-sm text-muted-foreground">{formatDate(formData?.date)}</p>
            </div>
            
            {formData?.vendor && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Vendor</p>
                <p className="text-sm text-muted-foreground">{formData?.vendor}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-1">Description</p>
            <div className="bg-muted/30 rounded-md p-3 border border-border">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {formData?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Receipts Section */}
        {uploadedReceipts && uploadedReceipts?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Attached Receipts ({uploadedReceipts?.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {uploadedReceipts?.map((receipt) => (
                <div key={receipt?.id} className="flex items-center space-x-2 bg-muted/30 rounded-md px-3 py-2 border border-border">
                  <Icon name="Paperclip" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate max-w-32">
                    {receipt?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approval Route */}
        <div className="border-t border-border pt-6">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              approvalRoute?.level === 'Auto-Approved' ? 'bg-success/10' : 
              approvalRoute?.level === 'Manager Approval' ? 'bg-warning/10' : 'bg-error/10'
            }`}>
              <Icon 
                name={approvalRoute?.icon} 
                size={16} 
                className={approvalRoute?.color} 
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                Approval Route: {approvalRoute?.level}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {approvalRoute?.description}
              </p>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Approvers:</p>
                {approvalRoute?.approvers?.map((approver, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                    <span className="text-xs text-muted-foreground">{approver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submission Actions */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              iconName="ArrowLeft"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              Back to Edit
            </Button>
            
            <Button
              type="button"
              variant="default"
              onClick={onConfirmSubmit}
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
              className="flex-1"
            >
              Confirm & Submit Expense
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">
            By submitting, you confirm that this expense is accurate and complies with company policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpensePreview;