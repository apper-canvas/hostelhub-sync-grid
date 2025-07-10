import React from "react";
import ResidentCard from "@/components/molecules/ResidentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const ResidentList = ({ 
  residents, 
  loading, 
  error, 
  onRetry, 
  onViewProfile, 
  onCheckOut, 
  className 
}) => {
  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry} 
        className={className} 
      />
    );
  }

  if (!residents || residents.length === 0) {
    return (
      <Empty
        title="No residents found"
        message="No current residents match your search criteria"
        actionLabel="Add Resident"
        icon="Users"
        className={className}
      />
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {residents.map((resident) => (
        <ResidentCard
          key={resident.Id}
          resident={resident}
          onViewProfile={onViewProfile}
          onCheckOut={onCheckOut}
        />
      ))}
    </div>
  );
};

export default ResidentList;