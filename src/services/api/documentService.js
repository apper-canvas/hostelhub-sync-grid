import documentsData from "@/services/mockData/documents.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let documents = [...documentsData];

// Simulate file upload with progress
const simulateFileUpload = (file, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        resolve();
      }
      onProgress(Math.min(progress, 100));
    }, 200);
  });
};

// File validation
const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not supported. Please use PDF, images, or documents.`);
  }

  if (file.size > maxSize) {
    throw new Error(`File size must be less than 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }

  // Security check - reject executable files
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
  const fileName = file.name.toLowerCase();
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    throw new Error('This file type is not allowed for security reasons.');
  }

  return true;
};

export const documentService = {
  async getAll() {
    await delay(300);
    return [...documents];
  },

  async getById(id) {
    await delay(200);
    const document = documents.find(d => d.Id === parseInt(id));
    if (!document) {
      throw new Error("Document not found");
    }
    return { ...document };
  },

  async getByResident(residentId) {
    await delay(250);
    return documents.filter(doc => doc.residentId === parseInt(residentId));
  },

  async create(documentData) {
    await delay(400);
    const newDocument = {
      ...documentData,
      Id: Math.max(...documents.map(d => d.Id)) + 1,
      uploadDate: new Date().toISOString(),
      fileSize: documentData.fileSize || 0
    };
    documents.push(newDocument);
    return { ...newDocument };
  },

  async uploadFile(file, residentId, category = 'other', onProgress) {
    // Validate file
    validateFile(file);
    
    // Simulate upload progress
    if (onProgress) {
      await simulateFileUpload(file, onProgress);
    } else {
      await delay(800);
    }

    // Create document record
    const documentData = {
      fileName: file.name,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      residentId: parseInt(residentId),
      category: category,
      uploadDate: new Date().toISOString(),
      // In real implementation, this would be a secure file path
      filePath: `/documents/${Date.now()}_${file.name}`,
      uploadedBy: 'admin', // In real app, this would be current user
      isSecure: true
    };

    return this.create(documentData);
  },

  async uploadMultipleFiles(files, residentId, category = 'other', onProgress) {
    const uploadPromises = files.map(async (file, index) => {
      const fileProgress = (progress) => {
        if (onProgress) {
          const totalProgress = ((index * 100) + progress) / files.length;
          onProgress(totalProgress);
        }
      };

      try {
        return await this.uploadFile(file, residentId, category, fileProgress);
      } catch (error) {
        return { error: error.message, fileName: file.name };
      }
    });

    const results = await Promise.all(uploadPromises);
    return results;
  },

  async update(id, documentData) {
    await delay(350);
    const index = documents.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Document not found");
    }
    
    // Prevent updating certain fields
    const { Id, uploadDate, filePath, ...updateData } = documentData;
    documents[index] = { ...documents[index], ...updateData };
    return { ...documents[index] };
  },

  async delete(id) {
    await delay(300);
    const index = documents.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Document not found");
    }
    const deletedDocument = documents.splice(index, 1)[0];
    return { ...deletedDocument };
  },

  async downloadDocument(id) {
    await delay(200);
    const document = documents.find(d => d.Id === parseInt(id));
    if (!document) {
      throw new Error("Document not found");
    }
    
    // In real implementation, this would generate a secure download URL
    return {
      downloadUrl: document.filePath,
      fileName: document.originalName,
      fileType: document.fileType
    };
  },

  async getDocumentsByCategory(category) {
    await delay(200);
    return documents.filter(doc => doc.category === category);
  },

  async searchDocuments(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return documents.filter(doc => 
      doc.fileName.toLowerCase().includes(searchTerm) ||
      doc.originalName.toLowerCase().includes(searchTerm) ||
      doc.category.toLowerCase().includes(searchTerm)
    );
  },

  // Get document statistics
  async getDocumentStats() {
    await delay(200);
    const stats = {
      total: documents.length,
      byCategory: {},
      byResident: {},
      totalSize: 0
    };

    documents.forEach(doc => {
      // By category
      stats.byCategory[doc.category] = (stats.byCategory[doc.category] || 0) + 1;
      
      // By resident
      stats.byResident[doc.residentId] = (stats.byResident[doc.residentId] || 0) + 1;
      
      // Total size
      stats.totalSize += doc.fileSize || 0;
    });

    return stats;
  }
};