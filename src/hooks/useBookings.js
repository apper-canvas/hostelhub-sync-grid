import { useState, useEffect } from "react";
import { bookingService } from "@/services/api/bookingService";

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

const getCheckInNotifications = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return bookings.filter(booking => {
      const checkInDate = new Date(booking.checkInDate);
      return checkInDate <= tomorrow && checkInDate >= today && booking.status === 'confirmed';
    });
  };

  const getCheckOutNotifications = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return bookings.filter(booking => {
      const checkOutDate = new Date(booking.checkOutDate);
      return checkOutDate <= tomorrow && checkOutDate >= today && booking.status === 'confirmed';
    });
  };

  return {
    bookings,
    loading,
    error,
    refetch: loadBookings,
    getCheckInNotifications,
    getCheckOutNotifications
  };
};