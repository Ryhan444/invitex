"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, Copy, Check, QrCode, CreditCard, MapPin } from "lucide-react";
import { DonationContent } from "@/types";

interface DonationBlockProps {
  content: DonationContent;
}

export function DonationBlock({ content }: DonationBlockProps) {
  const accounts = content.accounts || [];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showQris, setShowQris] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section id="donation" className="scroll-mt-16 py-14 sm:py-24 bg-netflix-carbon border-t border-netflix-border/50 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-netflix-red/10 border border-netflix-red/30 px-3 py-1 rounded-full mb-3">
            <Gift className="w-3.5 h-3.5 text-netflix-red" />
            <span className="text-xs font-bold text-netflix-red uppercase tracking-widest">
              Digital Wedding Gift
            </span>
          </div>
          <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif">
            {content.heading || "BOX OFFICE CONTRIBUTION"}
          </h2>
          {content.subheading && (
            <p className="text-xs sm:text-base text-gray-400 mt-2 max-w-xl mx-auto">
              {content.subheading}
            </p>
          )}
        </div>

        {/* Bank Account Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {accounts.map((acc, idx) => (
            <div
              key={idx}
              className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-netflix-border/80 hover:border-netflix-red/50 rounded-xl p-6 shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-netflix-red" />
                  <span className="font-bold text-sm text-gray-200">{acc.bank_name}</span>
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase bg-netflix-red/20 text-netflix-red px-2 py-0.5 rounded">
                  OFFICIAL
                </span>
              </div>

              <div className="my-3">
                <span className="text-xs text-gray-400 block mb-1">Account / Virtual Account Number:</span>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-wider text-white">
                  {acc.account_number}
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  Account holder: <span className="font-semibold text-white">{acc.account_holder}</span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(acc.account_number, idx)}
                className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  copiedIndex === idx
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-700"
                }`}
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-4 h-4" />
                    Account Number Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Account Number
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* QRIS & Gift Delivery Address Options */}
        <div className="space-y-4">
          {/* QRIS Accordion / Preview */}
          {content.qris_url && (
            <div className="bg-netflix-dark/60 border border-netflix-border/80 rounded-xl p-5 sm:p-6 text-center">
              <button
                onClick={() => setShowQris(!showQris)}
                className="w-full flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-netflix-red transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-5 h-5 text-netflix-red" />
                  <span>Send a Gift via QRIS (All E-Wallets / Mobile Banking)</span>
                </div>
                <span className="text-xs text-netflix-red uppercase tracking-wider font-semibold">
                  {showQris ? "Hide QRIS" : "View QRIS"}
                </span>
              </button>

              {showQris && (
                <div className="mt-6 flex flex-col items-center">
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-white p-3 rounded-xl shadow-2xl border-2 border-netflix-red">
                    <Image
                      src={content.qris_url}
                      alt="QRIS code"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Scan with BCA, Livin' by Mandiri, GoPay, OVO, ShopeePay, or DANA.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Physical Gift Mailing Address */}
          {content.gift_address && (
            <div className="bg-netflix-dark/60 border border-netflix-border/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-netflix-red flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">Send a Physical Gift</h4>
                  <p className="text-xs text-gray-300 max-w-lg leading-relaxed">
                    {content.gift_address}
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyAddress(content.gift_address!)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  copiedAddress
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-700"
                }`}
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Address Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Address
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

