import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose, onExport, selectedCount = 0 }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    dateRange: 'all',
    dateFrom: '',
    dateTo: '',
    includeReceipts: false,
    includeApprovalChain: true,
    selectedOnly: selectedCount > 0
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const formatOptions = [
    { value: 'csv', label: 'CSV (Comma Separated Values)' },
    { value: 'excel', label: 'Excel Spreadsheet (.xlsx)' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onExport(exportConfig);
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  const updateConfig = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Download" size={16} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Export Expenses
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure your export settings
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Format Selection */}
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportConfig?.format}
            onChange={(value) => updateConfig('format', value)}
          />

          {/* Date Range */}
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={exportConfig?.dateRange}
            onChange={(value) => updateConfig('dateRange', value)}
          />

          {/* Custom Date Range */}
          {exportConfig?.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="From Date"
                type="date"
                value={exportConfig?.dateFrom}
                onChange={(e) => updateConfig('dateFrom', e?.target?.value)}
              />
              <Input
                label="To Date"
                type="date"
                value={exportConfig?.dateTo}
                onChange={(e) => updateConfig('dateTo', e?.target?.value)}
              />
            </div>
          )}

          {/* Export Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Export Options</label>
            
            {selectedCount > 0 && (
              <Checkbox
                label={`Export selected expenses only (${selectedCount} selected)`}
                checked={exportConfig?.selectedOnly}
                onChange={(e) => updateConfig('selectedOnly', e?.target?.checked)}
              />
            )}

            <Checkbox
              label="Include approval chain details"
              checked={exportConfig?.includeApprovalChain}
              onChange={(e) => updateConfig('includeApprovalChain', e?.target?.checked)}
            />

            {exportConfig?.format === 'pdf' && (
              <Checkbox
                label="Include receipt images (PDF only)"
                checked={exportConfig?.includeReceipts}
                onChange={(e) => updateConfig('includeReceipts', e?.target?.checked)}
              />
            )}
          </div>

          {/* Export Preview */}
          <div className="bg-muted/30 rounded-md p-3">
            <div className="text-sm text-muted-foreground mb-2">Export Preview:</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-medium">{exportConfig?.format?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Range:</span>
                <span className="font-medium">
                  {dateRangeOptions?.find(opt => opt?.value === exportConfig?.dateRange)?.label}
                </span>
              </div>
              {exportConfig?.selectedOnly && (
                <div className="flex justify-between">
                  <span>Scope:</span>
                  <span className="font-medium">Selected Only</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;