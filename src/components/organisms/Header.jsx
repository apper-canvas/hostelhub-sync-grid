import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import NotificationPanel from "@/components/molecules/NotificationPanel";

const Header = ({ 
  title, 
  subtitle, 
  onMenuClick, 
  className,
  notifications = [],
  notificationsLoading = false,
  onMarkAsRead
}) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  return (
    <header className={cn("bg-surface border-b border-gray-200/50 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
<div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative"
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            <NotificationPanel
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              notifications={notifications}
              loading={notificationsLoading}
              onMarkAsRead={onMarkAsRead}
            />
          </div>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;