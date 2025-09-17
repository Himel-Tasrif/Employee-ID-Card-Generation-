"use client";

import { forwardRef } from "react";
import { UserData, getStaffType } from "@/types";

interface IDCardProps {
  userData: UserData;
}

const PURPLE = "#5b21b6"; // same for name + phone
const DARK_TEXT = "#0f172a";

const IDCard = forwardRef<HTMLDivElement, IDCardProps>(({ userData }, ref) => {
  // Safe placeholders
  const nameText = userData.name?.trim() ? userData.name : "EMPLOYEE NAME";
  const roleText = userData.role ? userData.role.toUpperCase() : "ROLE";
  const staffTypeText = userData.role ? getStaffType(userData.role) : "STAFF TYPE";

  return (
    <div
      ref={ref}
      className="relative w-[350px] h-[550px] rounded-xl shadow-2xl overflow-hidden border"
      style={{
        borderColor: "#e5e7eb",
        fontFamily:
          "Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Soft vertical side lines */}
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

      {/* Decorative corner bars — TOP */}
      <div className="absolute top-0 left-0 w-16 h-16">
        <div className="absolute top-0 left-0 w-10 h-1 rounded-r" style={{ backgroundColor: "#6d28d9" }} />
        <div className="absolute top-0 left-0 w-1 h-10 rounded-b" style={{ backgroundColor: "#6d28d9" }} />
      </div>
      <div className="absolute top-0 right-0 w-16 h-16">
        <div className="absolute top-0 right-0 w-10 h-1 rounded-l" style={{ backgroundColor: "#6d28d9" }} />
        <div className="absolute top-0 right-0 w-1 h-10 rounded-b" style={{ backgroundColor: "#6d28d9" }} />
      </div>

      {/* Decorative corner bars — BOTTOM */}
      <div className="absolute left-0 bottom-0 w-24 h-3 rounded-tr-xl" style={{ backgroundColor: "rgba(88,28,135,0.9)" }} />
      <div className="absolute right-0 bottom-0 w-24 h-3 rounded-tl-xl" style={{ backgroundColor: "rgba(147,51,234,0.9)" }} />

      {/* Header stripe */}
      <div
        className="absolute top-0 left-0 w-full h-4"
        style={{ background: "linear-gradient(90deg, #6d28d9, #a855f7)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-6 pt-5 pb-6">
        {/* Logo (unchanged) */}
        <div className="w-full flex justify-center mb-4">
          <img
            src="/image.png"
            alt="Axzons HomeCare Logo"
            style={{ height: 72, width: "auto" }}
            crossOrigin="anonymous"
            loading="eager"
          />
        </div>

        {/* Larger photo frame (160×250) */}
        <div
          className="mt-1 mb-6 w-[160px] h-[250px] rounded-2xl overflow-hidden border-2 shadow-md grid place-items-center"
          style={{ borderColor: "#e5e7eb", backgroundColor: "#f3f4f6" }}
        >
          {userData.photo ? (
            <img
              src={URL.createObjectURL(userData.photo)}
              alt="Staff Photo"
              width={160}
              height={250}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span className="text-[12px] tracking-wide" style={{ color: "#6b7280" }}>
              PHOTO
            </span>
          )}
        </div>

        {/* Name (bigger) */}
        <div
          className="text-center font-extrabold tracking-wide uppercase"
          style={{ color: PURPLE, fontSize: 23, lineHeight: "24px" }}
        >
          {nameText}
        </div>

        {/* Role (slightly bigger) */}
        <div
          className="mt-1 text-center font-extrabold uppercase"
          style={{ color: "#374151", fontSize: 20 }}
        >
          {roleText}
        </div>

        {/* Staff Type (bigger) */}
        <div
          className="mt-1 text-center font-semibold uppercase"
          style={{ color: "#4b5563", fontSize: 16 }}
        >
          {staffTypeText}
        </div>

        {/* Divider (thicker) */}
        <div
          className="mt-5 mb-5 h-[9px] w-[92%] rounded"
          style={{
            background: "linear-gradient(90deg, #8b5cf6, #84cc16, #22c55e, #8b5cf6)",
            opacity: 0.95,
          }}
        />

        {/* Contact block */}
        <div className="text-center leading-relaxed">
          {/* Address — larger & darker & bold */}
          <div
            className="font-extrabold uppercase tracking-wide"
            style={{ color: DARK_TEXT, fontSize: 15, lineHeight: "19px" }}
          >
            70 EAST SUNRISE HIGHWAY,
          </div>
          <div
            className="font-extrabold uppercase tracking-wide -mt-0.5"
            style={{ color: DARK_TEXT, fontSize: 15, lineHeight: "19px" }}
          >
            SUITE 500 VALLEY STREAM, NY 11581
          </div>

          {/* Phone — same purple as name */}
          <div
            className="mt-3 font-extrabold tracking-wide"
            style={{ color: PURPLE, fontSize: 21, letterSpacing: "0.5px" }}
          >
            866-429-9667
          </div>

          {/* Website — slightly bigger */}
          <div
            className="mt-2 font-semibold lowercase tracking-wide"
            style={{ color: "#1f2937", fontSize: 16 }}
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
