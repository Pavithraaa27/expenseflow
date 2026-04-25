import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ApprovalFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  expenseCount,
  employees 
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount-high', label: 'Highest Amount' },
    { value: 'amount-low', label: 'Lowest Amount' },
    { value: 'urgency', label: 'By Urgency' },
    { value: 'employee', label: 'By Employee' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'transport', label: 'Transportation' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const employeeOptions = [
    { value: '', label: 'All Employees' },
    ...employees?.map(emp => ({ value: emp?.id, label: emp?.name }))
  ];

  const hasActiveFilters = filters?.employee || filters?.category || filters?.urgency || 
                          filters?.minAmount || filters?.maxAmount || filters?.dateFrom || filters?.dateTo;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-4 lg:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filter & Sort</h3>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {expenseCount} expenses
          </span>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sort By */}
        <Select
          label="Sort by"
          options={sortOptions}
          value={filters?.sortBy}
          onChange={(value) => onFilterChange('sortBy', value)}
          className="w-full"
        />

        {/* Employee Filter */}
        <Select
          label="Employee"
          options={employeeOptions}
          value={filters?.employee}
          onChange={(value) => onFilterChange('employee', value)}
          searchable
          className="w-full"
        />

        {/* Category Filter */}
        <Select
          label="Category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => onFilterChange('category', value)}
          className="w-full"
        />

        {/* Urgency Filter */}
        <Select
          label="Priority"
          options={urgencyOptions}
          value={filters?.urgency}
          onChange={(value) => onFilterChange('urgency', value)}
          className="w-full"
        />
      </div>
      {/* Amount Range & Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-border">
        {/* Amount Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Amount Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min amount"
              value={filters?.minAmount}
              onChange={(e) => onFilterChange('minAmount', e?.target?.value)}
            />
            <Input
              type="number"
              placeholder="Max amount"
              value={filters?.maxAmount}
              onChange={(e) => onFilterChange('maxAmount', e?.target?.value)}
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Submission Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters?.dateFrom}
              onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
            />
            <Input
              type="date"
              value={filters?.dateTo}
              onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
            />
          </div>
        </div>
      </div>
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm font-medium text-muted-foreground mr-2">Quick filters:</span>
        <Button
          variant={filters?.urgency === 'high' ? 'default' : 'outline'}
          size="xs"
          onClick={() => onFilterChange('urgency', filters?.urgency === 'high' ? '' : 'high')}
        >
          High Priority
        </Button>
        <Button
          variant={filters?.category === 'travel' ? 'default' : 'outline'}
          size="xs"
          onClick={() => onFilterChange('category', filters?.category === 'travel' ? '' : 'travel')}
        >
          Travel Expenses
        </Button>
        <Button
          variant={filters?.sortBy === 'amount-high' ? 'default' : 'outline'}
          size="xs"
          onClick={() => onFilterChange('sortBy', filters?.sortBy === 'amount-high' ? 'newest' : 'amount-high')}
        >
          High Amount
        </Button>
        <Button
          variant={filters?.dateFrom === new Date()?.toISOString()?.split('T')?.[0] ? 'default' : 'outline'}
          size="xs"
          onClick={() => {
            const today = new Date()?.toISOString()?.split('T')?.[0];
            onFilterChange('dateFrom', filters?.dateFrom === today ? '' : today);
          }}
        >
          Today
        </Button>
      </div>
    </div>
  );
};

export default ApprovalFilters;