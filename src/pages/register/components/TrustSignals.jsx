import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Data Protection',
      description: 'GDPR & SOC 2 compliant'
    },
    {
      icon: 'CheckCircle',
      title: 'Trusted Platform',
      description: '10,000+ companies worldwide'
    }
  ];

  const certifications = [
    {
      name: 'SOC 2 Type II',
      icon: 'Award',
      color: 'text-accent'
    },
    {
      name: 'ISO 27001',
      icon: 'Shield',
      color: 'text-primary'
    },
    {
      name: 'GDPR Ready',
      icon: 'CheckCircle',
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Security Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Enterprise Security</h3>
        <div className="space-y-3">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{feature?.title}</h4>
                <p className="text-xs text-muted-foreground">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Compliance Certifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Compliance</h3>
        <div className="grid grid-cols-1 gap-3">
          {certifications?.map((cert, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
              <Icon name={cert?.icon} size={16} className={cert?.color} />
              <span className="text-sm font-medium text-foreground">{cert?.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Statistics */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <span className="text-2xl font-bold text-foreground">10,000+</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Companies trust ExpenseFlow with their expense management
          </p>
        </div>
      </div>
      {/* Support Information */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Headphones" size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">24/7 Support</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Get help anytime with our dedicated support team
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;