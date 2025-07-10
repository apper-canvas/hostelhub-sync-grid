import React, { useState } from "react";
import RoomGrid from "@/components/organisms/RoomGrid";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useRooms } from "@/hooks/useRooms";
import { toast } from "react-toastify";

const Rooms = () => {
  const { rooms, loading, error, refetch } = useRooms();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleCheckIn = (room) => {
    toast.success(`Check-in process started for Room ${room.roomNumber}`);
  };

  const handleCheckOut = (room) => {
    toast.success(`Check-out process started for Room ${room.roomNumber}`);
  };

  const handleViewDetails = (room) => {
    toast.info(`Viewing details for Room ${room.roomNumber}`);
  };

  const handleAddRoom = () => {
    toast.info("Opening add room form");
  };

  // Filter rooms based on search and status
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: rooms.length,
    available: rooms.filter(r => r.status === "available").length,
    occupied: rooms.filter(r => r.status === "occupied").length,
    maintenance: rooms.filter(r => r.status === "maintenance").length,
    cleaning: rooms.filter(r => r.status === "cleaning").length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600 mt-1">Manage your hostel rooms and occupancy</p>
        </div>
        <Button variant="primary" onClick={handleAddRoom}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search rooms..."
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
            variant={statusFilter === "available" ? "success" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("available")}
          >
            Available ({statusCounts.available})
          </Button>
          <Button
            variant={statusFilter === "occupied" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("occupied")}
          >
            Occupied ({statusCounts.occupied})
          </Button>
          <Button
            variant={statusFilter === "maintenance" ? "warning" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("maintenance")}
          >
            Maintenance ({statusCounts.maintenance})
          </Button>
          <Button
            variant={statusFilter === "cleaning" ? "accent" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("cleaning")}
          >
            Cleaning ({statusCounts.cleaning})
          </Button>
        </div>
      </div>

      {/* Room Grid */}
      <RoomGrid
        rooms={filteredRooms}
        loading={loading}
        error={error}
        onRetry={refetch}
        onViewDetails={handleViewDetails}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />
    </div>
  );
};

export default Rooms;