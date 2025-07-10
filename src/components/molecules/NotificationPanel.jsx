import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import { formatDistanceToNow } from "date-fns";

const NotificationPanel = ({
  isOpen,
  onClose,
  notifications = [],
  loading = false,
  onMarkAsRead,
  className
}) => {
  if (!isOpen) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'badge-error';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'check-in': return 'UserCheck';
      case 'check-out': return 'UserX';
      case 'maintenance': return 'Wrench';
      case 'payment': return 'CreditCard';
      case 'system': return 'AlertCircle';
      default: return 'Bell';
    }
  };

  const handleMarkAsRead = (notification) => {
    if (onMarkAsRead && !notification.isRead) {
      onMarkAsRead(notification.Id);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={cn(
        "absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50",
        "animate-scale-in",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8">
              <Loading />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ApperIcon name="Bell" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.Id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer",
                    !notification.isRead && "bg-blue-50 border-l-4 border-primary"
                  )}
                  onClick={() => handleMarkAsRead(notification)}
                >
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    notification.priority === 'high' ? 'bg-error/10' :
                    notification.priority === 'medium' ? 'bg-warning/10' :
                    'bg-info/10'
                  )}>
                    <ApperIcon 
                      name={getTypeIcon(notification.type)} 
                      className={cn(
                        "w-4 h-4",
                        notification.priority === 'high' ? 'text-error' :
                        notification.priority === 'medium' ? 'text-warning' :
                        'text-info'
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "text-sm font-medium",
                        notification.isRead ? "text-gray-700" : "text-gray-900"
                      )}>
                        {notification.title}
                      </h4>
                      <Badge 
                        variant={getPriorityColor(notification.priority)}
                        className="text-xs"
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className={cn(
                      "text-sm mb-1",
                      notification.isRead ? "text-gray-500" : "text-gray-600"
                    )}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Read indicator */}
                  {!notification.isRead && (
                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm"
              onClick={onClose}
            >
              View all notifications
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;