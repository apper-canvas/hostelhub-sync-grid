import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PaymentForm = ({ 
  resident, 
  onPaymentSuccess, 
  onCancel, 
  className 
}) => {
  const [selectedMethod, setSelectedMethod] = useState("credit_card");
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
    digitalWalletId: "",
    description: "Monthly hostel fees"
  });
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { id: "credit_card", name: "Credit Card", icon: "CreditCard" },
    { id: "debit_card", name: "Debit Card", icon: "CreditCard" },
    { id: "bank_transfer", name: "Bank Transfer", icon: "Building" },
    { id: "digital_wallet", name: "Digital Wallet", icon: "Wallet" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (selectedMethod === "credit_card" || selectedMethod === "debit_card") {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = "Please enter a valid card number";
      }
      if (!formData.expiryDate || formData.expiryDate.length < 5) {
        newErrors.expiryDate = "Please enter a valid expiry date";
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = "Please enter a valid CVV";
      }
      if (!formData.cardHolderName.trim()) {
        newErrors.cardHolderName = "Please enter cardholder name";
      }
    }

    if (selectedMethod === "bank_transfer") {
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Please enter account number";
      }
      if (!formData.routingNumber.trim()) {
        newErrors.routingNumber = "Please enter routing number";
      }
      if (!formData.accountHolderName.trim()) {
        newErrors.accountHolderName = "Please enter account holder name";
      }
    }

    if (selectedMethod === "digital_wallet") {
      if (!formData.digitalWalletId.trim()) {
        newErrors.digitalWalletId = "Please enter wallet ID";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    
    try {
      const paymentData = {
        residentId: resident.Id,
        amount: parseFloat(formData.amount),
        paymentMethod: selectedMethod,
        description: formData.description,
        details: getPaymentDetails()
      };

      await onPaymentSuccess(paymentData);
    } catch (error) {
      console.error("Payment processing error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentDetails = () => {
    switch (selectedMethod) {
      case "credit_card":
      case "debit_card":
        return {
          cardNumber: "**** **** **** " + formData.cardNumber.slice(-4),
          cardHolderName: formData.cardHolderName,
          type: selectedMethod
        };
      case "bank_transfer":
        return {
          accountNumber: "**** **** " + formData.accountNumber.slice(-4),
          accountHolderName: formData.accountHolderName,
          routingNumber: formData.routingNumber
        };
      case "digital_wallet":
        return {
          walletId: formData.digitalWalletId,
          type: "digital_wallet"
        };
      default:
        return {};
    }
  };

  return (
    <Card className={cn("max-w-2xl mx-auto", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment Form</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ApperIcon name="User" className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{resident.name}</p>
                <p className="text-sm text-gray-600">Room {resident.roomId} - Bed {resident.bedNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Amount */}
          <div>
            <Label htmlFor="amount">Payment Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              error={errors.amount}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Payment Method Selection */}
          <div>
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "p-3 border rounded-lg flex items-center gap-3 transition-colors",
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <ApperIcon name={method.icon} className="w-5 h-5" />
                  <span className="text-sm font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Details */}
          {(selectedMethod === "credit_card" || selectedMethod === "debit_card") && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardHolderName">Cardholder Name</Label>
                <Input
                  id="cardHolderName"
                  placeholder="John Doe"
                  value={formData.cardHolderName}
                  onChange={(e) => handleInputChange("cardHolderName", e.target.value)}
                />
                {errors.cardHolderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardHolderName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength="4"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedMethod === "bank_transfer" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  placeholder="John Doe"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                />
                {errors.accountHolderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="1234567890"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  placeholder="123456789"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                />
                {errors.routingNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.routingNumber}</p>
                )}
              </div>
            </div>
          )}

          {selectedMethod === "digital_wallet" && (
            <div>
              <Label htmlFor="digitalWalletId">Digital Wallet ID</Label>
              <Input
                id="digitalWalletId"
                placeholder="user@wallet.com"
                value={formData.digitalWalletId}
                onChange={(e) => handleInputChange("digitalWalletId", e.target.value)}
              />
              {errors.digitalWalletId && (
                <p className="mt-1 text-sm text-red-600">{errors.digitalWalletId}</p>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Payment description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={processing}
              className="flex-1"
            >
              {processing ? (
                <>
                  <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                  Process Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PaymentForm;