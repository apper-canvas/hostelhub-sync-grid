import { useState, useEffect } from "react";
import { residentService } from "@/services/api/residentService";
import { paymentService } from "@/services/api/paymentService";

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

const processPayment = async (paymentData) => {
    try {
      // Process payment
      const paymentResult = await paymentService.processPayment(paymentData);
      
      // Update resident payment status
      await residentService.updatePaymentStatus(paymentData.residentId, "paid");
      
      return paymentResult;
    } catch (error) {
      throw new Error(error.message || "Payment processing failed");
    }
  };

  return {
    residents,
    loading,
    error,
    refetch: loadResidents,
    processPayment
  };
};