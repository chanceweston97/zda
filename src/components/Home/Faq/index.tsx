// src/components/FaqSection.tsx
"use client";

import { useState } from "react";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    id: 1,
    question: "What does ZDA Communications specialize in?",
    answer:
      "We design and supply industrial-grade antennas, coaxial cables, and RF accessories engineered for reliable performance in demanding environments.",
  },
  {
    id: 2,
    question: "Which applications are your antennas designed for?",
    answer:
      "Our antennas support fixed wireless, SCADA, utility monitoring, transportation, public safety, and other mission-critical wireless applications.",
  },
  {
    id: 3,
    question: "Do your antennas work with third-party equipment?",
    answer:
      "Yes. Our products are 50-ohm and interface with common radios, modems, hotspots, routers, and signal boosters from major manufacturers, using standard RF connectors.",
  },
  {
    id: 4,
    question: "What connector types are available?",
    answer:
      "N-Female is the standard connector for most of our antennas. We also support SMA, RP-SMA, N-Male, TNC, and other terminations on request.",
  },
  {
    id: 5,
    question: "What is antenna gain and why does it matter?",
    answer:
      "Antenna gain describes how effectively an antenna focuses energy in a particular direction. Higher gain can improve range and signal quality when properly aligned.",
  },
  {
    id: 6,
    question: "What is VSWR and what are your typical values?",
    answer:
      "VSWR (Voltage Standing Wave Ratio) indicates how efficiently power is transferred from the radio to the antenna. Our products are engineered for low VSWR to minimize reflected power.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1); // default open Q3

  const toggle = (id: number) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const leftFaqs = FAQS.filter((x) => x.id % 2 === 1);
  const rightFaqs = FAQS.filter((x) => x.id % 2 === 0);

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[#2958A4] text-[56px] font-medium leading-[76px] tracking-[-2.24px]">
            Frequently Asked Questions
          </h2>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-[#2958A4] px-6 py-2 text-sm font-medium text-white transition-colors hover:border-[#2958A4] hover:bg-white hover:text-[#2958A4]"
          >
            Contact Us
          </button>
        </div>

        {/* Two independent columns */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            {leftFaqs.map((item) => (
              <FaqRow
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {rightFaqs.map((item) => (
              <FaqRow
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Single FAQ row ---------- */

function FaqRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full text-left"
    >
      <div className="flex flex-col rounded-2xl bg-white px-5 py-4 shadow-sm transition hover:bg-[#f7f7f7]">
        {/* Question */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-[#2958A4] font-satoshi text-[20px] font-medium leading-[30px] tracking-[-0.2px]"
>
            {`Q${item.id}: `}
            <span className="font-normal">{item.question}</span>
          </p>

          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F4F4] text-[#2958A4] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        {/* Answer with delayed animation */}
        <div
          className={`mt-2 overflow-hidden text-[14px] leading-6 text-[#383838] transition-all duration-500 ${
            isOpen
              ? "max-h-40 opacity-100 delay-75"
              : "max-h-0 opacity-0 delay-0"
          }`}
        >
          <p className="text-[#383838] font-satoshi text-[18px] font-normal leading-7">{item.answer}</p>
        </div>
      </div>
    </button>
  );
}
