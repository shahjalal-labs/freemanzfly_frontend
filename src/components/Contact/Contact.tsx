"use client";

import contactImage from "@/assets/conatactImage.png";
import { useSendContactMutation } from "@/redux/api/userApi";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [sendContactMailFn, { isLoading }] = useSendContactMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const bodyData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      message: formData.message,
    };
    try {
      const response = await sendContactMailFn(bodyData).unwrap();
      if (response?.success) {
        toast.success("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      }
    } catch {
      // console.error("Error sending contact message:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className=" pt-72 pb-28">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl  overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Image and Contact Info */}
            <div className="relative ">
              {/* Customer Service Representative Image */}
              <div className=" rounded-2xl overflow-hidden mb-4 ">
                <Image
                  src={contactImage}
                  alt="Customer service representative"
                  className="w-full h-full object-cover"
                  width={400}
                  height={200}
                />
              </div>
              {/* Contact Information */}
              <address className="space-y-6 border border-[#E2E8F0] rounded-2xl p-6 not-italic">
                {/* Address */}
                <div className="flex items-center space-x-4 ">
                  <div className="flex-shrink-0 w-14 h-14 border border-primary rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium leading-relaxed">
                      3030 Greenmount Ave.STE, 300#666887 Baltimore, Maryland
                    </p>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-14 h-14 border border-primary rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <a href="tel:4432260693" className="text-gray-800 font-medium hover:text-primary transition-colors">(443) 226-0693</a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-14 h-14 border border-primary rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <a href="mailto:freemanzlf@gmail.com" className="text-gray-800 font-medium hover:text-primary transition-colors">
                      freemanzlf@gmail.com
                    </a>
                  </div>
                </div>
              </address>
            </div>

            {/* Right Side - Contact Form */}
            <div className="p-6 border border-[#E2E8F0] rounded-2xl">
              <div className="max-w-[600px] mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Get in touch
                </h2>
                <p className="text-gray-600 mb-8">
                  Our friendly team would love to hear from you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Type here"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 placeholder-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Type here"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Type here"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Type here"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 placeholder-gray-400 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r  text-white font-semibold py-4 px-6 rounded-[40px] bg-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin" size={25} />
                        Sending..
                      </div>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
