// src/components/IDCard.tsx
"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { UserData, getStaffType } from "@/types";

interface IDCardProps {
  userData: UserData;
}

const IDCard = forwardRef<HTMLDivElement, IDCardProps>(({ userData }, ref) => {
  // Derived fields from role (matches test_1 behavior)
  const roleCode = (userData.role || "PCA").toUpperCase();
  const staffType = getStaffType(userData.role || "");

  return (
    <div
      ref={ref}
      // Match test_1 sizing while keeping your clean UI
      className="relative w-[350px] h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden border"
      style={{
        borderColor: "#e5e7eb",
        fontFamily:
          "Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Decorative corner accents (subtle, like test_1) */}
      <div className="absolute left-0 bottom-0 w-24 h-3 bg-purple-900/90 rounded-tr-xl" />
      <div className="absolute right-0 bottom-0 w-24 h-3 bg-purple-600/90 rounded-tl-xl" />

      {/* Canvas padding */}
      <div className="flex h-full flex-col items-center px-7 pt-6 pb-7">
        {/* Logo (keep PNG) */}
        <div className="w-full flex justify-center mb-1">
          {/* Use <img> to avoid html2canvas/next-image CORS quirks */}
          <img
            src="/image.png"
            alt="Axzons HomeCare Logo"
            style={{ height: 72, width: "auto" }}
            crossOrigin="anonymous"
            loading="eager"
          />
        </div>

        {/* Photo frame */}
        <div className="mt-3 mb-5 w-[118px] h-[118px] rounded-xl overflow-hidden border-2 shadow-md border-gray-200 bg-gray-100 grid place-items-center">
          {userData.photo ? (
            <Image
              src={URL.createObjectURL(userData.photo)}
              alt="Staff Photo"
              width={118}
              height={118}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[12px] tracking-wide text-gray-500">
              PHOTO
            </span>
          )}
        </div>

        {/* Name */}
        <div
          className="text-center font-extrabold tracking-wide uppercase"
          style={{ color: "#5b21b6", fontSize: 18, lineHeight: "22px" }}
        >
          {userData.name ? userData.name : "EMPLOYEE NAME"}
        </div>

        {/* Role (PCA/HHA/RN) */}
        <div
          className="mt-1 text-center font-extrabold uppercase"
          style={{ color: "#5b21b6", fontSize: 16 }}
        >
          {roleCode}
        </div>

        {/* Staff Type (derived from role, like test_1) */}
        <div
          className="mt-1 text-center font-semibold uppercase"
          style={{ color: "#6b7280", fontSize: 12 }}
        >
          {staffType || "NON-MEDICAL STAFF"}
        </div>

        {/* Divider (green line) */}
        <div
          className="mt-5 mb-5 h-[2px] w-[92%] rounded"
          style={{ backgroundColor: "#16a34a", opacity: 0.7 }}
        />

        {/* Contact block */}
        <div className="text-center leading-relaxed">
          <div
            className="text-[11px] font-extrabold uppercase tracking-wide"
            style={{ color: "#0f172a" }}
          >
            70 EAST SUNRISE HIGHWAY,
          </div>
          <div
            className="text-[11px] font-extrabold uppercase tracking-wide -mt-0.5"
            style={{ color: "#0f172a" }}
          >
            SUITE 500 VALLEY STREAM, NY 11581
          </div>

          <div
            className="mt-3 text-[18px] font-extrabold tracking-wide"
            style={{ color: "#1d4ed8", letterSpacing: "0.5px" }}
          >
            866-429-9667
          </div>

          <div
            className="mt-2 text-[12px] font-semibold lowercase tracking-wide"
            style={{ color: "#1f2937" }}
          >
            www.axzonshomecare.com
          </div>
        </div>
      </div>
    </div>
  );
});

IDCard.displayName = "IDCard";

export default IDCard;
