"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useEditShippingAddressMutation,
  useGetMyShippingAddressQuery,
  useStoreShippingAddressMutation,
} from "@/redux/api/shippingApi";
import { countries } from "@/utilities/countries";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ShippingAddressSection() {
  const { data: myShippingAddressData, isLoading: isAddressLoading } =
    useGetMyShippingAddressQuery({});
  console.log("My Shipping Address Data:", myShippingAddressData);
  const shippingAddress = myShippingAddressData?.result[0];
  const id = shippingAddress?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [storeShippingAddressFn, { isLoading }] =
    useStoreShippingAddressMutation();

  const [editShippingAddressFn, { isLoading: isEditLoading }] =
    useEditShippingAddressMutation();

  // Update formData when API data loads
  useEffect(() => {
    if (shippingAddress) {
      setFormData({
        fullName: shippingAddress?.fullName || "",
        email: shippingAddress?.email || "",
        phone: shippingAddress?.phone || "",
        address: shippingAddress?.address || "",
        country: shippingAddress?.country || "",
        city: shippingAddress?.city || "",
        state: shippingAddress?.state || "",
        zipCode: shippingAddress?.zipCode || "",
      });
    }
  }, [shippingAddress]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const bodyData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };

      let response;

      if (shippingAddress && id) {
        // Edit existing address
        response = await editShippingAddressFn({ id, data: bodyData }).unwrap();
      } else {
        // Add new address
        response = await storeShippingAddressFn(bodyData).unwrap();
      }

      if (response?.success) {
        toast.success(
          shippingAddress
            ? "Shipping address updated successfully!"
            : "Shipping address saved successfully!"
        );
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving shipping address:", error);
      toast.error(
        shippingAddress
          ? "Failed to update shipping address. Please try again later."
          : "Failed to save shipping address. Please try again later."
      );
    }
  };

  const handleCancel = () => {
    // Reset form data to original values when canceling
    if (shippingAddress) {
      setFormData({
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        country: shippingAddress.country,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
      });
    } else {
      // If no address exists, clear the form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
    setIsEditing(false);
  };

  // Show loading state while fetching data
  if (isAddressLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40] flex items-center justify-center">
        <Loader2 className="animate-spin mr-2" size={25} />
        Loading...
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-semibold text-primary">
            Shipping Address
          </h1>
          <span className="text-primary">|</span>
          <span className="text-primary">
            {shippingAddress ? "Edit" : "Add"}
          </span>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Full name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Full name"
                className="w-full py-6 rounded-xl"
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email Address"
                className="w-full py-6 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Phone Number"
              className="w-full py-6 rounded-xl"
            />
          </div>

          <div>
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Address"
              className="w-full py-6 rounded-xl"
            />
          </div>

          {/* Country & City Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country Dropdown */}
            <div className="relative">
              <Label
                htmlFor="country"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Country
              </Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full border border-gray-300 rounded-xl py-3 px-3 appearance-none focus:outline-none "
              >
                <option value="" disabled>
                  Select Country
                </option>
                {countries?.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>

            {/* City Input */}
            <div>
              <Label
                htmlFor="city"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="City"
                className="w-full py-6 rounded-xl"
              />
            </div>
          </div>

          {/* State & Zip Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="state"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="State"
                className="w-full py-6 rounded-xl"
              />
            </div>
            <div>
              <Label
                htmlFor="zipCode"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Zip Code
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                placeholder="Zip Code"
                className="w-full py-6 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading || isEditLoading}
              className="px-6 py-6 bg-transparent rounded-[40px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || isEditLoading}
              className="px-6 py-6 bg-primary text-white rounded-[40px] min-w-[140px] flex items-center justify-center gap-2"
            >
              {(isLoading || isEditLoading) ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  {shippingAddress ? "Updating..." : "Saving..."}
                </>
              ) : (
                shippingAddress ? "Update Address" : "Save Address"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 bg-white border border-[#ADADAD40] shadow-sm rounded-[16px] p-8">
        <h1 className="text-2xl font-semibold text-primary">
          Shipping Address
        </h1>
        <Button
          onClick={() => setIsEditing(true)}
          variant="outline"
          className="text-primary border-primary hover:bg-orange-50"
        >
          {shippingAddress ? "Edit" : "Add"}
        </Button>
      </div>

      {shippingAddress ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Full Name
                </Label>
                <p className="text-gray-900 mt-1">{formData.fullName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Email Address
                </Label>
                <p className="text-gray-900 mt-1">{formData.email}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Phone Number
              </Label>
              <p className="text-gray-900 mt-1">{formData.phone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Address
              </Label>
              <p className="text-gray-900 mt-1">{formData.address}</p>
            </div>

            {/* Country & City Row in view mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Country
                </Label>
                <p className="text-gray-900 mt-1">{formData.country}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  City
                </Label>
                <p className="text-gray-900 mt-1">{formData.city}</p>
              </div>
            </div>

            {/* State & Zip Code Row in view mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  State
                </Label>
                <p className="text-gray-900 mt-1">{formData.state}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Zip Code
                </Label>
                <p className="text-gray-900 mt-1">{formData.zipCode}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40] text-center py-12">
          <p className="text-gray-500">No shipping address added yet.</p>
          <Button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-primary text-white"
          >
            Add Shipping Address
          </Button>
        </div>
      )}
    </div>
  );
}