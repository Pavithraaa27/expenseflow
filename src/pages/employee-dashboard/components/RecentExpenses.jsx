import React from 'react';
import { motion } from 'framer-motion';
 import ExpenseCard from'./ExpenseCard';
 import Button from'../../../components/ui/Button';

const RecentExpenses = ({ expenses = [], onExpenseClick, onRefresh }) => {
  const handleRefresh = () => {
    onRefresh?.()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-6">
        {expenses?.length > 0 ? (
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ExpenseCard
                  expense={expense}
                  onClick={() => onExpenseClick?.(expense)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses yet</h3>
            <p className="text-gray-600">Start by creating your first expense report</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentExpenses