import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const ExpenseTable = ({ expenses, onExpenseSelect, selectedExpenses, onBulkSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'submissionDate', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleRowExpansion = (expenseId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(expenseId)) {
      newExpanded?.delete(expenseId);
    } else {
      newExpanded?.add(expenseId);
    }
    setExpandedRows(newExpanded);
  };

  const sortedExpenses = [...expenses]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'rejected':
        return <Icon name="XCircle" size={16} className="text-error" />;
      case 'reimbursed':
        return <Icon name="DollarSign" size={16} className="text-accent" />;
      default:
        return <Icon name="Clock" size={16} className="text-warning" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-success/10 text-success`;
      case 'rejected':
        return `${baseClasses} bg-error/10 text-error`;
      case 'reimbursed':
        return `${baseClasses} bg-accent/10 text-accent`;
      default:
        return `${baseClasses} bg-warning/10 text-warning`;
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onBulkSelect(expenses?.map(expense => expense?.id));
    } else {
      onBulkSelect([]);
    }
  };

  const isAllSelected = expenses?.length > 0 && selectedExpenses?.length === expenses?.length;
  const isIndeterminate = selectedExpenses?.length > 0 && selectedExpenses?.length < expenses?.length;

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort('submissionDate')}
                  className="flex items-center space-x-1 hover:text-primary transition-hover"
                >
                  <span>Date</span>
                  <Icon 
                    name={sortConfig?.key === 'submissionDate' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 hover:text-primary transition-hover"
                >
                  <span>Amount</span>
                  <Icon 
                    name={sortConfig?.key === 'amount' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Description</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedExpenses?.map((expense) => (
              <React.Fragment key={expense?.id}>
                <tr className="hover:bg-muted/30 transition-hover">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedExpenses?.includes(expense?.id)}
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          onBulkSelect([...selectedExpenses, expense?.id]);
                        } else {
                          onBulkSelect(selectedExpenses?.filter(id => id !== expense?.id));
                        }
                      }}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {formatDate(expense?.submissionDate)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {formatCurrency(expense?.amount, expense?.currency)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {expense?.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                    {expense?.description}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(expense?.status)}
                      <span className={getStatusBadge(expense?.status)}>
                        {expense?.status?.charAt(0)?.toUpperCase() + expense?.status?.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(expense?.id)}
                      >
                        <Icon 
                          name={expandedRows?.has(expense?.id) ? 'ChevronUp' : 'ChevronDown'} 
                          size={16} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onExpenseSelect(expense)}
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
                {expandedRows?.has(expense?.id) && (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 bg-muted/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Approval Chain</h4>
                          <div className="space-y-2">
                            {expense?.approvalChain?.map((approval, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                {approval?.status === 'approved' && (
                                  <Icon name="CheckCircle" size={14} className="text-success" />
                                )}
                                {approval?.status === 'rejected' && (
                                  <Icon name="XCircle" size={14} className="text-error" />
                                )}
                                {approval?.status === 'pending' && (
                                  <Icon name="Clock" size={14} className="text-warning" />
                                )}
                                <span className="text-muted-foreground">{approval?.approver}</span>
                                {approval?.comment && (
                                  <span className="text-xs text-muted-foreground">- {approval?.comment}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Receipt & Details</h4>
                          <div className="space-y-2">
                            {expense?.receipt && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Icon name="Paperclip" size={14} className="text-muted-foreground" />
                                <span className="text-muted-foreground">Receipt attached</span>
                              </div>
                            )}
                            {expense?.vendor && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Icon name="Store" size={14} className="text-muted-foreground" />
                                <span className="text-muted-foreground">{expense?.vendor}</span>
                              </div>
                            )}
                            {expense?.originalCurrency !== expense?.currency && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Icon name="ArrowRightLeft" size={14} className="text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {formatCurrency(expense?.originalAmount, expense?.originalCurrency)} → {formatCurrency(expense?.amount, expense?.currency)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {sortedExpenses?.map((expense) => (
          <div key={expense?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedExpenses?.includes(expense?.id)}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      onBulkSelect([...selectedExpenses, expense?.id]);
                    } else {
                      onBulkSelect(selectedExpenses?.filter(id => id !== expense?.id));
                    }
                  }}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatCurrency(expense?.amount, expense?.currency)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(expense?.submissionDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(expense?.status)}
                <span className={getStatusBadge(expense?.status)}>
                  {expense?.status?.charAt(0)?.toUpperCase() + expense?.status?.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2 text-sm">
                <Icon name="Tag" size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">{expense?.category}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {expense?.description}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRowExpansion(expense?.id)}
              >
                <Icon 
                  name={expandedRows?.has(expense?.id) ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                />
                <span className="ml-1">Details</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExpenseSelect(expense)}
              >
                <Icon name="Eye" size={16} />
                <span className="ml-1">View</span>
              </Button>
            </div>

            {expandedRows?.has(expense?.id) && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Approval Progress</h4>
                  <div className="space-y-2">
                    {expense?.approvalChain?.map((approval, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        {approval?.status === 'approved' && (
                          <Icon name="CheckCircle" size={14} className="text-success" />
                        )}
                        {approval?.status === 'rejected' && (
                          <Icon name="XCircle" size={14} className="text-error" />
                        )}
                        {approval?.status === 'pending' && (
                          <Icon name="Clock" size={14} className="text-warning" />
                        )}
                        <span className="text-muted-foreground">{approval?.approver}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {expense?.receipt && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Paperclip" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Receipt attached</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTable;