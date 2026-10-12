/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type React from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useDeleteShippingAddressMutation,
  useEditShippingAddressMutation,
  useGetMyShippingAddressQuery,
  useStoreShippingAddressMutation,
} from "@/redux/api/shippingApi";
import {
  CreditCard,
  Edit,
  Loader2,
  Plus,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import StripeCheckoutForm from "./StripeCheckoutForm";

interface ShippingAddress {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

interface CheckoutFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_LIVE_KEY || ''
);

export function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [shippingMethod, setShippingMethod] = useState("cash");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const { data: myShippingAddressData, refetch: refetchAddresses } =
    useGetMyShippingAddressQuery({});
  const shippingAddresses = myShippingAddressData?.result || [];

  // Add shipping address mutation
  const [addShippingAddressFn, { isLoading: isAddingAddress }] =
    useStoreShippingAddressMutation();

  // Edit shipping address mutation
  const [editShippingAddressFn, { isLoading: isEditingAddress }] =
    useEditShippingAddressMutation();

  // Delete shipping address mutation
  const [deleteShippingAddressFn, { isLoading: isDeletingAddress }] =
    useDeleteShippingAddressMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // FIX: Prevent default form submission for card payments
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    // For cash on delivery, proceed with normal form submission
    if (shippingMethod === "cash") {
      const selectedAddress = shippingAddresses.find(
        (addr: ShippingAddress) => addr.id === selectedAddressId
      );

      const formData = {
        shippingMethod,
        selectedAddress,
        shippingAddressId: selectedAddressId,
      };

      await onSubmit(formData);
    }
    // For card payments, we don't submit the form here - StripeCheckoutForm handles it
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleEditAddress = (address: ShippingAddress) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
    });
    setIsEditMode(true);
    setIsAddressModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    });
    setIsEditMode(false);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      const bodyData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
      };

      if (isEditMode && editingAddress) {
        // Edit existing address
        const response = await editShippingAddressFn({
          id: editingAddress.id,
          data: bodyData,
        }).unwrap();

        if (response?.success) {
          toast.success("Address updated successfully");
        }
      } else {
        // Add new address
        const response = await addShippingAddressFn(bodyData).unwrap();
        if (response?.success) {
          toast.success("Address added successfully");
        }
      }

      // Refresh addresses list
      await refetchAddresses();

      // Close modal and reset state
      setIsAddressModalOpen(false);
      setIsEditMode(false);
      setEditingAddress(null);

      // Reset form data
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleDeleteAddress = async (
    addressId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const Swal = await import("sweetalert2").then((module) => module.default);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg",
        cancelButton: "bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteShippingAddressFn(addressId).unwrap();

        await Swal.fire({
          title: "Deleted!",
          text: "Your address has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          customClass: {
            popup: "rounded-2xl",
            confirmButton:
              "bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg",
          },
        });

        console.log("Address deleted successfully");

        // Refresh addresses list
        await refetchAddresses();

        // If the deleted address was selected, clear the selection
        if (selectedAddressId === addressId) {
          setSelectedAddressId("");
        }
      } catch (error) {
        console.error("Error deleting address:", error);

        await Swal.fire({
          title: "Error!",
          text: "Failed to delete address. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg",
          },
        });
      }
    }
  };

  // FIX: Handle payment success from StripeCheckoutForm
  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log("[v0] Payment successful:", paymentIntent);

    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    // Prepare form data for online payment
    const selectedAddress = shippingAddresses.find(
      (addr: ShippingAddress) => addr.id === selectedAddressId
    );

    const formData = {
      shippingMethod: "card",
      selectedAddress,
      shippingAddressId: selectedAddressId,
      paymentIntent: paymentIntent,
    };

    // Call the onSubmit function with the complete data
    onSubmit(formData);
  };

  const handlePaymentError = (error: any) => {
    console.log("[v0] Payment error:", error);
    toast.error("Payment failed. Please try again.");
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      {/* Delivery Information */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-[32px] font-semibold text-foreground">
            Shipping Address
          </h2>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddNewAddress}
            className="flex items-center gap-2 bg-transparent"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        </div>

        {/* Address Modal */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isEditMode
                    ? "Edit Shipping Address"
                    : "Add New Shipping Address"}
                </h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="modal-fullName"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Full name
                    </Label>
                    <input
                      id="modal-fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="modal-email"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Email Address
                    </Label>
                    <input
                      id="modal-email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="modal-phone"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Phone Number
                  </Label>
                  <input
                    id="modal-phone"
                    placeholder="+1-202-555-0185"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="modal-address"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Address
                  </Label>
                  <input
                    id="modal-address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="modal-country"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Country
                    </Label>
                    <input
                      id="modal-country"
                      placeholder="United States"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="modal-city"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      City
                    </Label>
                    <input
                      id="modal-city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="modal-state"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      State
                    </Label>
                    <input
                      id="modal-state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="modal-zipCode"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Zip Code
                    </Label>
                    <input
                      id="modal-zipCode"
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                  disabled={isAddingAddress || isEditingAddress}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveAddress}
                  className="px-6 py-2 bg-primary text-white hover:bg-primary/90"
                  disabled={isAddingAddress || isEditingAddress}
                >
                  {isAddingAddress || isEditingAddress
                    ? "Saving..."
                    : isEditMode
                    ? "Update Address"
                    : "Save Address"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shippingAddresses?.map((address: ShippingAddress) => (
            <Card
              key={address.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedAddressId === address.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleAddressSelect(address.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {address.fullName}
                    </h3>
                    {selectedAddressId === address.id && (
                      <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="h-8 w-8 p-0 hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteAddress(address.id, e)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      disabled={isDeletingAddress}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                  <p>{address.email}</p>
                  <p>{address.phone}</p>
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.zipCode}
                  </p>
                  <p>{address.state} </p>
                  <p>{address.country}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {shippingAddresses?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No shipping addresses found. Please add a new address.</p>
          </div>
        )}
      </div>

      {/* Shipping Method */}
      <div>
        <h2 className="text-xl font-semibold text-default mb-6">
          Shipping method
        </h2>

        <RadioGroup
          value={shippingMethod}
          onValueChange={setShippingMethod}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            className={`border-2 rounded-2xl p-4 cursor-pointer transition-colors ${
              shippingMethod === "cash" ? "border-primary " : "border-[#FBFBFB]"
            }`}
          >
            <RadioGroupItem value="cash" id="cash" className="sr-only" />
            <label htmlFor="cash" className="cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-default">
                  Cash on Delivery
                </span>
                {shippingMethod === "cash" && (
                  <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Delivery staff to your door, you give money according to the
                value of the application and delivery fees.
              </p>
            </label>
          </div>

          <div
            className={`border-2 rounded-2xl p-4 cursor-pointer transition-colors ${
              shippingMethod === "card" ? "border-primary " : "border-[#FBFBFB]"
            }`}
          >
            <RadioGroupItem value="card" id="card" className="sr-only" />
            <label htmlFor="card" className="cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-default">Pay with Card</span>
                {shippingMethod === "card" && (
                  <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                FreemanZ will call you back to confirm the order. After
                confirmation, FreemanZ will proceed to pick up, pack...
              </p>
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Payment Details - Only show if card is selected */}
      {shippingMethod === "card" && (
        <div>
          <h2 className="text-xl font-semibold text-default mb-6">
            Payment details
          </h2>

          <Elements stripe={stripePromise}>
            <StripeCheckoutForm
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </Elements>
        </div>
      )}

      {/* FIX: Only show the submit button for cash on delivery */}
      {shippingMethod === "cash" && (
        <div>
          <button
            type="submit"
            disabled={!selectedAddressId || isLoading}
            className="bg-primary text-center w-full py-4 rounded-[100px] text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-1">
                <Loader2 className="animate-spin" size={25} />
                Placing Order...
              </div>
            ) : selectedAddressId ? (
              "Place Order"
            ) : (
              "Please select an address"
            )}
          </button>
        </div>
      )}
    </form>
  );
}
