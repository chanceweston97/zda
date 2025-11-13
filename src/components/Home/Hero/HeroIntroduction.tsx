// components/Sections/NetworkIntro.tsx
import Link from "next/link";

export default function HeroIntroduction() {
    return (
        <section className="w-full">
            <div className="max-w-2xl  py-12 lg:py-20">
                {/* Heading */}
                <h2 className="text-[#2958A4] text-[60px] font-medium leading-[76px] tracking-[-2.4px]">
                    Enabling Wireless Networks Since 2008
                </h2>

                {/* Paragraph */}
                <p className="mt-6 text-[#4F6866] text-[18px] font-normal leading-7 tracking-[-0.36px]">
                    At ZDA Communications, we care about one thing above all: reliable wireless
                    performance. We design and supply industrial-grade antennas, cabling, and RF
                    accessories—plus practical tools like custom cable builds—that help homes,
                    enterprises, and field teams achieve clear, consistent connectivity. From fixed
                    sites to mobile deployments, our hardware is engineered for uptime, verified for
                    low VSWR, and built to stand up to real-world conditions so your network stays
                    steady when it matters.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        href="/about"
                        className="inline-flex items-center rounded-full bg-[#2958A4] hover:border hover:border-[#2958A4]
                       text-white text-sm font-medium px-6 py-3 transition-colors hover:bg-white hover:text-[#2958A4]"
                    >
                        More About Us
                    </Link>

                    <Link
                        href="/shop-with-sidebar"
                        className="inline-flex items-center rounded-full bg-[#2958A4] hover:border hover:border-[#2958A4]
                       text-white text-sm font-medium px-6 py-3 transition-colors hover:bg-white hover:text-[#2958A4]"
                    >
                        Explore Products
                    </Link>

                </div>
            </div>
        </section>
    );
}
