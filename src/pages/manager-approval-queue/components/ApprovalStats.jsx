import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils';

const ApprovalStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Pending Approvals',
      value: stats?.pendingCount,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: stats?.pendingChange,
      changeType: stats?.pendingChange > 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Total Amount',
      value: formatCurrency(stats?.totalAmount, stats?.currency),
      icon: 'DollarSign',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: stats?.amountChange,
      changeType: stats?.amountChange > 0 ? 'increase' : 'decrease'
    },
    {
      title: 'High Priority',
      value: stats?.highPriorityCount,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: stats?.highPriorityChange,
      changeType: stats?.highPriorityChange > 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Avg Processing Time',
      value: `${stats?.avgProcessingTime}h`,
      icon: 'Timer',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: stats?.processingTimeChange,
      changeType: stats?.processingTimeChange > 0 ? 'increase' : 'decrease'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg shadow-elevation-1 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            {stat?.change !== 0 && (
              <div className={`flex items-center space-x-1 text-xs font-medium ${
                stat?.changeType === 'increase' ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={stat?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                  size={12} 
                />
                <span>{Math.abs(stat?.change)}%</span>
              </div>
            )}
          </div>
          
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat?.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat?.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApprovalStats;