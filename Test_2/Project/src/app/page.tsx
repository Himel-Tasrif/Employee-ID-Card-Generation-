// src/app/page.tsx
"use client";

import { useState } from "react";
import { Upload, User, CreditCard, Palette } from "lucide-react";
import IDCardPreview from "@/components/IDCardPreview";
import UserForm from "@/components/UserForm";
import { UserData } from "@/types";

export default function Home() {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    photo: null,
    role: "",         // NEW
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ID Card Maker
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Palette className="w-4 h-4" />
              <span>Professional ID Cards</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* User Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>
              <UserForm userData={userData} setUserData={setUserData} />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Preview & Download
              </h2>
            </div>
            <IDCardPreview userData={userData} />
          </div>
        </div>
      </main>
    </div>
  );
}
