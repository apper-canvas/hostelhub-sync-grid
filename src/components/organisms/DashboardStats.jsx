import React from "react";
import StatCard from "@/components/molecules/StatCard";
import { cn } from "@/utils/cn";

const DashboardStats = ({ 
  stats, 
  className 
}) => {
  const {
    totalRooms = 0,
    availableRooms = 0,
    totalResidents = 0,
    occupancyRate = 0,
    todayCheckIns = 0,
    todayCheckOuts = 0,
    monthlyRevenue = 0,
    pendingPayments = 0
  } = stats;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      <StatCard
        title="Total Rooms"
        value={totalRooms}
        icon="Bed"
        color="primary"
      />
      <StatCard
        title="Available Rooms"
        value={availableRooms}
        icon="CheckCircle"
        color="success"
      />
      <StatCard
        title="Current Residents"
        value={totalResidents}
        icon="Users"
        color="secondary"
      />
      <StatCard
        title="Occupancy Rate"
        value={`${occupancyRate}%`}
        icon="BarChart3"
        color="accent"
        trend={occupancyRate > 70 ? "up" : occupancyRate < 50 ? "down" : "neutral"}
        trendValue={`${occupancyRate}% capacity`}
      />
      <StatCard
        title="Today Check-ins"
        value={todayCheckIns}
        icon="UserPlus"
        color="success"
      />
      <StatCard
        title="Today Check-outs"
        value={todayCheckOuts}
        icon="UserMinus"
        color="warning"
      />
      <StatCard
        title="Monthly Revenue"
        value={`$${monthlyRevenue.toLocaleString()}`}
        icon="DollarSign"
        color="primary"
        trend="up"
        trendValue="+12% from last month"
      />
      <StatCard
        title="Pending Payments"
        value={pendingPayments}
        icon="Clock"
        color="error"
      />
    </div>
  );
};

export default DashboardStats;