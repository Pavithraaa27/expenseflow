import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumbs = () => {
  const location = useLocation();
  
  const routeMap = {
    '/employee-dashboard': 'Dashboard',
    '/submit-expense': 'Submit Expense',
    '/expense-history': 'Expense History',
    '/manager-approval-queue': 'Approvals',
    '/login': 'Login',
    '/register': 'Register'
  };

  const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
  
  // Don't show breadcrumbs on auth pages
  if (['/login', '/register']?.includes(location?.pathname)) {
    return null;
  }

  // For single-level routes, show simple breadcrumb
  const currentPageTitle = routeMap?.[location?.pathname];
  
  if (!currentPageTitle) {
    return null;
  }

  // If we're on dashboard, don't show breadcrumbs
  if (location?.pathname === '/employee-dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Link 
        to="/employee-dashboard" 
        className="hover:text-foreground transition-hover flex items-center space-x-1"
      >
        <Icon name="Home" size={16} />
        <span>Dashboard</span>
      </Link>
      
      <Icon name="ChevronRight" size={16} className="text-border" />
      
      <span className="text-foreground font-medium" aria-current="page">
        {currentPageTitle}
      </span>
    </nav>
  );
};

export default Breadcrumbs;