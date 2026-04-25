import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onReceiptUpload }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'submit-expense',
      label: 'Submit New Expense',
      description: 'Create a new expense report',
      icon: 'Plus',
      variant: 'default',
      action: () => navigate('/submit-expense')
    },
    {
      id: 'upload-receipt',
      label: 'Upload Receipt',
      description: 'Scan receipt with OCR',
      icon: 'Camera',
      variant: 'outline',
      action: onReceiptUpload
    },
    {
      id: 'view-history',
      label: 'View History',
      description: 'See all your expenses',
      icon: 'History',
      variant: 'outline',
      action: () => navigate('/expense-history')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <span className="text-accent font-semibold text-sm">⚡</span>
          </Button>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      </div>
      <div className="space-y-3">
        {quickActions?.map((action) => (
          <div key={action?.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-smooth">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Button variant="ghost" size="icon" className="w-10 h-10">
                  <span className="text-primary">{action?.icon === 'Plus' ? '➕' : action?.icon === 'Camera' ? '📷' : '📋'}</span>
                </Button>
              </div>
              <div>
                <h3 className="font-medium text-foreground">{action?.label}</h3>
                <p className="text-sm text-muted-foreground">{action?.description}</p>
              </div>
            </div>
            <Button
              variant={action?.variant}
              size="sm"
              onClick={action?.action}
              iconName={action?.icon}
            >
              {action?.id === 'submit-expense' ? 'Create' : action?.id === 'upload-receipt' ? 'Scan' : 'View'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;