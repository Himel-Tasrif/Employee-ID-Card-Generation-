// src/components/UserForm.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, User, Briefcase } from "lucide-react";
import { UserData, getStaffType } from "@/types";
import PhotoProcessor from "./PhotoProcessor";
import RemoveBGModal from "./RemoveBgModal"; // 👈 NEW

interface UserFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export default function UserForm({ userData, setUserData }: UserFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [processorOpen, setProcessorOpen] = useState(false);
  const [removeBgOpen, setRemoveBgOpen] = useState(false); // 👈 NEW
  const fileInputRef = useRef<HTMLInputElement>(null);

  // keep preview in sync when userData.photo changes (e.g., after processing)
  useEffect(() => {
    if (userData.photo) {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(userData.photo);
    } else {
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [userData.photo]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserData({ ...userData, photo: file });

      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, name: event.target.value });
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserData({ ...userData, role: event.target.value as UserData["role"] });
  };

  return (
    <div className="space-y-6">
      {/* 1) Employee Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Employee Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="name"
            value={userData.name}
            onChange={handleNameChange}
            placeholder="Enter employee full name"
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 2) Profile Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo
        </label>

        <div className="space-y-4">
          {/* Upload button / drop area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </div>

          {/* Preview + clear */}
          {photoPreview && (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Profile preview"
                className="w-24 h-24 object-cover rounded-lg mx-auto border-2 border-gray-200"
              />
              <button
                onClick={() => {
                  setUserData({ ...userData, photo: null });
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          {/* Actions row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-gray-500">
              Use “Process Photo” for phone snapshots.
            </div>

            <div className="flex gap-2">
              {/* Your existing JS-based processor */}
              <button
                type="button"
                onClick={() => setProcessorOpen(true)}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Process Photo
              </button>

              {/* NEW: open the Flask remover UI in a modal */}
              <button
                type="button"
                onClick={() => setRemoveBgOpen(true)}
                className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-black"
                title="Open Python remover (Flask) in a modal"
              >
                Remove Background
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3) Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Briefcase className="inline w-4 h-4 mr-2" />
          Role Selection
        </label>
        <select
          value={userData.role || ""}
          onChange={handleRoleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
        >
          <option value="">Select a role</option>
          <option value="PCA">PCA - Personal Care Assistant</option>
          <option value="HHA">HHA - Home Health Aide</option>
          <option value="RN">RN - Registered Nurse</option>
        </select>

        {/* Conditional staff-type label */}
        {userData.role && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-gray-700">
              Staff Type:&nbsp;
              <span className="font-semibold">{getStaffType(userData.role)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <PhotoProcessor
        open={processorOpen}
        onClose={() => setProcessorOpen(false)}
        initialFile={userData.photo || null}
        onApply={(f) => setUserData({ ...userData, photo: f })}
      />

      <RemoveBGModal
        open={removeBgOpen}
        onClose={() => setRemoveBgOpen(false)}
      />
    </div>
  );
}
