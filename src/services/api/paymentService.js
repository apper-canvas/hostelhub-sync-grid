const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock payment history storage
let paymentHistory = [];
let nextPaymentId = 1;

export const paymentService = {
  async processPayment(paymentData) {
    await delay(2000); // Simulate payment processing time
    
    // Simulate random payment failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error("Payment processing failed. Please try again.");
    }

    const payment = {
      Id: nextPaymentId++,
      ...paymentData,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "completed",
      processedAt: new Date().toISOString(),
      processingFee: Math.round(paymentData.amount * 0.029 * 100) / 100, // 2.9% processing fee
      netAmount: paymentData.amount - (Math.round(paymentData.amount * 0.029 * 100) / 100)
    };

    paymentHistory.push(payment);
    return { ...payment };
  },

  async getPaymentHistory(residentId) {
    await delay(200);
    if (!Number.isInteger(residentId)) {
      throw new Error("Invalid resident ID");
    }
    
    return paymentHistory
      .filter(payment => payment.residentId === residentId)
      .sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt));
  },

  async getPaymentById(id) {
    await delay(150);
    const payment = paymentHistory.find(p => p.Id === parseInt(id));
    if (!payment) {
      throw new Error("Payment not found");
    }
    return { ...payment };
  },

  async getAllPayments() {
    await delay(300);
    return [...paymentHistory].sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt));
  },

  async refundPayment(paymentId, refundAmount) {
    await delay(1500);
    const payment = paymentHistory.find(p => p.Id === parseInt(paymentId));
    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "completed") {
      throw new Error("Can only refund completed payments");
    }

    const refundData = {
      Id: nextPaymentId++,
      residentId: payment.residentId,
      amount: -Math.abs(refundAmount),
      paymentMethod: payment.paymentMethod,
      description: `Refund for payment ${payment.transactionId}`,
      details: { ...payment.details, refundReason: "Requested refund" },
      transactionId: `RFD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "completed",
      processedAt: new Date().toISOString(),
      processingFee: 0,
      netAmount: -Math.abs(refundAmount),
      originalPaymentId: payment.Id
    };

    paymentHistory.push(refundData);
    return { ...refundData };
  },

  async getPaymentStats(residentId) {
    await delay(250);
    const payments = residentId 
      ? paymentHistory.filter(p => p.residentId === residentId)
      : paymentHistory;

    const totalPaid = payments
      .filter(p => p.amount > 0)
      .reduce((sum, p) => sum + p.amount, 0);

    const totalRefunded = payments
      .filter(p => p.amount < 0)
      .reduce((sum, p) => sum + Math.abs(p.amount), 0);

    const paymentCount = payments.filter(p => p.amount > 0).length;
    const refundCount = payments.filter(p => p.amount < 0).length;

    return {
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalRefunded: Math.round(totalRefunded * 100) / 100,
      netAmount: Math.round((totalPaid - totalRefunded) * 100) / 100,
      paymentCount,
      refundCount,
      lastPaymentDate: payments.length > 0 ? payments[0].processedAt : null
    };
  }
};