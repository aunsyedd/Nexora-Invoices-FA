"use client";

import React from "react";
import { SELLER_COMPANY } from "@/lib/companyConfig";
import {
  calcLineTax,
  capitalizeUnit,
  formatProformaDate,
  formatProformaNumber,
  getDueDate,
  getPaymentTermsLabel,
} from "@/lib/proformaUtils";
import ZatcaQRCodeDisplay from "./ZatcaQRCodeDisplay";

export interface ProformaCustomer {
  name?: string;
  alias_name?: string;
  building_no?: string;
  street?: string;
  district?: string;
  second_no?: string;
  postal_code?: string;
  city?: string;
  vat_no?: string;
  other_id?: string;
}

export interface ProformaLineItem {
  description: string;
  unit: string;
  qty: string;
  rate: string;
  amount: string;
  vat: string;
  total: string;
}

export interface ProformaInvoiceData {
  invoiceNumber: string;
  date: string;
  paymentTerms: string;
  description: string;
  poNumber: string;
  projectName: string;
  publicNote: string;
  discount: string;
  totalAmount: string;
  vatAmount: string;
  netAmount: string;
  retentionPercentage?: string;
  retentionAmount?: string;
  dueAmount: string;
  lineItems: ProformaLineItem[];
  customer: ProformaCustomer | null;
}

interface ProformaInvoicePrintProps {
  data: ProformaInvoiceData;
  variant?: "tax" | "proforma";
}

function PartyField({
  labelEn,
  labelAr,
  value,
  valueAr,
}: {
  labelEn: string;
  labelAr: string;
  value: string;
  valueAr?: string;
}) {
  return (
    <>
      <tr>
        <td className="field-label">
          {labelEn} <span className="ar">{labelAr}</span>
        </td>
        <td className="field-value">{value}</td>
      </tr>
      {valueAr ? (
        <tr>
          <td className="field-label" />
          <td className="field-value ar">{valueAr}</td>
        </tr>
      ) : null}
    </>
  );
}

function PartyColumn({
  titleEn,
  titleAr,
  party,
  isSeller,
}: {
  titleEn: string;
  titleAr: string;
  party: ProformaCustomer | typeof SELLER_COMPANY;
  isSeller: boolean;
}) {
  const seller = isSeller ? (party as typeof SELLER_COMPANY) : null;
  const buyer = !isSeller ? (party as ProformaCustomer) : null;

  return (
    <table className="party-col">
      <tbody>
        <tr>
          <td colSpan={2} className="party-title">
            {titleEn}: <span className="ar">{titleAr}</span>
          </td>
        </tr>
        <PartyField
          labelEn="Name"
          labelAr="الاسم"
          value={isSeller ? seller!.name : buyer?.name || ""}
          valueAr={isSeller ? seller!.nameAr : buyer?.alias_name || ""}
        />
        <PartyField
          labelEn="Building No."
          labelAr="رقم المبنى"
          value={isSeller ? seller!.buildingNo : buyer?.building_no || ""}
        />
        {isSeller ? (
          <tr>
            <td className="field-label">
              Street <span className="ar">الشارع</span>
            </td>
            <td className="field-value">
              {seller!.street} | <span className="ar">{seller!.streetAr}</span>
            </td>
          </tr>
        ) : (
          <PartyField
            labelEn="Street"
            labelAr="الشارع"
            value={buyer?.street || ""}
          />
        )}
        {isSeller ? (
          <tr>
            <td className="field-label">
              District <span className="ar">الحي</span>
            </td>
            <td className="field-value">
              {seller!.district} | <span className="ar">{seller!.districtAr}</span>
            </td>
          </tr>
        ) : (
          <PartyField
            labelEn="District"
            labelAr="الحي"
            value={buyer?.district || ""}
          />
        )}
        <PartyField
          labelEn="Second No."
          labelAr="الرقم الفرعي"
          value={isSeller ? seller!.secondNo : buyer?.second_no || ""}
        />
        <PartyField
          labelEn="Postal Code"
          labelAr="الرمز البريدي"
          value={isSeller ? seller!.postalCode : buyer?.postal_code || ""}
        />
        {isSeller ? (
          <tr>
            <td className="field-label">
              City <span className="ar">المدينة</span>
            </td>
            <td className="field-value">
              {seller!.city} | <span className="ar">{seller!.cityAr}</span>
            </td>
          </tr>
        ) : (
          <PartyField
            labelEn="City"
            labelAr="المدينة"
            value={buyer?.city || ""}
          />
        )}
        <PartyField
          labelEn="VAT Id."
          labelAr="رقم ضريبة"
          value={isSeller ? seller!.vatId : buyer?.vat_no || ""}
        />
        <PartyField
          labelEn="Other Id."
          labelAr="معرف آخر"
          value={isSeller ? seller!.otherId : buyer?.other_id || ""}
        />
      </tbody>
    </table>
  );
}

