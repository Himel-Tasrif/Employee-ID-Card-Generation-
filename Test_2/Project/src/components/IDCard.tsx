"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { UserData, getStaffType } from "@/types";

interface IDCardProps {
  userData: UserData;
}

const IDCard = forwardRef<HTMLDivElement, IDCardProps>(({ userData }, ref) => {
  // Display values with placeholders when empty
  const nameText = userData.name?.trim() ? userData.name : "EMPLOYEE NAME";
  const roleText = userData.role ? userData.role.toUpperCase() : "ROLE";
  const staffTypeText = userData.role ? getStaffType(userData.role) : "STAFF TYPE";

  return (
    <div
      ref={ref}
      className="relative w-[350px] h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200"
      style={{
        fontFamily: "Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        background: "linear-gradient(to bottom, #f9fafb, #ffffff, #f9fafb)",
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235b21b6' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16">
        <div className="absolute top-0 left-0 w-10 h-1 bg-purple-700 rounded-r"></div>
        <div className="absolute top-0 left-0 w-1 h-10 bg-purple-700 rounded-b"></div>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16">
        <div className="absolute top-0 right-0 w-10 h-1 bg-purple-700 rounded-l"></div>
        <div className="absolute top-0 right-0 w-1 h-10 bg-purple-700 rounded-b"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-16 h-16">
        <div className="absolute bottom-0 left-0 w-10 h-1 bg-purple-700 rounded-r"></div>
        <div className="absolute bottom-0 left-0 w-1 h-10 bg-purple-700 rounded-t"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16">
        <div className="absolute bottom-0 right-0 w-10 h-1 bg-purple-700 rounded-l"></div>
        <div className="absolute bottom-0 right-0 w-1 h-10 bg-purple-700 rounded-t"></div>
      </div>

      {/* Header stripe */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-purple-700 to-purple-500"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-7 pt-10 pb-7">
        {/* Logo */}
        <div className="w-full flex justify-center mb-6">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <img
              src="/image.png"
              alt="Axzons HomeCare Logo"
              style={{ height: 68, width: "auto" }}
              crossOrigin="anonymous"
              loading="eager"
            />
          </div>
        </div>

        {/* ID Card label */}
        <div className="mb-4 px-4 py-1 bg-purple-100 rounded-full">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
            STAFF IDENTIFICATION CARD
          </span>
        </div>

        {/* Photo frame with improved styling */}
        <div className="relative mb-6 w-[132px] h-[132px] rounded-xl overflow-hidden border-2 border-white shadow-lg bg-gray-100 grid place-items-center">
          {userData.photo ? (
            <Image
              src={URL.createObjectURL(userData.photo)}
              alt="Staff Photo"
              width={132}
              height={132}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs tracking-wide text-gray-500 font-medium">PHOTO</span>
          )}
          {/* Decorative frame border */}
          <div className="absolute inset-0 border border-gray-300 rounded-xl pointer-events-none"></div>
        </div>

        {/* Name with improved styling */}
        <div
          className="text-center font-bold tracking-wide uppercase px-4 py-2 bg-purple-50 rounded-lg w-full"
          style={{ color: "#5b21b6", fontSize: 18, lineHeight: "22px" }}
        >
          {nameText}
        </div>

        {/* Role with improved styling */}
        <div
          className="mt-3 text-center font-bold uppercase bg-gray-100 px-3 py-1 rounded-md w-4/5"
          style={{ color: "#374151", fontSize: 15 }}
        >
          {roleText}
        </div>

        {/* Staff Type with improved styling */}
        <div
          className="mt-2 text-center font-semibold uppercase border border-gray-300 px-3 py-1 rounded-md w-3/5"
          style={{ color: "#6b7280", fontSize: 11 }}
        >
          {staffTypeText}
        </div>

        {/* Divider with improved styling */}
        <div
          className="mt-6 mb-5 h-1 w-[85%] rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #8b5cf6, #84cc16, #22c55e, #8b5cf6, transparent)",
          }}
        />

        {/* Contact block with improved styling */}
        <div className="text-center leading-relaxed w-full">
          <div className="mb-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Corporate Office
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <div
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{ color: "#0f172a" }}
            >
              70 EAST SUNRISE HIGHWAY,
            </div>
            <div
              className="text-[11px] font-bold uppercase tracking-wide -mt-0.5"
              style={{ color: "#0f172a" }}
            >
              SUITE 500 VALLEY STREAM, NY 11581
            </div>

            <div
              className="mt-3 text-[17px] font-bold tracking-wide"
              style={{ color: "#1d4ed8", letterSpacing: "0.5px" }}
            >
              866-429-9667
            </div>

            <div
              className="mt-2 text-[11px] font-semibold lowercase tracking-wide"
              style={{ color: "#1f2937" }}
            >
              www.axzonshomecare.com
            </div>
          </div>
        </div>

        {/* Footer with ID note */}
        <div className="mt-4 text-[9px] text-gray-500 text-center">
          This card is property of Axzons HomeCare and must be returned upon termination
        </div>
      </div>
    </div>
  );
});

IDCard.displayName = "IDCard";
export default IDCard;