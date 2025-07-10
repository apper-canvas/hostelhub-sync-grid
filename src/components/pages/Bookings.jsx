import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useBookings } from "@/hooks/useBookings";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Bookings = () => {
  const { bookings, loading, error, refetch } = useBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleViewBooking = (booking) => {
    toast.info(`Viewing booking details for ID: ${booking.Id}`);
  };

  const handleConfirmBooking = (booking) => {
    toast.success(`Booking ${booking.Id} confirmed successfully`);
  };

  const handleCancelBooking = (booking) => {
    toast.error(`Booking ${booking.Id} cancelled`);
  };

  const handleAddBooking = () => {
    toast.info("Opening new booking form");
  };

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.Id.toString().includes(searchTerm) ||
                         booking.roomId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    pending: bookings.filter(b => b.status === "pending").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "error";
      default:
        return "secondary";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-1">Manage reservations and bookings</p>
        </div>
        <Button variant="primary" onClick={handleAddBooking}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search bookings..."
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
            variant={statusFilter === "confirmed" ? "success" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("confirmed")}
          >
            Confirmed ({statusCounts.confirmed})
          </Button>
          <Button
            variant={statusFilter === "pending" ? "warning" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("pending")}
          >
            Pending ({statusCounts.pending})
          </Button>
          <Button
            variant={statusFilter === "cancelled" ? "error" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("cancelled")}
          >
            Cancelled ({statusCounts.cancelled})
          </Button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Empty
          title="No bookings found"
          message="No bookings match your search criteria"
          actionLabel="Add Booking"
          onAction={handleAddBooking}
          icon="Calendar"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <Card key={booking.Id} className="hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Booking #{booking.Id}
                  </h3>
                  <p className="text-sm text-gray-500">Room {booking.roomId}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                  <Badge variant={getPaymentStatusColor(booking.paymentStatus)}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">
                    Check-in: {format(new Date(booking.checkInDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <ApperIcon name="CalendarX" className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">
                    Check-out: {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <ApperIcon name="DollarSign" className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">
                    Total: ${booking.totalAmount}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">
                    Created: {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewBooking(booking)}
                  className="flex-1"
                >
                  <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                  View
                </Button>
                {booking.status === "pending" && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleConfirmBooking(booking)}
                    className="flex-1"
                  >
                    <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                )}
                {booking.status !== "cancelled" && (
                  <Button
                    variant="error"
                    size="sm"
                    onClick={() => handleCancelBooking(booking)}
                    className="flex-1"
                  >
                    <ApperIcon name="X" className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;