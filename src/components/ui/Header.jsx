import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  // Mock user data - in real app this would come from auth context
  const user = {
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Employee',
    avatar: null
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/employee-dashboard',
      icon: 'LayoutDashboard',
      roles: ['Employee', 'Manager', 'Admin']
    },
    {
      label: 'Submit Expense',
      path: '/submit-expense',
      icon: 'Plus',
      roles: ['Employee', 'Manager', 'Admin']
    },
    {
      label: 'Expense History',
      path: '/expense-history',
      icon: 'History',
      roles: ['Employee', 'Manager', 'Admin']
    },
    {
      label: 'Approvals',
      path: '/manager-approval-queue',
      icon: 'CheckCircle',
      roles: ['Manager', 'Admin']
    }
  ];

  const filteredNavItems = navigationItems?.filter(item => 
    item?.roles?.includes(user?.role)
  );

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // In real app, this would call logout function from auth context
    console.log('Logging out...');
    setIsProfileOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/employee-dashboard" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Icon name="Receipt" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground hidden sm:block">
            ExpenseFlow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {filteredNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth min-h-touch flex items-center space-x-2 ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Side - Profile & Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 px-3"
              onClick={handleProfileToggle}
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.role}</div>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-elevation-2 py-1">
                <div className="px-4 py-2 border-b border-border">
                  <div className="text-sm font-medium text-popover-foreground">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-hover flex items-center space-x-2"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="px-4 py-2 space-y-1">
            {filteredNavItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-smooth min-h-touch ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;