"use client";

import { CallIcon, EmailIcon, MapIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Loader from "@/components/Common/Loader";
import { InputGroup } from "@/components/ui/input";
import cn from "@/utils/cn";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Input = {
  firstName: string;
  lastName: string;
  subject: string;
  phone: string;
  message: string;
};

const Contact = () => {
  const { register, control, formState, handleSubmit } = useForm<Input>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: Input) => {
    setIsLoading(true);
    // Handle form submission
    console.log(data);
    setIsLoading(false);
  };

  return (
    <>
      <Breadcrumb title={"Contact"} pages={["contact"]} />

      <section className="py-20 overflow-hidden bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            <div className="w-full bg-white xl:w-1/3 rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="text-xl font-medium text-dark">
                  Contact Information
                </p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-4">
                  <p className="flex items-center gap-4">
                    <EmailIcon className="w-6 h-6 text-blue" />
                    Email: jamse@example.com
                  </p>

                  <p className="flex items-center gap-4">
                    <CallIcon className="w-6 h-6 text-blue" />
                    Phone: 1234 567890
                  </p>

                  <p className="flex gap-4">
                    <MapIcon className="w-6 h-6 text-blue shrink-0" />
                    Address: 7398 Smoke Ranch RoadLas Vegas, Nevada 89128
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:w-2/3 w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 mb-5 lg:flex-row sm:gap-8">
                  <Controller
                    control={control}
                    name="firstName"
                    rules={{ required: "First Name is required" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <InputGroup
                          label="First Name"
                          placeholder="John"
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="lastName"
                    rules={{ required: "Last Name is required" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <InputGroup
                          label="Last Name"
                          placeholder="Deo"
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-5 mb-5 lg:flex-row sm:gap-8">
                  <Controller
                    control={control}
                    name="subject"
                    rules={{ required: "Subject is required" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <InputGroup
                          label="Subject"
                          placeholder="Type your subject"
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="phone"
                    rules={{ required: "Phone is required" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <InputGroup
                          type="tel"
                          label="Phone"
                          placeholder="Enter your phone"
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="mb-7.5">
                  <label htmlFor="message" className="block mb-2.5">
                    Message
                  </label>

                  <textarea
                    {...register("message", {
                      required: "Message is required",
                    })}
                    id="message"
                    rows={5}
                    placeholder="Type your message"
                    className="w-full p-5 duration-200 border rounded-2xl border-gray-3 bg-gray-1 placeholder:text-dark-5 outline-hidden focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />

                  {formState.errors.message && (
                    <p className="mt-1 text-sm text-red">
                      {formState.errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={cn(
                    "inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-7 rounded-full ease-out duration-200 hover:bg-blue-dark",
                    {
                      "opacity-80 pointer-events-none": isLoading,
                    }
                  )}
                  disabled={isLoading}
                >
                  Send Message {isLoading && <Loader />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
