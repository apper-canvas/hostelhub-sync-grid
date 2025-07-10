import React from "react";
import DashboardStats from "@/components/organisms/DashboardStats";
import RoomGrid from "@/components/organisms/RoomGrid";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRooms } from "@/hooks/useRooms";
import { useResidents } from "@/hooks/useResidents";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { rooms, loading: roomsLoading, error: roomsError, refetch: refetchRooms } = useRooms();
  const { residents, loading: residentsLoading, error: residentsError, refetch: refetchResidents } = useResidents();

  const handleQuickCheckIn = (room) => {
    toast.info(`Opening check-in form for Room ${room.roomNumber}`);
  };

  const handleQuickCheckOut = (room) => {
    toast.info(`Opening check-out form for Room ${room.roomNumber}`);
  };

  const handleViewRoomDetails = (room) => {
    toast.info(`Viewing details for Room ${room.roomNumber}`);
  };

  const handleRetry = () => {
    refetchStats();
    refetchRooms();
    refetchResidents();
  };

  // Show only first 8 rooms for dashboard overview
  const dashboardRooms = rooms.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your hostel operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="accent">
            <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
            Quick Check-in
          </Button>
          <Button variant="secondary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Today's Check-ins</h3>
            <ApperIcon name="UserPlus" className="w-5 h-5 text-success" />
          </div>
          <div className="space-y-3">
            {residents.filter(resident => {
              const today = new Date().toISOString().split("T")[0];
              return resident.checkInDate === today;
            }).slice(0, 3).map((resident) => (
              <div key={resident.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{resident.name}</p>
                  <p className="text-sm text-gray-500">Room {resident.roomId} - Bed {resident.bedNumber}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Eye" className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {residents.filter(resident => {
              const today = new Date().toISOString().split("T")[0];
              return resident.checkInDate === today;
            }).length === 0 && (
              <p className="text-gray-500 text-center py-4">No check-ins scheduled for today</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Today's Check-outs</h3>
            <ApperIcon name="UserMinus" className="w-5 h-5 text-warning" />
          </div>
          <div className="space-y-3">
            {residents.filter(resident => {
              const today = new Date().toISOString().split("T")[0];
              return resident.checkOutDate === today;
            }).slice(0, 3).map((resident) => (
              <div key={resident.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{resident.name}</p>
                  <p className="text-sm text-gray-500">Room {resident.roomId} - Bed {resident.bedNumber}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Eye" className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {residents.filter(resident => {
              const today = new Date().toISOString().split("T")[0];
              return resident.checkOutDate === today;
            }).length === 0 && (
              <p className="text-gray-500 text-center py-4">No check-outs scheduled for today</p>
            )}
          </div>
        </Card>
      </div>

      {/* Room Overview */}
      <Card>
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Room Overview</h3>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <RoomGrid
          rooms={dashboardRooms}
          loading={roomsLoading}
          error={roomsError}
          onRetry={handleRetry}
          onViewDetails={handleViewRoomDetails}
          onCheckIn={handleQuickCheckIn}
          onCheckOut={handleQuickCheckOut}
        />
      </Card>
    </div>
  );
};

export default Dashboard;