import HowItWorksTimeline, { type Step } from "@/components/ui/how-it-works";
import { Reveal } from "./Reveal";

const feelzFilmsSteps: Step[] = [
  {
    title: "Team & approach",
    description: "Who we are. A dedicated team acting as your content partner rather than just freelancers.",
    colorTheme: "orange",
  },
  {
    title: "Strategy → production",
    description: "How we work. From initial concept to full-scale production, all handled internally.",
    colorTheme: "blue",
  },
  {
    title: "Results & delivery",
    description: "What we deliver. Tangible business growth and high-quality assets.",
    colorTheme: "purple",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-(--bg) overflow-hidden border-y border-(--border)">
      <div className="max-w-300 mx-auto pt-20 md:pt-28 px-6 md:px-8">
        <Reveal className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-[0.15em] font-bold text-(--accent) uppercase mb-4">How it works</p>
          <h2 className="font-display font-bold text-[clamp(1.75rem,1.5rem+2vw,3rem)] tracking-tight text-(--text) text-balance">
            Who we are. How we work. What you get.
          </h2>
        </Reveal>
      </div>

      <HowItWorksTimeline features={feelzFilmsSteps} />
    </section>
  );
}
