import { useState, useEffect } from "react";
import { roomService } from "@/services/api/roomService";

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await roomService.getAll();
      setRooms(data);
    } catch (err) {
      setError(err.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

const getMaintenanceNotifications = () => {
    return rooms.filter(room => 
      room.status === 'maintenance' || room.status === 'cleaning'
    );
  };

  return {
    rooms,
    loading,
    error,
    refetch: loadRooms,
    getMaintenanceNotifications
  };
};