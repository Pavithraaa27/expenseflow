import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import ExpenseForm from './components/ExpenseForm';
import ReceiptUpload from './components/ReceiptUpload';
import ExpensePreview from './components/ExpensePreview';
import SubmissionSuccess from './components/SubmissionSuccess';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SubmitExpense = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'preview', 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [submittedExpense, setSubmittedExpense] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    category: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    description: '',
    vendor: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Receipt management
  const [uploadedReceipts, setUploadedReceipts] = useState([]);

  // Mock exchange rates (in real app, this would come from an API)
  const [exchangeRates] = useState({
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    CAD: 1.25,
    AUD: 1.35,
    INR: 74.5
  });

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('expense_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (formData?.amount || formData?.description || formData?.category) {
        localStorage.setItem('expense_draft', JSON.stringify(formData));
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData?.category) {
      newErrors.category = 'Please select an expense category';
    }

    if (!formData?.date) {
      newErrors.date = 'Please select an expense date';
    }

    if (!formData?.description || formData?.description?.trim()?.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // Check if date is not in the future
    if (formData?.date && new Date(formData.date) > new Date()) {
      newErrors.date = 'Expense date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setCurrentStep('preview');
  };

  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('expense_draft', JSON.stringify(formData));
    setIsDraftSaving(false);
    
    // Show success message (you could add a toast notification here)
    alert('Draft saved successfully!');
  };

  const handleReceiptUpload = (receipt) => {
    setUploadedReceipts(prev => [...prev, receipt]);
  };

  const handleRemoveReceipt = (receiptId) => {
    setUploadedReceipts(prev => prev?.filter(receipt => receipt?.id !== receiptId));
  };

  const handleOCRComplete = (ocrData) => {
    setIsOCRProcessing(false);
    
    // Apply OCR data to form
    setFormData(prev => ({
      ...prev,
      amount: ocrData?.amount || prev?.amount,
      vendor: ocrData?.vendor || prev?.vendor,
      date: ocrData?.date || prev?.date,
      category: ocrData?.category || prev?.category
    }));
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Determine approval status based on amount
      const amount = parseFloat(formData?.amount);
      let status = 'pending_manager';
      
      if (amount < 100) {
        status = 'auto_approved';
      } else if (amount >= 500) {
        status = 'pending_finance';
      }

      // Create submitted expense object
      const expense = {
        id: `EXP-${Date.now()}`,
        ...formData,
        status,
        categoryLabel: getCategoryLabel(formData?.category),
        submittedAt: new Date(),
        receipts: uploadedReceipts
      };

      setSubmittedExpense(expense);
      
      // Clear draft from localStorage
      localStorage.removeItem('expense_draft');
      
      setCurrentStep('success');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (value) => {
    const categories = {
      'meals': 'Meals & Entertainment',
      'travel': 'Travel & Transportation',
      'accommodation': 'Accommodation',
      'office_supplies': 'Office Supplies',
      'software': 'Software & Subscriptions',
      'training': 'Training & Education',
      'marketing': 'Marketing & Advertising',
      'equipment': 'Equipment & Hardware',
      'communication': 'Communication',
      'other': 'Other'
    };
    return categories?.[value] || value;
  };

  const handleSubmitAnother = () => {
    setCurrentStep('form');
    setFormData({
      amount: '',
      currency: 'USD',
      category: '',
      date: new Date()?.toISOString()?.split('T')?.[0],
      description: '',
      vendor: ''
    });
    setUploadedReceipts([]);
    setErrors({});
    setSubmittedExpense(null);
  };

  const handleViewHistory = () => {
    navigate('/expense-history');
  };

  const handleEditFromPreview = () => {
    setCurrentStep('form');
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingSpinner 
          variant="overlay" 
          text="Submitting your expense..." 
          size={40}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs />
          
          {currentStep === 'success' ? (
            <SubmissionSuccess
              submittedExpense={submittedExpense}
              onSubmitAnother={handleSubmitAnother}
              onViewHistory={handleViewHistory}
            />
          ) : (
            <>
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {currentStep === 'preview' ? 'Review & Submit Expense' : 'Submit New Expense'}
                </h1>
                <p className="text-muted-foreground">
                  {currentStep === 'preview' ?'Review your expense details before submitting for approval' :'Create a new expense entry with receipt upload and automatic processing'
                  }
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${
                    currentStep === 'form' ? 'text-primary' : 'text-success'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 'form' ? 'bg-primary text-white' : 'bg-success text-white'
                    }`}>
                      {currentStep === 'form' ? '1' : '✓'}
                    </div>
                    <span className="text-sm font-medium">Enter Details</span>
                  </div>
                  
                  <div className={`h-px flex-1 ${
                    currentStep === 'preview' ? 'bg-primary' : 'bg-border'
                  }`}></div>
                  
                  <div className={`flex items-center space-x-2 ${
                    currentStep === 'preview' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 'preview' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      2
                    </div>
                    <span className="text-sm font-medium">Review & Submit</span>
                  </div>
                </div>
              </div>

              {currentStep === 'form' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Form */}
                  <div className="space-y-6">
                    <ExpenseForm
                      formData={formData}
                      onFormChange={handleFormChange}
                      onSubmit={handleSubmit}
                      onSaveDraft={handleSaveDraft}
                      isSubmitting={isSubmitting}
                      isDraftSaving={isDraftSaving}
                      errors={errors}
                      exchangeRates={exchangeRates}
                    />
                  </div>

                  {/* Right Column - Receipt Upload */}
                  <div>
                    <ReceiptUpload
                      onReceiptUpload={handleReceiptUpload}
                      onOCRComplete={handleOCRComplete}
                      uploadedReceipts={uploadedReceipts}
                      onRemoveReceipt={handleRemoveReceipt}
                      isProcessing={isOCRProcessing}
                    />
                  </div>
                </div>
              ) : (
                <ExpensePreview
                  formData={formData}
                  uploadedReceipts={uploadedReceipts}
                  exchangeRates={exchangeRates}
                  onEdit={handleEditFromPreview}
                  onConfirmSubmit={handleConfirmSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubmitExpense;