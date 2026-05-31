"use client";

import { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  generateZatcaQRCode,
  ZatcaQRCodeError,
} from "@/lib/zatcaQrCode";

export interface ZatcaQRCodeDisplayProps {
  sellerName: string;
  vatNumber: string;
  invoiceDate: string;
  /** Invoice total including VAT (ZATCA tag 4) */
  totalAmount: string;
  vatAmount: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export default function ZatcaQRCodeDisplay({
  sellerName,
  vatNumber,
  invoiceDate,
  totalAmount,
  vatAmount,
  size = 110,
  className = "",
  showLabel = false,
}: ZatcaQRCodeDisplayProps) {
  const { qrValue, error } = useMemo(() => {
    try {
      return {
        qrValue: generateZatcaQRCode(
          sellerName,
          vatNumber,
          invoiceDate,
          totalAmount,
          vatAmount
          
        ),
        error: null as string | null,
      };
    } catch (err) {
      const message =
        err instanceof ZatcaQRCodeError
          ? err.message
          : "Unable to generate ZATCA QR code.";
      return { qrValue: null, error: message };
    }
  }, [sellerName, vatNumber, invoiceDate, totalAmount, vatAmount]);

  if (error || !qrValue) {
    return (
      <div
        className={`text-[8pt] text-gray-500 border border-dashed border-gray-300 p-2 text-center ${className}`}
        style={{ width: size, minHeight: size }}
      >
        {error || "QR code unavailable"}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <QRCodeCanvas
        value={qrValue}
        size={size}
        level="M"
        includeMargin
      />
      {showLabel && (
        <span className="text-[7pt] mt-1 text-center text-gray-600">
          {/* ZATCA QR */}
        </span>
      )}
    </div>
  );
}
