import React, { useState, useRef, useEffect } from 'react';
import { documentService } from '@/services/api/documentService';
import { residentService } from '@/services/api/residentService';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import { cn } from '@/utils/cn';
import { toast } from 'react-toastify';

const DocumentUpload = ({ onClose, onUploadSuccess, onUploadError }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedResident, setSelectedResident] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('identification');
  const [residents, setResidents] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const categories = [
    { value: 'identification', label: 'Identification Documents' },
    { value: 'contract', label: 'Contracts & Agreements' },
    { value: 'financial', label: 'Financial Documents' },
    { value: 'other', label: 'Other Documents' }
  ];

  // Load residents on component mount
  useEffect(() => {
    const loadResidents = async () => {
      try {
        const residentsData = await residentService.getAll();
        setResidents(residentsData);
      } catch (error) {
        toast.error('Failed to load residents');
      }
    };
    loadResidents();
  }, []);

  // Load existing documents
  useEffect(() => {
    const loadDocuments = async () => {
      setLoadingDocuments(true);
      try {
        const docs = await documentService.getAll();
        setExistingDocuments(docs);
      } catch (error) {
        toast.error('Failed to load existing documents');
      } finally {
        setLoadingDocuments(false);
      }
    };
    loadDocuments();
  }, []);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      try {
        // Basic validation
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 10MB)`);
          return false;
        }
        return true;
      } catch (error) {
        toast.error(`Invalid file: ${file.name}`);
        return false;
      }
    });

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      progress: 0,
      status: 'pending' // pending, uploading, completed, error
    }))]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpload = async () => {
    if (!selectedResident) {
      toast.error('Please select a resident');
      return;
    }

    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileList = files.map(f => f.file);
      
      const results = await documentService.uploadMultipleFiles(
        fileList,
        selectedResident,
        selectedCategory,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Check for any errors
      const errors = results.filter(r => r.error);
      const successes = results.filter(r => !r.error);

      if (errors.length > 0) {
        errors.forEach(error => {
          toast.error(`${error.fileName}: ${error.error}`);
        });
      }

      if (successes.length > 0) {
        onUploadSuccess(successes);
        // Refresh document list
        const updatedDocs = await documentService.getAll();
        setExistingDocuments(updatedDocs);
        setFiles([]);
      }

    } catch (error) {
      if (onUploadError) {
        onUploadError(error);
      } else {
        toast.error(error.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentService.delete(documentId);
      toast.success('Document deleted successfully');
      
      // Refresh document list
      const updatedDocs = await documentService.getAll();
      setExistingDocuments(updatedDocs);
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleDownloadDocument = async (documentId) => {
    try {
      const downloadInfo = await documentService.downloadDocument(documentId);
      // In a real app, this would trigger actual download
      toast.info(`Download started: ${downloadInfo.fileName}`);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType === 'application/pdf') return 'FileText';
    if (fileType.includes('word')) return 'FileText';
    return 'File';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'identification': return 'IdCard';
      case 'contract': return 'FileContract';
      case 'financial': return 'DollarSign';
      default: return 'File';
    }
  };

  // Filter documents based on search
  const filteredDocuments = existingDocuments.filter(doc => {
    const resident = residents.find(r => r.Id === doc.residentId);
    const residentName = resident ? resident.name : 'Unknown';
    
    return (
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
          <p className="text-gray-600 mt-1">Upload resident IDs and contracts securely</p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <ApperIcon name="X" className="w-5 h-5" />
        </Button>
      </div>

      {/* Upload Section */}
      <div className="space-y-6">
        {/* Resident and Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Resident
            </label>
            <select
              value={selectedResident}
              onChange={(e) => setSelectedResident(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Choose a resident...</option>
              {residents.map(resident => (
                <option key={resident.Id} value={resident.Id}>
                  {resident.name} (Room {resident.roomId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 hover:border-gray-400"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <ApperIcon name="Upload" className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-600">
                Support for PDF, images, and documents (Max 10MB each)
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Selected Files</h3>
            <div className="space-y-2">
              {files.map(fileItem => (
                <div key={fileItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name={getFileIcon(fileItem.file.type)} className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{fileItem.file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(fileItem.file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileItem.id)}
                    disabled={uploading}
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Uploading files...</span>
              <span className="text-gray-900">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !selectedResident}
          >
            {uploading ? (
              <>
                <Loading className="w-4 h-4 mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                Upload {files.length} File{files.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Existing Documents */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Existing Documents</h3>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Search" className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {loadingDocuments ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="space-y-2">
            {filteredDocuments.map(doc => {
              const resident = residents.find(r => r.Id === doc.residentId);
              return (
                <div key={doc.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name={getCategoryIcon(doc.category)} className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.originalName}</p>
                      <p className="text-sm text-gray-600">
                        {resident ? resident.name : 'Unknown'} • {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadDocument(doc.Id)}
                    >
                      <ApperIcon name="Download" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.Id)}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No documents found matching your search.' : 'No documents uploaded yet.'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DocumentUpload;