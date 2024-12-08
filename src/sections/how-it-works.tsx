import Marquee from "react-fast-marquee";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Account",
      text: "Sign up and verify your identity",
    },
    {
      title: "Upload Records",
      text: "Securely upload your health records",
    },
    {
      title: "NFT Generation",
      text: "Records are converted to NFTs",
    },
    {
      title: "Instant Access",
      text: "Access or share records anytime",
    },
  ];

  return (
    <div>
      <section className="border-t-[3px] border-t-border bg-bg py-20 font-base  lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          How It Works
        </h2>

        <div className="w-container mx-auto grid max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            return (
              <div
                className="flex flex-col  items-center gap-3 rounded-base border-2 border-border bg-white p-5 shadow-light dark:border-darkBorder dark:bg-secondaryBlack dark:shadow-dark"
                key={i}
              >
                <h4 className="text-xl font-heading">{step.title}</h4>
                <p>{step.text}</p>
              </div>
            );
          })}
        </div>
      </section>
      {/* <div>
        <Marquee
          className="border-y-2 border-y-border bg-white py-3 font-base dark:border-darkBorder dark:border-y-darkBorder dark:bg-secondaryBlack sm:py-5"
          direction="left"
        >
          {Array(10)
            .fill("xd")
            .map((x, id) => {
              return (
                <div className="flex items-center" key={id}>
                  <span className="mx-8 text-xl font-heading sm:text-2xl lg:text-4xl">
                    Major Project
                  </span>
                </div>
              );
            })}
        </Marquee>
      </div> */}
    </div>
  );
}
