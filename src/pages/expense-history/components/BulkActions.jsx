import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import SummaryCard from '../../employee-dashboard/components/SummaryCard';
import QuickActions from '../../employee-dashboard/components/QuickActions';
import RecentExpenses from '../../employee-dashboard/components/RecentExpenses';
import ExpenseDetailsModal from '../../employee-dashboard/components/ExpenseDetailsModal';
import { expenseService } from '../../../services/expenseService';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const EmployeeDashboard = () => {
  const { user, userProfile } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load expenses and summary in parallel
      const [expensesResult, summaryResult] = await Promise.all([
        expenseService.getUserExpenses(),
        expenseService.getExpenseSummary()
      ])

      if (expensesResult?.data) {
        setExpenses(expensesResult.data)
      }

      if (summaryResult?.data) {
        setSummary(summaryResult.data)
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense)
    setShowDetailsModal(true)
  }

  const handleExpenseUpdate = () => {
    loadDashboardData() // Reload data after update
  }

  const handleReceiptUpload = (file) => {
    // Handle receipt upload functionality
    console.log('Receipt uploaded:', file);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userProfile?.full_name || user?.email?.split('@')[0]}
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage your expenses efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              title="Total Expenses"
              value={summary?.totalAmount ? `${summary.totalAmount.toFixed(2)}` : '$0.00'}
              subtitle={`${summary?.total || 0} expenses`}
              trend="+12% from last month"
              trendValue={12}
              icon="DollarSign"
              color="blue"
            />
            <SummaryCard
              title="Pending Approval"
              value={summary?.pending || 0}
              subtitle="Awaiting review"
              trend="2 new this week"
              trendValue={2}
              icon="Clock"
              color="orange"
            />
            <SummaryCard
              title="Approved"
              value={summary?.approved || 0}
              subtitle="Ready for reimbursement"
              trend="85% approval rate"
              trendValue={85}
              icon="CheckCircle"
              color="green"
            />
          </div>

          {/* Quick Actions */}
          <QuickActions onReceiptUpload={handleReceiptUpload} />

          {/* Recent Expenses */}
          <RecentExpenses 
            expenses={expenses?.slice(0, 10) || []}
            onExpenseClick={handleExpenseClick}
            onRefresh={loadDashboardData}
          />
        </div>
      </div>

      {/* Expense Details Modal */}
      {showDetailsModal && selectedExpense && (
        <ExpenseDetailsModal
          expense={selectedExpense}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={handleExpenseUpdate}
        />
      )}
    </div>
  )
}

export default EmployeeDashboard