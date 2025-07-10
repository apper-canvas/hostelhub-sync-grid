import { useState, useEffect } from "react";
import { notificationService } from "@/services/api/notificationService";
import { bookingService } from "@/services/api/bookingService";
import { roomService } from "@/services/api/roomService";
import { toast } from "react-toastify";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const generateSystemNotifications = async () => {
    try {
      // Get existing notifications
      const existingNotifications = await notificationService.getAll();
      
      // Get booking alerts
      const bookingAlerts = await bookingService.getNotificationAlerts();
      const roomAlerts = await roomService.getMaintenanceAlerts();
      
      // Generate new notifications for recent bookings/rooms not already notified
      const newNotifications = [];
      
      // Check-in notifications
      bookingAlerts.forEach(booking => {
        const checkInDate = new Date(booking.checkInDate);
        const today = new Date();
        const isToday = checkInDate.toDateString() === today.toDateString();
        
        if (isToday) {
          const exists = existingNotifications.some(n => 
            n.type === 'check-in' && n.relatedId === booking.Id
          );
          if (!exists) {
            newNotifications.push({
              title: "Check-in Today",
              message: `Guest check-in for Room ${booking.roomId}`,
              type: "check-in",
              priority: "high",
              relatedId: booking.Id
            });
          }
        }
      });
      
      // Room maintenance notifications
      roomAlerts.forEach(room => {
        const exists = existingNotifications.some(n => 
          n.type === 'maintenance' && n.relatedId === room.Id
        );
        if (!exists) {
          newNotifications.push({
            title: "Room Maintenance",
            message: `Room ${room.roomNumber} requires ${room.status}`,
            type: "maintenance",
            priority: "medium",
            relatedId: room.Id
          });
        }
      });
      
      // Create new notifications
      for (const notification of newNotifications) {
        await notificationService.create(notification);
      }
      
      return await notificationService.getAll();
    } catch (err) {
      console.error("Error generating notifications:", err);
      return await notificationService.getAll();
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await generateSystemNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.Id === id ? { ...n, isRead: true } : n)
      );
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: loadNotifications,
    markAsRead
  };
};