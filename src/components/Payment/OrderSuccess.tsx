"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Home, User } from "lucide-react";

interface OrderSuccessProps {
  onGoHome?: () => void;
  onGoToProfile?: () => void;
}

export function OrderSuccess({ onGoHome, onGoToProfile }: OrderSuccessProps) {
  return (
    <div className="pt-60 pb-16  flex items-center justify-center p-4 ">
      <div className="w-full max-w-xl text-center space-y-8 bg-gray-50 shadow-sm p-10 rounded-xl">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
           Your cash on delivery order has been placed successfully!
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-3 text-white">
          <Button onClick={onGoHome} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={onGoToProfile}
            className="w-full bg-transparent text-default"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
