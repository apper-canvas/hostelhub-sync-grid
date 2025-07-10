import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const RoomCard = ({ 
  room, 
  onViewDetails, 
  onCheckIn, 
  onCheckOut, 
  className 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "success";
      case "occupied":
        return "info";
      case "maintenance":
        return "warning";
      case "cleaning":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return "CheckCircle";
      case "occupied":
        return "User";
      case "maintenance":
        return "Wrench";
      case "cleaning":
        return "Sparkles";
      default:
        return "Circle";
    }
  };

  const occupancyPercentage = (room.currentOccupancy / room.capacity) * 100;

  return (
    <Card className={cn("p-4 hover:shadow-md transition-shadow duration-200", className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            Room {room.roomNumber}
          </h3>
          <p className="text-sm text-gray-500">{room.type}</p>
        </div>
        <Badge variant={getStatusColor(room.status)}>
          <ApperIcon name={getStatusIcon(room.status)} className="w-3 h-3 mr-1" />
          {room.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Occupancy</span>
          <span className="font-medium">
            {room.currentOccupancy}/{room.capacity}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-secondary to-info h-2 rounded-full transition-all duration-300"
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price per bed</span>
          <span className="font-medium">${room.pricePerBed}/night</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(room)}
          className="flex-1"
        >
          <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
          View
        </Button>
        {room.status === "available" && (
          <Button
            variant="success"
            size="sm"
            onClick={() => onCheckIn(room)}
            className="flex-1"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4 mr-1" />
            Check In
          </Button>
        )}
        {room.status === "occupied" && (
          <Button
            variant="warning"
            size="sm"
            onClick={() => onCheckOut(room)}
            className="flex-1"
          >
            <ApperIcon name="UserMinus" className="w-4 h-4 mr-1" />
            Check Out
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RoomCard;