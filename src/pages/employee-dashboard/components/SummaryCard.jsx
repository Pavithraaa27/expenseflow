import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const getColorClasses = (colorName) => {
    const colors = {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-error/10 text-error',
      secondary: 'bg-secondary/10 text-secondary'
    };
    return colors?.[colorName] || colors?.primary;
  };

  const getTrendColor = (trendType) => {
    switch (trendType) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trendType) => {
    switch (trendType) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
              <Icon name={icon} size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              <div className="text-2xl font-bold text-foreground mt-1">{value}</div>
            </div>
          </div>
          
          {subtitle && (
            <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
          )}
          
          {trend && trendValue && (
            <div className="flex items-center space-x-1">
              <Icon name={getTrendIcon(trend)} size={14} className={getTrendColor(trend)} />
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {trendValue}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;