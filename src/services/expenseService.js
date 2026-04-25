import { supabase } from '../lib/supabase';

export const expenseService = {
  // Get all expenses for current user
  async getUserExpenses() {
    try {
      const { data, error } = await supabase?.from('expenses')?.select(`
          *,
          user:user_profiles!expenses_user_id_fkey(full_name, email, role),
          approver:user_profiles!expenses_approved_by_fkey(full_name, email)
        `)?.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { error: { message: 'Failed to fetch expenses' } };
    }
  },

  // Get expenses by status
  async getExpensesByStatus(status) {
    try {
      const { data, error } = await supabase?.from('expenses')?.select(`
          *,
          user:user_profiles!expenses_user_id_fkey(full_name, email, role, department),
          approver:user_profiles!expenses_approved_by_fkey(full_name, email)
        `)?.eq('status', status)?.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { error: { message: 'Failed to fetch expenses by status' } };
    }
  },

  // Create new expense
  async createExpense(expenseData) {
    try {
      const { data, error } = await supabase?.from('expenses')?.insert(expenseData)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { error: { message: 'Failed to create expense' } };
    }
  },

  // Update expense
  async updateExpense(id, updates) {
    try {
      const { data, error } = await supabase?.from('expenses')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', id)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { error: { message: 'Failed to update expense' } };
    }
  },

  // Approve expense
  async approveExpense(id, approverId) {
    try {
      const { data, error } = await supabase?.from('expenses')?.update({
          status: 'approved',
          approved_by: approverId,
          approved_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        })?.eq('id', id)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { error: { message: 'Failed to approve expense' } };
    }
  },

  // Reject expense
  async rejectExpense(id, reason) {
    try {
      const { data, error } = await supabase?.from('expenses')?.update({
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date()?.toISOString()
        })?.eq('id', id)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { error: { message: 'Failed to reject expense' } };
    }
  },

  // Delete expense
  async deleteExpense(id) {
    try {
      const { error } = await supabase?.from('expenses')?.delete()?.eq('id', id);

      return { error };
    } catch (error) {
      return { error: { message: 'Failed to delete expense' } };
    }
  },

  // Get expense summary statistics
  async getExpenseSummary() {
    try {
      const { data, error } = await supabase?.from('expenses')?.select('status, amount, category');

      if (error) return { error };

      const summary = {
        total: data?.length || 0,
        totalAmount: data?.reduce((sum, expense) => sum + parseFloat(expense?.amount || 0), 0) || 0,
        pending: data?.filter(expense => expense?.status === 'submitted')?.length || 0,
        approved: data?.filter(expense => expense?.status === 'approved')?.length || 0,
        rejected: data?.filter(expense => expense?.status === 'rejected')?.length || 0,
        byCategory: data?.reduce((acc, expense) => {
          acc[expense?.category] = (acc?.[expense?.category] || 0) + parseFloat(expense?.amount || 0);
          return acc;
        }, {}) || {}
      };

      return { data: summary, error: null };
    } catch (error) {
      return { error: { message: 'Failed to fetch expense summary' } };
    }
  },

  // Upload receipt
  async uploadReceipt(file, expenseId) {
    try {
      const fileName = `${expenseId}/${Date.now()}-${file?.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('expense-receipts')?.upload(fileName, file);

      if (uploadError) return { error: uploadError };

      // Get public URL
      const { data: { publicUrl } } = supabase?.storage?.from('expense-receipts')?.getPublicUrl(fileName);

      // Save receipt metadata
      const { data: receiptData, error: receiptError } = await supabase?.from('expense_receipts')?.insert({
          expense_id: expenseId,
          file_name: file?.name,
          file_path: uploadData?.path,
          file_size: file?.size,
          file_type: file?.type
        })?.select()?.single();

      if (receiptError) return { error: receiptError };

      // Update expense with receipt URL
      await supabase?.from('expenses')?.update({ receipt_url: publicUrl })?.eq('id', expenseId);

      return { data: { ...receiptData, publicUrl }, error: null };
    } catch (error) {
      return { error: { message: 'Failed to upload receipt' } };
    }
  }
};