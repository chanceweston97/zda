import Graphics from "./Graphics";
import NewsletterForm from "./NewsletterForm";

const Newsletter = () => {
  return (
    <section className="w-full flex justify-center px-4 pt-10">
      <div className="w-full max-w-[1440px] rounded-[20px] 
    bg-linear-to-b from-[rgba(49,106,197,0)] to-[#2958A4]
    flex items-center px-[50px] py-[71px]">

        <div className="w-full max-w-[900px] mx-auto text-center">

          <h2 className="text-[#2958A4] text-[56px] font-medium leading-[76px] tracking-[-2.24px]">
            Subscribe For <br /> Latest News Now!
          </h2>

          <p className="mt-6 text-black text-[18px] leading-[28px] max-w-[650px] mx-auto">
            &quot;Stay updated with the latest club news, events, and exclusive offers—
            straight to your inbox.&quot;
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 max-w-[900px] mx-auto">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full max-w-[600px] rounded-full bg-white/20 text-white px-6 py-4
          placeholder-white/80 outline-none"
            />

            <button className="rounded-full text-white bg-[#2958A4] px-10 py-4 font-medium">
              Subscribe Now
            </button>
          </div>

        </div>

      </div>
    </section>

  );
};

export default Newsletter;
