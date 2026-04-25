export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })?.format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-success';
    case 'rejected':
      return 'bg-error';
    case 'pending':
      return 'bg-warning';
    default:
      return 'bg-muted-foreground';
  }
};

export const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'travel':
      return 'Plane';
    case 'meals': case'meals & entertainment':
      return 'Utensils';
    case 'office': case'office supplies':
      return 'Building';
    case 'transport': case'transportation':
      return 'Car';
    case 'accommodation':
      return 'Bed';
    case 'fuel':
      return 'Fuel';
    case 'parking':
      return 'ParkingCircle';
    default:
      return 'Receipt';
  }
};

export const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case 'high':
      return 'text-error bg-error/10';
    case 'medium':
      return 'text-warning bg-warning/10';
    case 'low':
      return 'text-success bg-success/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

export const calculateDaysAgo = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = Math.abs(today - targetDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

export const sortExpenses = (expenses, sortBy) => {
  const sorted = [...expenses];
  
  switch (sortBy) {
    case 'newest':
      return sorted?.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
    case 'oldest':
      return sorted?.sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
    case 'amount-high':
      return sorted?.sort((a, b) => b?.amount - a?.amount);
    case 'amount-low':
      return sorted?.sort((a, b) => a?.amount - b?.amount);
    case 'urgency':
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return sorted?.sort((a, b) => urgencyOrder?.[b?.urgency] - urgencyOrder?.[a?.urgency]);
    case 'employee':
      return sorted?.sort((a, b) => a?.employeeName?.localeCompare(b?.employeeName));
    default:
      return sorted;
  }
};

export const filterExpenses = (expenses, filters) => {
  return expenses?.filter(expense => {
    // Employee filter
    if (filters?.employee && expense?.employeeId !== filters?.employee) {
      return false;
    }
    
    // Category filter
    if (filters?.category && expense?.category !== filters?.category) {
      return false;
    }
    
    // Urgency filter
    if (filters?.urgency && expense?.urgency !== filters?.urgency) {
      return false;
    }
    
    // Amount range filter
    if (filters?.minAmount && expense?.amount < parseFloat(filters?.minAmount)) {
      return false;
    }
    if (filters?.maxAmount && expense?.amount > parseFloat(filters?.maxAmount)) {
      return false;
    }
    
    // Date range filter
    if (filters?.dateFrom && new Date(expense.submissionDate) < new Date(filters.dateFrom)) {
      return false;
    }
    if (filters?.dateTo && new Date(expense.submissionDate) > new Date(filters.dateTo)) {
      return false;
    }
    
    return true;
  });
};

export const generateMockExpenses = () => {
  const employees = [
    { id: 'emp1', name: 'Sarah Johnson' },
    { id: 'emp2', name: 'Michael Chen' },
    { id: 'emp3', name: 'Emily Rodriguez' },
    { id: 'emp4', name: 'David Kim' },
    { id: 'emp5', name: 'Lisa Thompson' }
  ];

  const categories = ['travel', 'meals', 'office', 'transport', 'accommodation'];
  const urgencies = ['high', 'medium', 'low'];
  const vendors = ['Marriott Hotel', 'Delta Airlines', 'Uber', 'Starbucks', 'Office Depot', 'Shell Gas Station'];

  return Array.from({ length: 15 }, (_, index) => {
    const employee = employees?.[Math.floor(Math.random() * employees?.length)];
    const category = categories?.[Math.floor(Math.random() * categories?.length)];
    const urgency = urgencies?.[Math.floor(Math.random() * urgencies?.length)];
    const vendor = vendors?.[Math.floor(Math.random() * vendors?.length)];
    
    return {
      id: `exp-${index + 1}`,
      employeeId: employee?.id,
      employeeName: employee?.name,
      amount: Math.floor(Math.random() * 2000) + 50,
      currency: 'USD',
      category,
      urgency,
      vendor,
      description: `Business expense for ${category} - ${vendor}`,
      businessPurpose: `Required for business operations and client meetings`,
      location: ['New York, NY', 'San Francisco, CA', 'Chicago, IL', 'Austin, TX']?.[Math.floor(Math.random() * 4)],
      expenseDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      submissionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      receiptUrl: `https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop`,
      approvalChain: [
        {
          approverName: 'John Manager',
          role: 'Direct Manager',
          status: 'pending'
        },
        {
          approverName: 'Finance Director',
          role: 'Finance',
          status: 'waiting'
        }
      ]
    };
  });
};