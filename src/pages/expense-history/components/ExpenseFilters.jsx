import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ExpenseFilters = ({ filters, onFiltersChange, expenseCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'reimbursed', label: 'Reimbursed' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'software', label: 'Software & Tools' },
    { value: 'training', label: 'Training & Education' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Other' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  const hasActiveFilters = filters?.search || 
    filters?.status !== 'all' || 
    filters?.category !== 'all' || 
    filters?.dateFrom || 
    filters?.dateTo || 
    filters?.amountMin || 
    filters?.amountMax;

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-4 mb-6">
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="text"
              placeholder="Search expenses, vendors, descriptions..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="FileText" size={16} />
            <span>{expenseCount} expenses</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            Filters
          </Button>
        </div>
      </div>
      {/* Quick Status Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions?.map((status) => (
          <Button
            key={status?.value}
            variant={filters?.status === status?.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('status', status?.value)}
            className="text-xs"
          >
            {status?.label}
          </Button>
        ))}
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <Select
              label="Category"
              options={categoryOptions}
              value={filters?.category}
              onChange={(value) => handleFilterChange('category', value)}
            />

            {/* Date Range */}
            <Input
              label="From Date"
              type="date"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            />

            <Input
              label="To Date"
              type="date"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            />

            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Amount Range</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters?.amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters?.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  iconName="X"
                  iconPosition="left"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Collapse
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilters;