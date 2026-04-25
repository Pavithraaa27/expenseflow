import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils';

const ApprovalRulesPanel = ({ rules, onUpdateRules }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-4 lg:p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Approval Rules</h3>
            <p className="text-sm text-muted-foreground">
              Current approval configuration and thresholds
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Hide' : 'Show'} Rules
        </Button>
      </div>
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Amount-based Rules */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="DollarSign" size={16} />
                <span>Amount-based Rules</span>
              </h4>
              
              <div className="space-y-3">
                {rules?.amountRules?.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {rule?.minAmount ? formatCurrency(rule?.minAmount, rules?.currency) : '0'} - {' '}
                        {rule?.maxAmount ? formatCurrency(rule?.maxAmount, rules?.currency) : '∞'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {rule?.approvers?.join(', ')}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rule?.requiresAll ? 'All required' : `${rule?.threshold}% required`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category-based Rules */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Tag" size={16} />
                <span>Category-based Rules</span>
              </h4>
              
              <div className="space-y-3">
                {rules?.categoryRules?.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <div className="text-sm font-medium text-foreground capitalize">
                        {rule?.category}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {rule?.approvers?.join(', ')}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rule?.autoApprove ? 'Auto-approve' : `${rule?.threshold}% required`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Special Rules */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Star" size={16} />
              <span>Special Rules</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rules?.specialRules?.map((rule, index) => (
                <div key={index} className="p-3 bg-accent/5 border border-accent/20 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={rule?.icon} size={16} className="text-accent" />
                    <span className="text-sm font-medium text-foreground">{rule?.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rule?.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rule?.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {rule?.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              onClick={() => onUpdateRules('edit')}
            >
              Edit Rules
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              iconPosition="left"
              onClick={() => onUpdateRules('duplicate')}
            >
              Duplicate Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onUpdateRules('export')}
            >
              Export Rules
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalRulesPanel;