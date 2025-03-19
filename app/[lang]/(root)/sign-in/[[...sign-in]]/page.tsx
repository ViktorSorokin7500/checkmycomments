import { BgGradient } from "@/components/shared";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex items-center justify-center lg:min-h-[40vh]">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <BgGradient className="from-orange-400 via-orange-300 to-orange-200" />
        <SignIn />
      </div>
    </section>
  );
}
