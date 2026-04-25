import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Login',
      description: 'Multi-factor authentication available'
    },
    {
      icon: 'Database',
      title: 'Data Protection',
      description: 'GDPR compliant data handling'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-foreground mb-2">
          Trusted by 1000+ Companies
        </h3>
        <p className="text-xs text-muted-foreground">
          Enterprise-grade security for your expense data
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-accent/10 rounded-full mb-2">
              <Icon name={feature?.icon} size={16} className="text-accent" />
            </div>
            <h4 className="text-xs font-medium text-foreground mb-1">
              {feature?.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} className="text-success" />
          <span className="text-xs text-muted-foreground">SOC 2 Certified</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span className="text-xs text-muted-foreground">ISO 27001</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;