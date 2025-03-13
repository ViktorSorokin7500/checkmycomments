"use client";
import { Button } from "@/components/ui";
import { useAnalysisStore } from "@/lib/store";
import { AsideProps } from "./SidebarDashboard";

export function Aside({
  checkComments,
  notAllowed,
  changeLanguage,
  escape,
}: AsideProps) {
  const isDisabled = false;
  const { url } = useAnalysisStore();

  return (
    <aside className="w-64 bg-cosmic-blue flex flex-col justify-between text-white p-4 fixed h-full overflow-y-auto">
      <div>
        <h2 className="text-2xl text-center font-bold mb-6">CommentPulse</h2>
        <Button
          className="w-full mb-2 bg-soft-fog hover:bg-soft-fog/80 text-black disabled:opacity-50"
          disabled={!url}
        >
          {checkComments}
        </Button>
        <Button
          className="w-full mb-2 bg-soft-fog hover:bg-soft-fog/80 text-black disabled:opacity-50"
          disabled={isDisabled}
        >
          {notAllowed}
        </Button>
        <Button
          className="w-full mb-2 bg-soft-fog hover:bg-soft-fog/80 text-black disabled:opacity-50"
          disabled={isDisabled}
        >
          {notAllowed}
        </Button>
        <Button
          className="w-full mb-2 bg-soft-fog hover:bg-soft-fog/80 text-black disabled:opacity-50"
          disabled={isDisabled}
        >
          {notAllowed}
        </Button>
        <Button
          className="w-full mb-2 bg-soft-fog hover:bg-soft-fog/80 text-black disabled:opacity-50"
          disabled={isDisabled}
        >
          {notAllowed}
        </Button>
        <Button
          className="w-full mb-2 bg-soft-fog hover:bg-soft-fog/80 text-black disabled:opacity-50"
          disabled={isDisabled}
        >
          {notAllowed}
        </Button>
        <Button
          className="w-full mb-2 bg-soft-fog hover:bg-soft-fog/80 text-black disabled:opacity-50"
          disabled={isDisabled}
        >
          {notAllowed}
        </Button>
      </div>
      <div>
        <Button className="w-full mb-2 bg-lime-zest/90 text-sunset-glow hover:bg-lime-zest/80">
          {changeLanguage}
        </Button>
        <Button className="w-full bg-sunset-glow/90 text-lime-zest hover:bg-sunset-glow/80">
          {escape}
        </Button>
      </div>
    </aside>
  );
}
