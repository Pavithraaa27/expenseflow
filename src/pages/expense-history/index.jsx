import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ExpenseTable from './components/ExpenseTable';
import ExpenseFilters from './components/ExpenseFilters';
import BulkActions from './components/BulkActions';
import ExpenseDetailModal from './components/ExpenseDetailModal';
import ExportModal from './components/ExportModal';

const ExpenseHistory = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

  // Mock expense data
  const mockExpenses = [
    {
      id: 'EXP-2024-001',
      submissionDate: new Date('2024-09-28'),
      expenseDate: new Date('2024-09-25'),
      amount: 1250.00,
      currency: 'USD',
      originalAmount: 1250.00,
      originalCurrency: 'USD',
      category: 'travel',
      description: 'Flight tickets for client meeting in New York - American Airlines AA1234',
      vendor: 'American Airlines',
      status: 'approved',
      receipt: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
      reimbursementDate: new Date('2024-10-02'),
      approvalChain: [
        {
          approver: 'Sarah Johnson',
          role: 'direct manager',
          status: 'approved',
          date: new Date('2024-09-29'),
          comment: 'Approved for business travel'
        },
        {
          approver: 'Michael Chen',
          role: 'finance director',
          status: 'approved',
          date: new Date('2024-10-01'),
          comment: 'Budget approved'
        }
      ]
    },
    {
      id: 'EXP-2024-002',
      submissionDate: new Date('2024-09-26'),
      expenseDate: new Date('2024-09-24'),
      amount: 85.50,
      currency: 'USD',
      originalAmount: 75.00,
      originalCurrency: 'EUR',
      category: 'meals',
      description: 'Business dinner with potential client at The Capital Grille',
      vendor: 'The Capital Grille',
      status: 'reimbursed',
      receipt: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      reimbursementDate: new Date('2024-09-30'),
      approvalChain: [
        {
          approver: 'Sarah Johnson',
          role: 'direct manager',
          status: 'approved',
          date: new Date('2024-09-27'),
          comment: 'Valid business expense'
        }
      ]
    },
    {
      id: 'EXP-2024-003',
      submissionDate: new Date('2024-09-24'),
      expenseDate: new Date('2024-09-22'),
      amount: 45.99,
      currency: 'USD',
      originalAmount: 45.99,
      originalCurrency: 'USD',
      category: 'office',
      description: 'Office supplies - notebooks, pens, and sticky notes for team',
      vendor: 'Staples',
      status: 'pending',
      receipt: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
      approvalChain: [
        {
          approver: 'Sarah Johnson',
          role: 'direct manager',
          status: 'pending',
          comment: null
        }
      ]
    },
    {
      id: 'EXP-2024-004',
      submissionDate: new Date('2024-09-20'),
      expenseDate: new Date('2024-09-18'),
      amount: 299.99,
      currency: 'USD',
      originalAmount: 299.99,
      originalCurrency: 'USD',
      category: 'software',
      description: 'Adobe Creative Suite annual subscription for design work',
      vendor: 'Adobe Systems',
      status: 'rejected',
      receipt: null,
      approvalChain: [
        {
          approver: 'Sarah Johnson',
          role: 'direct manager',
          status: 'rejected',
          date: new Date('2024-09-21'),
          comment: 'Please use company-provided design tools instead'
        }
      ]
    },
    {
      id: 'EXP-2024-005',
      submissionDate: new Date('2024-09-15'),
      expenseDate: new Date('2024-09-12'),
      amount: 125.00,
      currency: 'USD',
      originalAmount: 125.00,
      originalCurrency: 'USD',
      category: 'training',
      description: 'Online course: Advanced React Development - Udemy',
      vendor: 'Udemy',
      status: 'approved',
      receipt: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      reimbursementDate: new Date('2024-09-18'),
      approvalChain: [
        {
          approver: 'Sarah Johnson',
          role: 'direct manager',
          status: 'approved',
          date: new Date('2024-09-16'),
          comment: 'Great for professional development'
        }
      ]
    },
    {
      id: 'EXP-2024-006',
      submissionDate: new Date('2024-09-10'),
      expenseDate: new Date('2024-09-08'),
      amount: 67.80,
      currency: 'USD',
      originalAmount: 67.80,
      originalCurrency: 'USD',
      category: 'travel',
      description: 'Uber rides to and from airport for business trip',
      vendor: 'Uber Technologies',
      status: 'reimbursed',
      receipt: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      reimbursementDate: new Date('2024-09-14'),
      approvalChain: [
        {
          approver: 'Sarah Johnson',
          role: 'direct manager',
          status: 'approved',
          date: new Date('2024-09-11'),
          comment: 'Reasonable transportation expense'
        }
      ]
    },
    {
      id: 'EXP-2024-007',
      submissionDate: new Date('2024-09-05'),
      expenseDate: new Date('2024-09-03'),
      amount: 1850.00,
      currency: 'USD',
      originalAmount: 1850.00,
      originalCurrency: 'USD',
      category: 'marketing',
      description: 'Trade show booth rental and setup for TechExpo 2024',
      vendor: 'ExpoMax Solutions',
      status: 'approved',
      receipt: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      reimbursementDate: new Date('2024-09-12'),
      approvalChain: [
        {
          approver: 'Sarah Johnson',
          role: 'direct manager',
          status: 'approved',
          date: new Date('2024-09-06'),
          comment: 'Pre-approved marketing expense'
        },
        {
          approver: 'Michael Chen',
          role: 'finance director',
          status: 'approved',
          date: new Date('2024-09-08'),
          comment: 'Within marketing budget'
        }
      ]
    },
    {
      id: 'EXP-2024-008',
      submissionDate: new Date('2024-08-28'),
      expenseDate: new Date('2024-08-25'),
      amount: 32.50,
      currency: 'USD',
      originalAmount: 32.50,
      originalCurrency: 'USD',
      category: 'meals',
      description: 'Working lunch during client presentation',
      vendor: 'Panera Bread',
      status: 'reimbursed',
      receipt: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      reimbursementDate: new Date('2024-09-02'),
      approvalChain: [
        {
          approver: 'Sarah Johnson',
          role: 'direct manager',
          status: 'approved',
          date: new Date('2024-08-29'),
          comment: 'Approved'
        }
      ]
    }
  ];

  // Load expenses on component mount
  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExpenses(mockExpenses);
      } catch (error) {
        console.error('Error loading expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  // Filter expenses based on current filters
  const filteredExpenses = useMemo(() => {
    return expenses?.filter(expense => {
      // Search filter
      if (filters?.search) {
        const searchTerm = filters?.search?.toLowerCase();
        const matchesSearch = 
          expense?.description?.toLowerCase()?.includes(searchTerm) ||
          expense?.vendor?.toLowerCase()?.includes(searchTerm) ||
          expense?.category?.toLowerCase()?.includes(searchTerm) ||
          expense?.id?.toLowerCase()?.includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters?.status !== 'all' && expense?.status !== filters?.status) {
        return false;
      }

      // Category filter
      if (filters?.category !== 'all' && expense?.category !== filters?.category) {
        return false;
      }

      // Date range filter
      if (filters?.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (expense?.submissionDate < fromDate) return false;
      }

      if (filters?.dateTo) {
        const toDate = new Date(filters.dateTo);
        if (expense?.submissionDate > toDate) return false;
      }

      // Amount range filter
      if (filters?.amountMin && expense?.amount < parseFloat(filters?.amountMin)) {
        return false;
      }

      if (filters?.amountMax && expense?.amount > parseFloat(filters?.amountMax)) {
        return false;
      }

      return true;
    });
  }, [expenses, filters]);

  const handleExpenseSelect = (expense) => {
    setSelectedExpense(expense);
    setShowDetailModal(true);
  };

  const handleBulkAction = (action, data) => {
    switch (action) {
      case 'export':
        console.log('Exporting expenses:', data);
        // Handle export logic
        break;
      case 'delete':
        console.log('Deleting expenses:', data?.expenseIds);
        // Handle delete logic
        setExpenses(prev => prev?.filter(expense => !data?.expenseIds?.includes(expense?.id)));
        setSelectedExpenses([]);
        break;
      default:
        break;
    }
  };

  const handleExport = (config) => {
    console.log('Export configuration:', config);
    // Handle export with configuration
  };

  const clearSelection = () => {
    setSelectedExpenses([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <LoadingSpinner text="Loading expense history..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Expense History</h1>
              <p className="text-muted-foreground mt-2">
                Track and manage all your submitted expenses
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
              
              <Button
                asChild
                iconName="Plus"
                iconPosition="left"
              >
                <Link to="/submit-expense">
                  New Expense
                </Link>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <ExpenseFilters
            filters={filters}
            onFiltersChange={setFilters}
            expenseCount={filteredExpenses?.length}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedExpenses={selectedExpenses}
            onBulkAction={handleBulkAction}
            onClearSelection={clearSelection}
          />

          {/* Expenses Table */}
          {filteredExpenses?.length > 0 ? (
            <ExpenseTable
              expenses={filteredExpenses}
              onExpenseSelect={handleExpenseSelect}
              selectedExpenses={selectedExpenses}
              onBulkSelect={setSelectedExpenses}
            />
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No expenses found
              </h3>
              <p className="text-muted-foreground mb-6">
                {expenses?.length === 0 
                  ? "You haven't submitted any expenses yet." :"No expenses match your current filters."
                }
              </p>
              {expenses?.length === 0 ? (
                <Button
                  asChild
                  iconName="Plus"
                  iconPosition="left"
                >
                  <Link to="/submit-expense">
                    Submit Your First Expense
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    search: '',
                    status: 'all',
                    category: 'all',
                    dateFrom: '',
                    dateTo: '',
                    amountMin: '',
                    amountMax: ''
                  })}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Modals */}
      <ExpenseDetailModal
        expense={selectedExpense}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedExpense(null);
        }}
      />
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        selectedCount={selectedExpenses?.length}
      />
    </div>
  );
};

export default ExpenseHistory;