import React from 'react';
import Icon from '../AppIcon';

const LoadingSpinner = ({ 
  size = 24, 
  text = 'Loading...', 
  className = '',
  variant = 'default' // 'default', 'overlay', 'inline'
}) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="animate-spin">
        <Icon name="Loader2" size={size} className="text-primary" />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (variant === 'overlay') {
    return (
      <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
        {spinnerContent}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin">
          <Icon name="Loader2" size={size} className="text-primary" />
        </div>
        {text && (
          <span className="text-sm text-muted-foreground">
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      {spinnerContent}
    </div>
  );
};

// Specialized loading components for common use cases
export const OCRProcessingLoader = ({ className = '' }) => (
  <LoadingSpinner
    size={32}
    text="Processing receipt..."
    className={className}
    variant="default"
  />
);

export const ApprovalLoader = ({ className = '' }) => (
  <LoadingSpinner
    size={20}
    text="Updating approval status..."
    className={className}
    variant="inline"
  />
);

export const CurrencyConversionLoader = ({ className = '' }) => (
  <LoadingSpinner
    size={16}
    text="Converting currency..."
    className={className}
    variant="inline"
  />
);

export const PageLoader = ({ className = '' }) => (
  <LoadingSpinner
    size={40}
    text="Loading page..."
    className={className}
    variant="overlay"
  />
);

export default LoadingSpinner;