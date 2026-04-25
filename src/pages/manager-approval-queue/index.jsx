import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ApprovalStats from './components/ApprovalStats';
import ApprovalFilters from './components/ApprovalFilters';
import ExpenseCard from './components/ExpenseCard';
import BulkApprovalPanel from './components/BulkApprovalPanel';
import ReceiptViewer from './components/ReceiptViewer';
import { expenseService } from '../../services/expenseService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

const ManagerApprovalQueue = () => {
  const { user, userProfile } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [filters, setFilters] = useState({
    status: 'submitted',
    category: '',
    dateRange: '',
    amountRange: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0
  });

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      
      // Load all expenses that need manager approval
      const { data, error } = await expenseService.getUserExpenses();
      
      if (error) {
        console.error('Error loading expenses:', error);
        return;
      }

      setExpenses(data || []);
      
      // Calculate stats
      const newStats = {
        total: data?.length || 0,
        pending: data?.filter(exp => exp?.status === 'submitted')?.length || 0,
        approved: data?.filter(exp => exp?.status === 'approved')?.length || 0,
        rejected: data?.filter(exp => exp?.status === 'rejected')?.length || 0,
        totalAmount: data?.reduce((sum, exp) => sum + parseFloat(exp?.amount || 0), 0) || 0
      };
      
      setStats(newStats);

    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    // Filter by status
    if (filters?.status) {
      filtered = filtered.filter(expense => expense?.status === filters.status);
    }

    // Filter by category
    if (filters?.category) {
      filtered = filtered.filter(expense => expense?.category === filters.category);
    }

    // Filter by amount range
    if (filters?.amountRange) {
      const [min, max] = filters.amountRange.split('-').map(Number);
      filtered = filtered.filter(expense => {
        const amount = parseFloat(expense?.amount || 0);
        return max ? amount >= min && amount <= max : amount >= min;
      });
    }

    // Filter by date range
    if (filters?.dateRange) {
      const today = new Date();
      let dateLimit

      switch (filters.dateRange) {
        case '7':
          dateLimit = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break
        case '30':
          dateLimit = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          break
        case '90':
          dateLimit = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
          break
        default:
          dateLimit = null
      }

      if (dateLimit) {
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense?.created_at);
          return expenseDate >= dateLimit;
        });
      }
    }

    setFilteredExpenses(filtered);
  };

  const handleExpenseAction = async (expenseId, action, reason = null) => {
    try {
      let result;
      
      if (action === 'approve') {
        result = await expenseService.approveExpense(expenseId, user?.id);
      } else if (action === 'reject') {
        result = await expenseService.rejectExpense(expenseId, reason);
      }

      if (result?.error) {
        console.error('Error updating expense:', result.error);
        return;
      }

      // Reload expenses
      await loadExpenses();
      
      // Remove from selected if it was selected
      setSelectedExpenses(prev => prev.filter(id => id !== expenseId));

    } catch (error) {
      console.error('Error handling expense action:', error);
    }
  };

  const handleBulkAction = async (action, reason = null) => {
    try {
      const promises = selectedExpenses.map(expenseId => 
        handleExpenseAction(expenseId, action, reason)
      );
      
      await Promise.all(promises);
      setSelectedExpenses([]);
      setShowBulkPanel(false);
      
    } catch (error) {
      console.error('Error handling bulk action:', error);
    }
  };

  const toggleExpenseSelection = (expenseId) => {
    setSelectedExpenses(prev => 
      prev.includes(expenseId) 
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'submitted',
      category: '',
      dateRange: '',
      amountRange: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Approval Queue</h1>
                <p className="text-gray-600 mt-1">
                  Review and approve expense reports
                </p>
              </div>
              {selectedExpenses?.length > 0 && (
                <Button
                  variant="default"
                  onClick={() => setShowBulkPanel(true)}
                  iconName="CheckSquare"
                >
                  Bulk Actions ({selectedExpenses.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <ApprovalStats stats={stats} />

          {/* Filters */}
          <ApprovalFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            expenseCount={filteredExpenses?.length || 0}
            employees={[]}
          />

          {/* Expense List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Expense Reports ({filteredExpenses?.length || 0})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredExpenses?.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <motion.div
                    key={expense?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ExpenseCard
                      expense={expense}
                      isSelected={selectedExpenses.includes(expense?.id)}
                      onSelect={() => toggleExpenseSelection(expense?.id)}
                      onAction={handleExpenseAction}
                      onViewReceipt={(receipt) => setSelectedReceipt(receipt)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No expenses found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Approval Panel */}
      {showBulkPanel && (
        <BulkApprovalPanel
          selectedCount={selectedExpenses?.length}
          expenses={filteredExpenses.filter(exp => selectedExpenses.includes(exp?.id))}
          onSelectAll={() => setSelectedExpenses(filteredExpenses.map(exp => exp?.id))}
          onSelectExpense={toggleExpenseSelection}
          onApprove={() => handleBulkAction('approve')}
          onReject={(reason) => handleBulkAction('reject', reason)}
          onBulkApprove={() => handleBulkAction('approve')}
          onBulkReject={(reason) => handleBulkAction('reject', reason)}
          isProcessing={false}
          onClose={() => setShowBulkPanel(false)}
        />
      )}

      {/* Receipt Viewer */}
      {selectedReceipt && (
        <ReceiptViewer
          receipt={selectedReceipt}
          expense={filteredExpenses.find(exp => exp?.receipt_url === selectedReceipt)}
          isOpen={!!selectedReceipt}
          onApprove={(expenseId) => handleExpenseAction(expenseId, 'approve')}
          onReject={(expenseId, reason) => handleExpenseAction(expenseId, 'reject', reason)}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default ManagerApprovalQueue;