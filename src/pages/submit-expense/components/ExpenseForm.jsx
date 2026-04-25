import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
 import Button from'../../../components/ui/Button';
 import Input from'../../../components/ui/Input';
 import Select from'../../../components/ui/Select';
import { useAuth } from '../../../contexts/AuthContext';
import { expenseService } from '../../../services/expenseService';
 import Icon from'../../../components/AppIcon';

const ExpenseForm = ({ initialData = null, onSubmit, onCancel, isEditing = false }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    category: initialData?.category || '',
    expense_date: initialData?.expense_date || new Date().toISOString().split('T')[0],
    merchant: initialData?.merchant || '',
    currency: initialData?.currency || 'USD'
  })

  const categories = [
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'software', label: 'Software & Tools' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' }
  ]

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData?.title?.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    if (!formData?.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData?.expense_date) {
      newErrors.expense_date = 'Expense date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const expenseData = {
        ...formData,
        user_id: user?.id,
        amount: parseFloat(formData.amount),
        status: 'draft'
      }

      let result
      if (isEditing && initialData?.id) {
        result = await expenseService.updateExpense(initialData.id, expenseData)
      } else {
        result = await expenseService.createExpense(expenseData)
      }

      if (result?.error) {
        setErrors({
          general: result.error.message || 'Failed to save expense'
        })
        return
      }

      if (onSubmit) {
        onSubmit(result.data)
      } else {
        navigate('/employee-dashboard')
      }

    } catch (error) {
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/employee-dashboard')
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {errors?.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Expense Title"
            name="title"
            placeholder="e.g., Team lunch meeting"
            value={formData?.title}
            onChange={handleInputChange}
            error={errors?.title}
            required
            disabled={loading}
          />
        </div>

        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData?.amount}
          onChange={handleInputChange}
          error={errors?.amount}
          required
          disabled={loading}
        />

        <Select
          label="Currency"
          name="currency"
          options={currencies}
          value={formData?.currency}
          onChange={handleInputChange}
          disabled={loading}
        />

        <Select
          label="Category"
          name="category"
          options={categories}
          value={formData?.category}
          onChange={handleInputChange}
          error={errors?.category}
          required
          disabled={loading}
        />

        <Input
          label="Expense Date"
          name="expense_date"
          type="date"
          value={formData?.expense_date}
          onChange={handleInputChange}
          error={errors?.expense_date}
          required
          disabled={loading}
        />

        <div className="md:col-span-2">
          <Input
            label="Merchant/Vendor"
            name="merchant"
            placeholder="e.g., Restaurant ABC"
            value={formData?.merchant}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            placeholder="Additional details about this expense..."
            value={formData?.description}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          iconName="Save"
        >
          {loading ? 'Saving...' : (isEditing ? 'Update Expense' : 'Save Expense')}
        </Button>
      </div>
    </motion.form>
  )
}

export default ExpenseForm