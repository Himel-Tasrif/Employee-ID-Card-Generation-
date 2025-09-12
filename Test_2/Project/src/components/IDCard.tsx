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
      className="relative w-[350px] h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden border"
      style={{
        borderColor: "#e5e7eb",
        fontFamily:
          "Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Decorative: soft vertical side lines */}
      <div
        className="absolute left-2 top-0 w-[3px] h-full rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(139,92,246,0.35), rgba(59,130,246,0.2), rgba(34,197,94,0.35))",
        }}
      />
      <div
        className="absolute right-2 top-0 w-[3px] h-full rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(34,197,94,0.35), rgba(59,130,246,0.2), rgba(139,92,246,0.35))",
        }}
      />

      {/* Decorative corner bars — TOP (new) */}
      <div className="absolute left-0 top-0 w-24 h-3 bg-purple-900/90 rounded-br-xl" />
      <div className="absolute right-0 top-0 w-24 h-3 bg-purple-600/90 rounded-bl-xl" />

      {/* Decorative corner bars — BOTTOM (kept) */}
      <div className="absolute left-0 bottom-0 w-24 h-3 bg-purple-900/90 rounded-tr-xl" />
      <div className="absolute right-0 bottom-0 w-24 h-3 bg-purple-600/90 rounded-tl-xl" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-7 pt-8 pb-7">
        {/* Logo (PNG) with breathing room */}
        <div className="w-full flex justify-center mb-4">
          <img
            src="/image.png"
            alt="Axzons HomeCare Logo"
            style={{ height: 72, width: "auto" }}
            crossOrigin="anonymous"
            loading="eager"
          />
        </div>

        {/* Photo frame */}
        <div className="mt-1 mb-6 w-[128px] h-[128px] rounded-xl overflow-hidden border-2 shadow-md border-gray-200 bg-gray-100 grid place-items-center">
          {userData.photo ? (
            <Image
              src={URL.createObjectURL(userData.photo)}
              alt="Staff Photo"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[12px] tracking-wide text-gray-500">PHOTO</span>
          )}
        </div>

        {/* Name */}
        <div
          className="text-center font-extrabold tracking-wide uppercase"
          style={{ color: "#5b21b6", fontSize: 18, lineHeight: "22px" }}
        >
          {nameText}
        </div>

        {/* Role */}
        <div
          className="mt-1 text-center font-extrabold uppercase"
          style={{ color: "#374151", fontSize: 16 }}
        >
          {roleText}
        </div>

        {/* Staff Type */}
        <div
          className="mt-1 text-center font-semibold uppercase"
          style={{ color: "#6b7280", fontSize: 12 }}
        >
          {staffTypeText}
        </div>

        {/* Divider */}
        <div
          className="mt-5 mb-5 h-[3px] w-[92%] rounded"
          style={{
            background:
              "linear-gradient(90deg, #8b5cf6, #84cc16, #22c55e, #8b5cf6)",
            opacity: 0.7,
          }}
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
