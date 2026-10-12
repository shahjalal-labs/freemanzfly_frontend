"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMyProfileQuery, useUpdateProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { useState } from "react";

export function MyProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const { data: myProfileData } = useGetMyProfileQuery({});
  console.log("myProfileData", myProfileData);

  const userInfo = myProfileData?.result;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleSave = async () => {
    try {
      const [firstName, ...lastNameArr] = formData.fullName.trim().split(" ");
      const lastName = lastNameArr.join(" ");

      const updateData = {
        firstName: firstName || "",
        lastName: lastName || "",
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      await updateProfile(updateData).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset form data if needed
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-semibold text-primary">
            Personal Information
          </h1>
          <span className="text-primary">|</span>
          <span className="text-primary">Edit</span>
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

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-6 bg-transparent rounded-[40px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-6 py-6 bg-primary  text-white rounded-[40px]"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6 bg-white border border-[#ADADAD40] shadow-sm rounded-[16px] p-8">
        <h1 className="text-2xl font-semibold text-primary">
          Personal Information
        </h1>
        <Button
          onClick={() => {
            setFormData({
              fullName: userInfo?.firstName || userInfo?.lastName ? `${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`.trim() : "",
              email: userInfo?.email || "",
              phone: userInfo?.phone || "",
              address: userInfo?.address || "",
            });
            setIsEditing(true);
          }}
          variant="outline"
          className="text-primary border-primary hover:bg-primary/10"
        >
          Edit
        </Button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-500">
              Full Name
            </Label>
            <p className="text-gray-900 mt-1">
              {userInfo?.firstName || "N/A"} {userInfo?.lastName || "N/A"}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">
              Email Address
            </Label>
            <p className="text-gray-900 mt-1">{userInfo?.email || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">
              Phone Number
            </Label>
            <p className="text-gray-900 mt-1">{userInfo?.phone || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Address</Label>
            <p className="text-gray-900 mt-1">{userInfo?.address || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
