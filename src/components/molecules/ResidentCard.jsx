import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const ResidentCard = ({
resident,
onViewProfile,
onCheckOut,
onPayFees,
  className
}) => {
const getStatusColor = (status) => {
switch (status) {
case "paid":
return "success";
case "pending":
return "warning";
case "overdue":
return "error";
default:
return "secondary";
}
};
return (
<Card className={cn("hover:shadow-md transition-shadow", className)}>
<div className="flex items-start justify-between mb-4">
<div className="flex items-start gap-3">
<div className="bg-gray-100 rounded-full p-2">
<ApperIcon name="User" className="w-5 h-5 text-gray-600" />
</div>
<div>
<h3 className="font-semibold text-gray-900">{resident.name}</h3>
<p className="text-sm text-gray-600">{resident.email}</p>
</div>
</div>
<Badge variant={getStatusColor(resident.paymentStatus)}>
{resident.paymentStatus}
</Badge>
</div>
<div className="space-y-2 mb-4">
<div className="flex items-center gap-2 text-sm text-gray-600">
<ApperIcon name="MapPin" className="w-4 h-4" />
<span>Room {resident.roomId} - Bed {resident.bedNumber}</span>
</div>
<div className="flex items-center gap-2 text-sm text-gray-600">
<ApperIcon name="Phone" className="w-4 h-4" />
<span>{resident.phone}</span>
</div>
<div className="flex items-center gap-2 text-sm text-gray-600">
<ApperIcon name="Calendar" className="w-4 h-4" />
<span>Check-out: {new Date(resident.checkOutDate).toLocaleDateString()}</span>
</div>
</div>
<div className="flex gap-2 pt-4 border-t border-gray-100">
<Button
variant="ghost"
size="sm"
onClick={() => onViewProfile(resident)}
className="flex-1"
>
<ApperIcon name="Eye" className="w-4 h-4 mr-1" />
View
</Button>
<Button
variant="primary"
size="sm"
onClick={() => onPayFees(resident)}
className="flex-1"
>
<ApperIcon name="CreditCard" className="w-4 h-4 mr-1" />
Pay Fees
</Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCheckOut(resident)}
          className="flex-1"
        >
          <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />
          Check Out
        </Button>
</div>
      </Card>
    );
  };
  export default ResidentCard;