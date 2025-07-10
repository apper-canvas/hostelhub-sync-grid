import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "form-input",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;