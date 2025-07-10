import { useState, useEffect } from "react";
import { residentService } from "@/services/api/residentService";

export const useResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await residentService.getCurrentResidents();
      setResidents(data);
    } catch (err) {
      setError(err.message || "Failed to load residents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  return {
    residents,
    loading,
    error,
    refetch: loadResidents
  };
};