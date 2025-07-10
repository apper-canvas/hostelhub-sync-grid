import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ 
  isOpen, 
  onClose, 
  className 
}) => {
  const menuItems = [
    { name: "Dashboard", icon: "Home", path: "/" },
    { name: "Rooms", icon: "Bed", path: "/rooms" },
    { name: "Residents", icon: "Users", path: "/residents" },
    { name: "Bookings", icon: "Calendar", path: "/bookings" },
    { name: "Settings", icon: "Settings", path: "/settings" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block fixed left-0 top-0 h-full w-64 bg-surface border-r border-gray-200/50 z-40",
        className
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
              <ApperIcon name="Building" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">HostelHub</h2>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "sidebar-link",
                    isActive && "active"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-64 bg-surface border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                    <ApperIcon name="Building" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">HostelHub</h2>
                    <p className="text-sm text-gray-600">Management System</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "sidebar-link",
                        isActive && "active"
                      )
                    }
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;