export const ProformaInvoicePrint = React.forwardRef<
  HTMLDivElement,
  ProformaInvoicePrintProps
>(function ProformaInvoicePrint({ data, variant = "tax" }, ref) {
  const seller = SELLER_COMPANY;
  const buyer = data.customer || {};
  const dueDate = getDueDate(data.date, data.paymentTerms);
  const isTax = variant === "tax";
  const discount = parseFloat(data.discount) || 0;
  const showDiscount = !isTax && discount > 0;

  return (
    <div ref={ref} className="proforma-root">
      <style jsx global>{`
        .proforma-root {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 8.5pt;
          color: #000;
          background: #fff;
          width: 210mm;
          min-height: 297mm;
          padding: 8mm 10mm 6mm;
          box-sizing: border-box;
        }

        .proforma-root * {
          box-sizing: border-box;
        }

        .proforma-root .ar {
          font-family: "Segoe UI", Tahoma, Arial, sans-serif;
          direction: rtl;
          unicode-bidi: embed;
        }

        .proforma-root .title-bar {
          text-align: center;
          font-size: 13pt;
          font-weight: bold;
          border: 1px solid #000;
          padding: 4px 8px;
          margin: 0 0 6px;
        }

        .proforma-root .header-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 6px;
        }

        .proforma-root .logo-wrap {
          flex: 0 0 72px;
        }

        .proforma-root .logo-wrap img {
          width: 72px;
          height: auto;
          display: block;
        }

        .proforma-root .meta-table {
          flex: 1 1 auto;
          border-collapse: collapse;
        }

        .proforma-root .meta-table td {
          border: 1px solid #000;
          padding: 2px 5px;
          vertical-align: middle;
        }

        .proforma-root .meta-label {
          font-weight: bold;
          white-space: nowrap;
          width: 38%;
        }

        .proforma-root .header-qr {
          flex: 0 0 92px;
          display: flex;
          justify-content: flex-end;
        }

        .proforma-root .parties-row {
          display: flex;
          gap: 0;
          margin-bottom: 6px;
        }

        .proforma-root .party-col {
          width: 50%;
          border-collapse: collapse;
        }

        .proforma-root .party-col td {
          border: 1px solid #000;
          padding: 2px 5px;
          vertical-align: top;
        }

        .proforma-root .party-title {
          font-weight: bold;
          background: #d9d9d9;
          text-align: left;
        }

        .proforma-root .field-label {
          font-weight: bold;
          width: 34%;
          white-space: nowrap;
        }

        .proforma-root .field-value {
          width: 66%;
        }

        .proforma-root .detail-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 6px;
        }

        .proforma-root .detail-table td {
          border: 1px solid #000;
          padding: 3px 6px;
          vertical-align: top;
        }

        .proforma-root .detail-label {
          font-weight: bold;
          white-space: nowrap;
          width: 12%;
        }

        .proforma-root .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 6px;
        }

        .proforma-root .items-table th,
        .proforma-root .items-table td {
          border: 1px solid #000;
          padding: 3px 4px;
          vertical-align: middle;
        }

        .proforma-root .items-table th {
          background: #d9d9d9;
          font-weight: bold;
          text-align: center;
          font-size: 7.5pt;
        }

        .proforma-root .items-table .num {
          text-align: right;
          white-space: nowrap;
        }

        .proforma-root .items-table .center {
          text-align: center;
        }

        .proforma-root .bottom-row {
          display: flex;
          align-items: stretch;
          gap: 0;
          margin-bottom: 8px;
        }

        .proforma-root .note-box {
          width: 50%;
          border: 1px solid #000;
          padding: 4px 6px;
          min-height: 88px;
        }

        .proforma-root .note-box .note-label {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .proforma-root .summary-table {
          width: 50%;
          border-collapse: collapse;
        }

        .proforma-root .summary-table td {
          border: 1px solid #000;
          padding: 3px 6px;
        }

        .proforma-root .summary-table .sum-label {
          font-weight: bold;
          text-align: right;
          width: 70%;
        }

        .proforma-root .summary-table .sum-value {
          text-align: right;
          width: 30%;
          white-space: nowrap;
        }

        .proforma-root .signature-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;

          padding-top: 8px;
          margin-top: 252px;
          min-height: 48px;
        }

            .proforma-root .bankrow {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;

          padding-top: 8px;
          margin-top: 122px;
          min-height: 48px;
        }

        

        .proforma-root .signature-left {
          font-weight: bold;
        }
.proforma-root .bank-right {
  font-weight: bold;
  margin-bottom: 4px;
}

        .proforma-root .signature-right {
          font-weight: bold;
          text-align: right;
          min-width: 120px;
          border-top: 1px solid #000;
          padding-top: 4px;
        }

        .proforma-root .page-footer {
          border-top: 1px solid #000;
          margin-top: 8px;
          padding-top: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 8pt;
        }
      `}</style>

      <div className="title-bar">
        {isTax ? (
          <>
            Tax Invoice - <span className="ar">فاتورة ضريبية</span>
          </>
        ) : (
          <>
            Proforma Invoice - <span className="ar">فاتورة مبدئية</span>
          </>
        )}
      </div>

      <div className="header-row">
        <div className="logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="WTMC Logo" />
        </div>

        <table className="meta-table">
          <tbody>
            <tr>
              <td className="meta-label">
                Invoice No. <span className="ar">رقم الفاتورة</span>
              </td>
              <td>{data.invoiceNumber}</td>
            </tr>
            <tr>
              <td className="meta-label">
                Invoice Date <span className="ar">تاريخ إصدار</span>
              </td>
              <td>{formatProformaDate(data.date)}</td>
            </tr>
            <tr>
              <td className="meta-label">
                Invoice Due Date <span className="ar">تاريخ الاستحقاق</span>
              </td>
              <td>{dueDate}</td>
            </tr>
            <tr>
              <td className="meta-label">
                Payment Terms <span className="ar">الشروط الدفع</span>
              </td>
              <td>{getPaymentTermsLabel(data.paymentTerms)}</td>
            </tr>
          </tbody>
        </table>

        <div className="header-qr">
          <ZatcaQRCodeDisplay
            sellerName={seller.name}
            vatNumber={seller.vatId}
            invoiceDate={data.date}
            totalAmount={data.netAmount}
            vatAmount={data.vatAmount}
            size={88}
          />
        </div>
      </div>

      <div className="parties-row">
        <PartyColumn
          titleEn="Seller"
          titleAr="المورد"
          party={seller}
          isSeller
        />
        <PartyColumn titleEn="Buyer" titleAr="العميل" party={buyer} isSeller={false} />
      </div>

      {data.description ? (
        <table className="detail-table">
          <tbody>
            <tr>
              <td className="detail-label">Description</td>
              <td>{data.description}</td>
            </tr>
          </tbody>
        </table>
      ) : null}

      {(data.poNumber || data.projectName) && (
        <table className="detail-table">
          <tbody>
            <tr>
              <td style={{ width: "50%", borderRight: "1px solid #000" }}>
                {data.poNumber ? (
                  <>
                    <strong>P.O.No.:</strong> {data.poNumber}
                  </>
                ) : null}
              </td>
              <td style={{ width: "50%" }}>
                {data.projectName ? (
                  <>
                    <strong>Project :</strong> {data.projectName}
                  </>
                ) : null}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <table className="items-table">
        <thead>
          <tr>
            <th style={{ width: "4%" }}>
              #<br />
              <span className="ar">رقم</span>
            </th>
            <th style={{ width: "34%" }}>
              Descriptions
              <br />
              <span className="ar">الأوصاف</span>
            </th>
            <th style={{ width: "8%" }}>
              Unit
              <br />
              <span className="ar">الوحدة</span>
            </th>
            <th style={{ width: "7%" }}>
              QTY
              <br />
              <span className="ar">الكمية</span>
            </th>
            <th style={{ width: "12%" }}>
              Unit Price
              <br />
              <span className="ar">سعر الوحدة</span>
            </th>
            <th style={{ width: "13%" }}>
              Taxable Amount
              <br />
              <span className="ar">المبلغ الخاضع للضريبة</span>
            </th>
            <th style={{ width: "10%" }}>
              Tax
              <br />
              <span className="ar">ضريبة</span>
            </th>
            <th style={{ width: "12%" }}>
              Total
              <br />
              <span className="ar">الإجمالي</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.length === 0 ? (
            <tr>
              <td colSpan={8} className="center">
                No line items
              </td>
            </tr>
          ) : (
            data.lineItems.map((item, index) => (
              <tr key={index}>
                <td className="center">{index + 1}</td>
                <td>{item.description}</td>
                <td className="center">{capitalizeUnit(item.unit)}</td>
                <td className="center">{item.qty}</td>
                <td className="num">{formatProformaNumber(item.rate)}</td>
                <td className="num">{formatProformaNumber(item.amount)}</td>
                <td className="num">
                  {formatProformaNumber(calcLineTax(item.amount, item.vat))}
                </td>
                <td className="num">{formatProformaNumber(item.total)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="bottom-row">
        <div className="note-box">
          <div className="note-label">Note:</div>
          <div>{data.publicNote}</div>
        </div>

        <table className="summary-table">
          <tbody>
            <tr>
              <td className="sum-label">
                Amount <span className="ar">المبلغ</span>
              </td>
              <td className="sum-value">
                {formatProformaNumber(data.totalAmount)}
              </td>
            </tr>
            {showDiscount && (
              <tr>
                <td className="sum-label">
                  Discount <span className="ar">خصم</span>
                </td>
                <td className="sum-value">
                  {formatProformaNumber(data.discount)}
                </td>
              </tr>
            )}
            {!isTax && (
              <tr>
                <td className="sum-label">
                  Total Amount <span className="ar">الإجمالي المبلغ</span>
                </td>
                <td className="sum-value">
                  {formatProformaNumber(
                    (parseFloat(data.totalAmount) || 0) - discount
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td className="sum-label">
                VAT 15% <span className="ar">ضريبة القيمة المضافة</span>
              </td>
              <td className="sum-value">
                {formatProformaNumber(data.vatAmount)}
              </td>
            </tr>
            <tr>
              <td className="sum-label">
                Net Amount <span className="ar">الصافي المبلغ</span>
              </td>
              <td className="sum-value">
                {formatProformaNumber(data.netAmount)}
              </td>
            </tr>
            {data.retentionPercentage &&
              parseFloat(data.retentionPercentage) > 0 && (
                <tr>
                  <td className="sum-label">
                    Retention ({data.retentionPercentage}% of Total Amount){" "}
                    <span className="ar">نسبة الاحتفاظ</span>
                  </td>
                  <td className="sum-value">
                    -{formatProformaNumber(data.retentionAmount || "0")}
                  </td>
                </tr>
              )}
            <tr>
              <td className="sum-label">
                Amount Due <span className="ar">المستحق المبلغ</span>
              </td>
              <td className="sum-value">
                {formatProformaNumber(data.dueAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

<div className="bank-row">
  <div className="bank-right">Payment Terms</div>
  <div className="bank-right">
    Payment by bank transfer to the following account:
  </div>
  <div className="bank-right">Bank Name: Saudi National Bank</div>
  <div className="bank-right">Account Number: 80700005253108</div>
  <div className="bank-right">
    Account Name: شركة واشيكا تبسم مروه / Washika Tabassum Marwah Co.
  </div>
  <div className="bank-right">IBAN: SA8810000080700005253108</div>
</div>


      <div className="signature-row">
                <div className="signature-left">For {seller.name}</div>
            <div className="signature-right">Received By</div>

      </div>

      <div className="page-footer">
        <span>VAT ID: {seller.vatId}</span>
        <span>Page 1/1</span>
      </div>
    </div>
  );
});
