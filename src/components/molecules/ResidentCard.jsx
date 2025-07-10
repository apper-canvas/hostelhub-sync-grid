import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const ResidentCard = ({ 
  resident, 
  onViewProfile, 
  onCheckOut, 
  className 
}) => {
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

  const getDaysRemaining = (checkOutDate) => {
    const today = new Date();
    const checkout = new Date(checkOutDate);
    const diffTime = checkout - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(resident.checkOutDate);

  return (
    <Card className={cn("p-4 hover:shadow-md transition-shadow duration-200", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {resident.name}
          </h3>
          <p className="text-sm text-gray-500">{resident.email}</p>
          <p className="text-sm text-gray-500">{resident.phone}</p>
        </div>
        <Badge variant={getPaymentStatusColor(resident.paymentStatus)}>
          {resident.paymentStatus}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-gray-600">Room {resident.roomId} - Bed {resident.bedNumber}</span>
        </div>
        <div className="flex items-center text-sm">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-gray-600">
            Check-in: {format(new Date(resident.checkInDate), "MMM dd, yyyy")}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <ApperIcon name="CalendarX" className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-gray-600">
            Check-out: {format(new Date(resident.checkOutDate), "MMM dd, yyyy")}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <ApperIcon name="Clock" className="w-4 h-4 mr-2 text-gray-400" />
          <span className={cn(
            "font-medium",
            daysRemaining <= 3 ? "text-warning" : "text-gray-600"
          )}>
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Check-out overdue"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewProfile(resident)}
          className="flex-1"
        >
          <ApperIcon name="User" className="w-4 h-4 mr-1" />
          Profile
        </Button>
        <Button
          variant="warning"
          size="sm"
          onClick={() => onCheckOut(resident)}
          className="flex-1"
        >
          <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />
          Check Out
        </Button>
      </div>
    </Card>
  );
};

export default ResidentCard;