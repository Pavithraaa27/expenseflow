import React, { useState, useRef, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { OCRProcessingLoader } from '../../../components/ui/LoadingSpinner';

const ReceiptUpload = ({ 
  onReceiptUpload, 
  onOCRComplete, 
  uploadedReceipts, 
  onRemoveReceipt,
  isProcessing 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const fileInputRef = useRef(null);

  // Mock OCR processing function
  const processOCR = useCallback(async (file) => {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock OCR results based on file name or random data
    const mockResults = {
      amount: (Math.random() * 200 + 10)?.toFixed(2),
      vendor: ['Starbucks Coffee', 'Uber Technologies', 'Marriott Hotel', 'Office Depot', 'Amazon Business']?.[Math.floor(Math.random() * 5)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
      category: ['meals', 'travel', 'accommodation', 'office_supplies', 'software']?.[Math.floor(Math.random() * 5)],
      lineItems: [
        { description: 'Coffee - Large', amount: '4.95' },
        { description: 'Pastry', amount: '3.50' },
        { description: 'Tax', amount: '0.68' }
      ],
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    };
    
    setOcrResults(mockResults);
    onOCRComplete(mockResults);
    return mockResults;
  }, [onOCRComplete]);

  const handleDrag = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      const file = e?.dataTransfer?.files?.[0];
      await handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file) => {
    if (!file?.type?.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    if (file?.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    const receipt = {
      id: Date.now(),
      file,
      preview: previewUrl,
      name: file?.name,
      size: file?.size,
      uploadedAt: new Date()
    };

    onReceiptUpload(receipt);

    // Process OCR
    try {
      await processOCR(file);
    } catch (error) {
      console.error('OCR processing failed:', error);
    }
  };

  const handleFileSelect = async (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      await handleFileUpload(e?.target?.files?.[0]);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef?.current) {
      fileInputRef?.current?.setAttribute('capture', 'environment');
      fileInputRef?.current?.click();
    }
  };

  const handleBrowseFiles = () => {
    if (fileInputRef?.current) {
      fileInputRef?.current?.removeAttribute('capture');
      fileInputRef?.current?.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const handleApplyOCRData = () => {
    if (ocrResults) {
      onOCRComplete(ocrResults);
      setOcrResults(null);
    }
  };

  const handleDiscardOCRData = () => {
    setOcrResults(null);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Receipt Upload</h2>
        <div className="flex items-center space-x-2">
          <Icon name="Camera" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">OCR Enabled</span>
        </div>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Upload" size={24} className="text-muted-foreground" />
            </div>
          </div>

          <div>
            <p className="text-lg font-medium text-foreground mb-2">
              Drop receipt image here or click to upload
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG, PDF up to 10MB. OCR will automatically extract expense details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseFiles}
              iconName="FolderOpen"
              iconPosition="left"
            >
              Browse Files
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCameraCapture}
              iconName="Camera"
              iconPosition="left"
              className="sm:hidden"
            >
              Take Photo
            </Button>
          </div>
        </div>
      </div>
      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-6">
          <OCRProcessingLoader />
        </div>
      )}
      {/* OCR Results */}
      {ocrResults && (
        <div className="mt-6 bg-accent/5 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={20} className="text-accent" />
              <h3 className="font-medium text-foreground">OCR Results</h3>
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                {Math.round(ocrResults?.confidence * 100)}% confidence
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm font-medium text-foreground">Amount:</span>
              <span className="ml-2 text-sm text-muted-foreground">${ocrResults?.amount}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Vendor:</span>
              <span className="ml-2 text-sm text-muted-foreground">{ocrResults?.vendor}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Date:</span>
              <span className="ml-2 text-sm text-muted-foreground">{ocrResults?.date}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Category:</span>
              <span className="ml-2 text-sm text-muted-foreground capitalize">{ocrResults?.category?.replace('_', ' ')}</span>
            </div>
          </div>

          {ocrResults?.lineItems && ocrResults?.lineItems?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Line Items:</h4>
              <div className="space-y-1">
                {ocrResults?.lineItems?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item?.description}</span>
                    <span className="text-foreground">${item?.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleApplyOCRData}
              iconName="Check"
              iconPosition="left"
            >
              Apply to Form
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDiscardOCRData}
              iconName="X"
              iconPosition="left"
            >
              Discard
            </Button>
          </div>
        </div>
      )}
      {/* Uploaded Receipts */}
      {uploadedReceipts && uploadedReceipts?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Uploaded Receipts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedReceipts?.map((receipt) => (
              <div key={receipt?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="aspect-square mb-3 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={receipt?.preview}
                    alt={`Receipt ${receipt?.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground truncate" title={receipt?.name}>
                    {receipt?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(receipt?.size)} • {receipt?.uploadedAt?.toLocaleDateString()}
                  </p>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveReceipt(receipt?.id)}
                    iconName="Trash2"
                    iconPosition="left"
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Upload Guidelines */}
      <div className="mt-6 bg-muted/20 rounded-md p-4">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2" />
          Receipt Upload Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Ensure receipt is clearly visible and well-lit</li>
          <li>• Include all four corners of the receipt in the image</li>
          <li>• Avoid shadows, glare, or blurry images for better OCR accuracy</li>
          <li>• Multiple receipts can be uploaded for a single expense</li>
          <li>• OCR data can be manually corrected if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default ReceiptUpload;