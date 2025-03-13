import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Aside } from "./Aside";
import { Menu } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";

export interface AsideProps {
  checkComments: string;
  notAllowed: string;
  changeLanguage: string;
  escape: string;
}

interface SidebarDashboardProps {
  t: {
    aside: AsideProps;
    header: string;
  };
}

export function SidebarDashboard({ t }: SidebarDashboardProps) {
  return (
    <>
      <div className="hidden md:block">
        <Aside {...t.aside} />
      </div>

      <div className="md:hidden">
        <Sheet>
          <div className="relative p-4 pb-0">
            <div className="absolute z-50">
              <SheetTrigger>
                <Menu className="text-cosmic-blue size-7" />
              </SheetTrigger>
            </div>
            <div className="text-center">
              <DashboardHeader />
            </div>
          </div>

          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader>
              <SheetTitle className="hidden" />
              <SheetDescription className="hidden" />
            </SheetHeader>
            <Aside {...t.aside} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
