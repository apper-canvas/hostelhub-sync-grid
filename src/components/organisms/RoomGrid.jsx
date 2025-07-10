import React from "react";
import RoomCard from "@/components/molecules/RoomCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const RoomGrid = ({ 
  rooms, 
  loading, 
  error, 
  onRetry, 
  onViewDetails, 
  onCheckIn, 
  onCheckOut, 
  className 
}) => {
  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry} 
        className={className} 
      />
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <Empty
        title="No rooms found"
        message="Start by adding rooms to your hostel"
        actionLabel="Add Room"
        icon="Bed"
        className={className}
      />
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {rooms.map((room) => (
        <RoomCard
          key={room.Id}
          room={room}
          onViewDetails={onViewDetails}
          onCheckIn={onCheckIn}
          onCheckOut={onCheckOut}
        />
      ))}
    </div>
  );
};

export default RoomGrid;