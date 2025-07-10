import React, { useState } from "react";
import ResidentList from "@/components/organisms/ResidentList";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import PaymentForm from "@/components/organisms/PaymentForm";
import DocumentUpload from "@/components/organisms/DocumentUpload";
import { useResidents } from "@/hooks/useResidents";
import { toast } from "react-toastify";

const Residents = () => {
  const { residents, loading, error, refetch, processPayment } = useResidents();
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

const handleViewProfile = (resident) => {
    toast.info(`Viewing profile for ${resident.name}`);
  };

  const handleCheckOut = (resident) => {
    toast.success(`Check-out process started for ${resident.name}`);
  };

  const handleAddResident = () => {
    toast.info("Opening add resident form");
  };

  const handlePayFees = (resident) => {
    setSelectedResident(resident);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await processPayment(paymentData);
      toast.success(`Payment of $${paymentData.amount} processed successfully for ${selectedResident.name}`);
      setShowPaymentForm(false);
      setSelectedResident(null);
      refetch();
    } catch (error) {
      toast.error(error.message || "Payment processing failed");
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
setSelectedResident(null);
  };

  const handleUploadDocuments = () => {
    setShowDocumentUpload(true);
  };

  const handleDocumentUploadClose = () => {
    setShowDocumentUpload(false);
  };

  const handleDocumentUploadSuccess = (uploadedFiles) => {
    toast.success(`Successfully uploaded ${uploadedFiles.length} document(s)`);
    setShowDocumentUpload(false);
  };

  const handleDocumentUploadError = (error) => {
    toast.error(error.message || "Document upload failed");
  };
  // Filter residents based on search and status
  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.phone.includes(searchTerm) ||
                         resident.roomId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || resident.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: residents.length,
    paid: residents.filter(r => r.paymentStatus === "paid").length,
    pending: residents.filter(r => r.paymentStatus === "pending").length,
    overdue: residents.filter(r => r.paymentStatus === "overdue").length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Residents</h1>
          <p className="text-gray-600 mt-1">Manage current and past residents</p>
</div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleUploadDocuments}>
            <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
          <Button variant="primary" onClick={handleAddResident}>
            <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
            Add Resident
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search residents..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("all")}
          >
            All ({statusCounts.all})
          </Button>
          <Button
            variant={statusFilter === "paid" ? "success" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("paid")}
          >
            Paid ({statusCounts.paid})
          </Button>
          <Button
            variant={statusFilter === "pending" ? "warning" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("pending")}
          >
            Pending ({statusCounts.pending})
          </Button>
          <Button
            variant={statusFilter === "overdue" ? "error" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("overdue")}
          >
            Overdue ({statusCounts.overdue})
          </Button>
        </div>
      </div>

{/* Resident List */}
      <ResidentList
        residents={filteredResidents}
        loading={loading}
        error={error}
        onRetry={refetch}
        onViewProfile={handleViewProfile}
        onCheckOut={handleCheckOut}
        onPayFees={handlePayFees}
      />

      {/* Payment Form Modal */}
      {showPaymentForm && selectedResident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PaymentForm
              resident={selectedResident}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
</div>
      )}

      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <DocumentUpload
              onClose={handleDocumentUploadClose}
              onUploadSuccess={handleDocumentUploadSuccess}
              onUploadError={handleDocumentUploadError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Residents;