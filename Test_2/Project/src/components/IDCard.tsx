"use client";

import { forwardRef } from "react";
import { UserData, getStaffType } from "@/types";

interface IDCardProps {
  userData: UserData;
}

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
        // use only capture-safe CSS (no Tailwind color funcs)
        borderColor: "#e5e7eb",
        fontFamily:
          "Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Soft vertical side lines (inline gradient) */}
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

      {/* Decorative corner bars — TOP (inline colors) */}
      <div className="absolute top-0 left-0 w-16 h-16">
        <div
          className="absolute top-0 left-0 w-10 h-1 rounded-r"
          style={{ backgroundColor: "#6d28d9" /* purple-700 */ }}
        />
        <div
          className="absolute top-0 left-0 w-1 h-10 rounded-b"
          style={{ backgroundColor: "#6d28d9" }}
        />
      </div>
      <div className="absolute top-0 right-0 w-16 h-16">
        <div
          className="absolute top-0 right-0 w-10 h-1 rounded-l"
          style={{ backgroundColor: "#6d28d9" }}
        />
        <div
          className="absolute top-0 right-0 w-1 h-10 rounded-b"
          style={{ backgroundColor: "#6d28d9" }}
        />
      </div>

      {/* Decorative corner bars — BOTTOM (inline colors) */}
      <div
        className="absolute left-0 bottom-0 w-24 h-3 rounded-tr-xl"
        style={{ backgroundColor: "rgba(88,28,135,0.9)" /* purple-900/90 */ }}
      />
      <div
        className="absolute right-0 bottom-0 w-24 h-3 rounded-tl-xl"
        style={{ backgroundColor: "rgba(147,51,234,0.9)" /* purple-600/90 */ }}
      />

      {/* Header stripe (inline gradient) */}
      <div
        className="absolute top-0 left-0 w-full h-4"
        style={{
          background: "linear-gradient(90deg, #6d28d9, #a855f7)", // purple-700 -> purple-500
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-7 pt-8 pb-7">
        {/* Logo (plain <img>) */}
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
        <div
          className="mt-1 mb-6 w-[128px] h-[128px] rounded-xl overflow-hidden border-2 shadow-md grid place-items-center"
          style={{ borderColor: "#e5e7eb", backgroundColor: "#f3f4f6" }}
        >
          {userData.photo ? (
            <img
              src={URL.createObjectURL(userData.photo)}
              alt="Staff Photo"
              width={128}
              height={128}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              crossOrigin="anonymous"
            />
          ) : (
            <span className="text-[12px] tracking-wide" style={{ color: "#6b7280" }}>
              PHOTO
            </span>
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

        {/* Divider (inline gradient) */}
        <div
          className="mt-5 mb-5 h-[3px] w-[92%] rounded"
          style={{
            background: "linear-gradient(90deg, #8b5cf6, #84cc16, #22c55e, #8b5cf6)",
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
