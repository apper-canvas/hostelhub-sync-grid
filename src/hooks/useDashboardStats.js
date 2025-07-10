import { useState, useEffect } from "react";
import { roomService } from "@/services/api/roomService";
import { residentService } from "@/services/api/residentService";
import { bookingService } from "@/services/api/bookingService";

export const useDashboardStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [rooms, residents, bookings] = await Promise.all([
        roomService.getAll(),
        residentService.getCurrentResidents(),
        bookingService.getAll()
      ]);

      const availableRooms = rooms.filter(room => room.status === "available").length;
      const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
      const currentOccupancy = rooms.reduce((sum, room) => sum + room.currentOccupancy, 0);
      const occupancyRate = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0;

      const today = new Date().toISOString().split("T")[0];
      const todayCheckIns = bookings.filter(booking => 
        booking.checkInDate === today && booking.status === "confirmed"
      ).length;
      const todayCheckOuts = bookings.filter(booking => 
        booking.checkOutDate === today && booking.status === "confirmed"
      ).length;

      const monthlyRevenue = bookings
        .filter(booking => booking.paymentStatus === "paid")
        .reduce((sum, booking) => sum + booking.totalAmount, 0);

      const pendingPayments = residents.filter(resident => 
        resident.paymentStatus === "pending" || resident.paymentStatus === "overdue"
      ).length;

      setStats({
        totalRooms: rooms.length,
        availableRooms,
        totalResidents: residents.length,
        occupancyRate,
        todayCheckIns,
        todayCheckOuts,
        monthlyRevenue,
        pendingPayments
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: loadStats
  };
};