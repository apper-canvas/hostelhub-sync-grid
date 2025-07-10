import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  const handleExportData = () => {
    toast.info("Exporting data...");
  };

  const handleImportData = () => {
    toast.info("Import data functionality");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your hostel configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hostel Information */}
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Hostel Information</h3>
            <ApperIcon name="Building" className="w-5 h-5 text-primary" />
          </div>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <FormField
              label="Hostel Name"
              id="hostelName"
              placeholder="Enter hostel name"
              defaultValue="HostelHub Downtown"
            />
            <FormField
              label="Address"
              id="address"
              placeholder="Enter hostel address"
              defaultValue="123 Main Street, City, State 12345"
            />
            <FormField
              label="Phone Number"
              id="phone"
              placeholder="Enter phone number"
              defaultValue="+1 (555) 123-4567"
            />
            <FormField
              label="Email"
              id="email"
              type="email"
              placeholder="Enter email address"
              defaultValue="info@hostelhub.com"
            />
            <Button type="submit" variant="primary" className="w-full">
              Save Information
            </Button>
          </form>
        </Card>

        {/* Pricing Configuration */}
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Default Pricing</h3>
            <ApperIcon name="DollarSign" className="w-5 h-5 text-success" />
          </div>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <FormField
              label="Dormitory Bed (per night)"
              id="dormPrice"
              type="number"
              placeholder="Enter price"
              defaultValue="25"
            />
            <FormField
              label="Private Room (per night)"
              id="privatePrice"
              type="number"
              placeholder="Enter price"
              defaultValue="45"
            />
            <FormField
              label="Weekly Discount (%)"
              id="weeklyDiscount"
              type="number"
              placeholder="Enter percentage"
              defaultValue="10"
            />
            <FormField
              label="Monthly Discount (%)"
              id="monthlyDiscount"
              type="number"
              placeholder="Enter percentage"
              defaultValue="20"
            />
            <Button type="submit" variant="primary" className="w-full">
              Save Pricing
            </Button>
          </form>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <ApperIcon name="Bell" className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive booking and payment updates</p>
              </div>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Check" className="w-4 h-4 text-success" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Get urgent alerts via SMS</p>
              </div>
              <Button variant="ghost" size="sm">
                <ApperIcon name="X" className="w-4 h-4 text-error" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Payment Reminders</p>
                <p className="text-sm text-gray-500">Automatic payment reminders</p>
              </div>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Check" className="w-4 h-4 text-success" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
            <ApperIcon name="Database" className="w-5 h-5 text-secondary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">Download all hostel data</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleExportData}>
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Import Data</p>
                <p className="text-sm text-gray-500">Upload data from file</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleImportData}>
                <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Backup Data</p>
                <p className="text-sm text-gray-500">Create system backup</p>
              </div>
              <Button variant="warning" size="sm">
                <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
                Backup
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
          <ApperIcon name="Info" className="w-5 h-5 text-info" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Version</p>
            <p className="text-lg font-semibold text-gray-900">v1.0.0</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Last Backup</p>
            <p className="text-lg font-semibold text-gray-900">Today</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Storage Used</p>
            <p className="text-lg font-semibold text-gray-900">2.4 GB</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;