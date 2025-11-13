import Image from "next/image";

const paymentsData = [
  {
    id: 1,
    image: "/images/payment/payment-01.svg",
    alt: "visa card",
    width: 33,
  },
  {
    id: 2,
    image: "/images/payment/payment-02.svg",
    alt: "paypal",
    width: 33,
  },
  {
    id: 3,
    image: "/images/payment/payment-03.svg",
    alt: "master card",
    width: 42,
  },
  {
    id: 4,
    image: "/images/payment/payment-04.svg",
    alt: "apple pay",
    width: 50,
  },
  {
    id: 5,
    image: "/images/payment/payment-05.svg",
    alt: "google pay",
    width: 52,
  },
];

export default function FooterBottom() {
  const year = new Date().getFullYear();

  return (
    <div className="py-5 xl:py-7.5 bg-gray-1">
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="font-medium text-dark-3 text-sm">
            &copy; {year}. All rights reserved by{" "}
            <a
              className="text-dark"
              href="https://pimjo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pimjo
            </a>
            .
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <p className="font-medium text-sm text-dark-3">We Accept:</p>

            <div className="flex flex-wrap items-center gap-4">
              {paymentsData.map((payment) => (
                <div
                  key={payment.id}
                  className="  inline-flex items-center justify-center"
                >
                  <Image
                    src={payment.image}
                    alt={payment.alt}
                    width={payment.width}
                    height={20}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
