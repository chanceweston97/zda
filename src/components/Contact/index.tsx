"use client";

import { useForm } from "react-hook-form";
import FaqSection from "../Home/Faq";

type QuoteForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

export default function RequestQuote() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteForm>();

  const onSubmit = (data: QuoteForm) => {
    console.log("Quote form:", data);
  };

  return (
    <section className="bg-white py-20 mt-7">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Heading + copy */}
        <div className="text-center">
          <h1 className="text-[#2958A4] text-[40px] sm:text-[48px] md:text-[56px] font-medium leading-[1.2] tracking-[-0.09em]">
            Request a Quote
          </h1>

          <p className="mt-6 text-[#2958A4] text-base sm:text-lg font-medium">
            Know what you need—or not sure yet? Connect with us for pricing and
            options.
          </p>

          <p className="mt-2 text-[#2958A4] text-base sm:text-lg font-medium max-w-3xl mx-auto">
            Are you a business or organization? Speak to one of our product
            experts today to potentially receive NET30 terms or tax-exempt
            pricing.
          </p>
        </div>

        {/* Card */}
        <div className="mt-12 rounded-[24px] bg-[#F4F5F7] shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10"
          >
            {/* First row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* First name */}
              <div>
                <label className="block text-sm font-medium text-[#111827]">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  placeholder="John"
                  className="mt-2 w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#2958A4] focus:ring-2 focus:ring-[#2958A4]/20"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last name */}
              <div>
                <label className="block text-sm font-medium text-[#111827]">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  placeholder="Smith"
                  className="mt-2 w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#2958A4] focus:ring-2 focus:ring-[#2958A4]/20"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Second row */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#111827]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  placeholder="Enter your email"
                  className="mt-2 w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#2958A4] focus:ring-2 focus:ring-[#2958A4]/20"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#111827]">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  placeholder="+1 234 5678"
                  className="mt-2 w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#2958A4] focus:ring-2 focus:ring-[#2958A4]/20"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company name */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#111827]">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("company", {
                  required: "Company name is required",
                })}
                placeholder="Company name"
                className="mt-2 w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#2958A4] focus:ring-2 focus:ring-[#2958A4]/20"
              />
              {errors.company && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.company.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#111827]">
                Message
              </label>
              <textarea
                {...register("message")}
                rows={6}
                placeholder="Leave your message"
                className="mt-2 w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] resize-none outline-none focus:border-[#2958A4] focus:ring-2 focus:ring-[#2958A4]/20"
              />
            </div>

            {/* Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#2958A4] px-10 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1F4480]"
              >
                Submit Now
              </button>
            </div>
          </form>
        </div>
      </div>
      <FaqSection />
    </section>
  );
}
