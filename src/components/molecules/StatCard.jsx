import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colors = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10"
  };

  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-gray-500"
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                className={cn("w-4 h-4 mr-1", trendColors[trend])} 
              />
              <span className={cn("text-sm font-medium", trendColors[trend])}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-full", colors[color])}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;