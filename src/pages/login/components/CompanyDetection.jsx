import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CompanyDetection = ({ email }) => {
  const [detectedCompany, setDetectedCompany] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Mock company database
  const companyDatabase = {
    'company.com': {
      name: 'Acme Corporation',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center',
      domain: 'company.com',
      currency: 'USD',
      country: 'United States'
    },
    'techcorp.com': {
      name: 'TechCorp Solutions',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=64&h=64&fit=crop&crop=center',
      domain: 'techcorp.com',
      currency: 'EUR',
      country: 'Germany'
    },
    'startup.io': {
      name: 'Startup Innovations',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=64&h=64&fit=crop&crop=center',
      domain: 'startup.io',
      currency: 'GBP',
      country: 'United Kingdom'
    }
  };

  useEffect(() => {
    if (email && email?.includes('@')) {
      const domain = email?.split('@')?.[1];
      
      if (domain && companyDatabase?.[domain]) {
        setIsDetecting(true);
        
        // Simulate API call to detect company
        setTimeout(() => {
          setDetectedCompany(companyDatabase?.[domain]);
          setIsDetecting(false);
        }, 800);
      } else {
        setDetectedCompany(null);
        setIsDetecting(false);
      }
    } else {
      setDetectedCompany(null);
      setIsDetecting(false);
    }
  }, [email]);

  if (!email || !email?.includes('@')) {
    return null;
  }

  if (isDetecting) {
    return (
      <div className="mt-4 p-3 bg-muted/50 border border-border rounded-md">
        <div className="flex items-center space-x-2">
          <div className="animate-spin">
            <Icon name="Loader2" size={16} className="text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">
            Detecting company...
          </span>
        </div>
      </div>
    );
  }

  if (detectedCompany) {
    return (
      <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-md">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center flex-shrink-0">
            <Icon name="Building2" size={20} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <h4 className="text-sm font-medium text-foreground">
                Company Detected
              </h4>
            </div>
            <p className="text-sm text-foreground font-medium mb-1">
              {detectedCompany?.name}
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="Globe" size={12} />
                <span>{detectedCompany?.domain}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span>{detectedCompany?.country}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="DollarSign" size={12} />
                <span>{detectedCompany?.currency}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CompanyDetection;