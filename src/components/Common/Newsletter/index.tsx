import Graphics from "./Graphics";
import NewsletterForm from "./NewsletterForm";

const Newsletter = () => {
  return (
    <section className="w-full flex justify-center pt-10">
      <div className="w-full max-w-[1340px] 
    bg-linear-to-b from-[rgba(49,106,197,0)] to-[#2958A4]
    flex items-center px-[50px] py-[71px]">

        <div className="w-full max-w-[680px] text-center">

          <h2 className="text-[#2958A4] text-center text-5xl lg:text-[60px] font-medium leading-[66px] tracking-[-2.4px]">
            Subscribe For <br /> Latest News Now!
          </h2>

          <p className="mt-[22px] text-[#383838] text-[18px] font-medium leading-7 max-w-[572px] mx-auto">
            &quot;Stay updated with the latest club news, events, and exclusive offers—
            straight to your inbox.&quot;
          </p>

          <div className="mt-10 flex lg:flex-row flex-col items-center justify-center gap-4 max-w-[680px]">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full max-w-[505px] rounded-[40px] bg-white/80 text-[#383838] px-6 py-2.5
          placeholder-[#383838] outline-none"
            />

            <button className="mt-2 lg:mt-0 flex w-[165px] px-[30px] py-[10px] justify-center items-center gap-[10px] rounded-[40px] bg-[#2958A4]">
              <p className="text-white w-[105px] text-[16px] font-medium leading-[26px] tracking-[-0.32px]">Subscribe Now</p>
            </button>
          </div>

        </div>

      </div>
    </section>

  );
};

export default Newsletter;
