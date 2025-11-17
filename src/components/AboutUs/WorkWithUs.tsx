import Image from "next/image";
import Link from "next/link";


const workItems = [
    {
        icon: "/images/icons/custom-cables.svg",
        title: "Custom Cables",
        text: "Experience meticulously designed solutions that challenge and inspire every project.",
    },
    {
        icon: "/images/icons/antennas.svg",
        title: "Antennas",
        text: "Play on lush, perfectly maintained performance that elevates every round.",
    },
    {
        icon: "/images/icons/connectors.svg",
        title: "Connectors",
        text: "Compete in demanding environments that test your systems and celebrate your victories.",
    },
    {
        icon: "/images/icons/caddies.svg",
        title: "Our Caddies",
        text: "Our experienced team provides expert guidance to enhance every deployment.",
    },
];

export default function WorkWithUsSection() {
    return (
        <section className=" ">
            <div className="mx-auto w-full max-w-[1340px] bg-[#2958A4] rounded-[20px] px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
                {/* Top row: title + button */}
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-white text-[40px] sm:text-[48px] lg:text-[56px] font-medium leading-tight tracking-[-0.04em]">
                        Work With Us
                    </h2>
                    <Link
                        href="/contact-us"
                        className="inline-flex items-center gap-3 rounded-full border border-white px-6 py-2 text-[16px] font-medium leading-[26px] text-white hover:bg-white/10 transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Bottom row: 4 items */}
                <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {workItems.map((item) => (
                        <div
                            key={item.title}
                            className="flex flex-col items-center text-center lg:items-start lg:text-left gap-3"
                        >
                            {/* Icon */}
                            <div className="h-10 w-10 flex items-center justify-center">
                                {/* Use your real SVGs/images here */}
                                <Image
                                    src={item.icon}
                                    alt={item.title}
                                    width={40}
                                    height={40}
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-white text-[18px] font-medium leading-[26px]">
                                {item.title}
                            </h3>

                            {/* Text */}
                            <p className="text-white/80 text-[14px] sm:text-[15px] leading-[22px] max-w-[290px]">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
