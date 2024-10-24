import { Card, CardContent } from "@/components/ui/card";
import {
  DesktopSidebar,
  SmallScreenSidebar,
} from "@/components/account/account-sidebar";

export const metadata = {
  title: "Account",
};

const DesktopLayout = ({ children }) => {
  return (
    <div className="flex gap-x-5 max-w-5xl min-h-[60svh] py-5 mx-auto">
      <DesktopSidebar />
      <div className="flex-1 ">
        <Card className="h-full py-4">
          <CardContent className="h-full">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
};

const SmallScreenLayout = ({ children }) => {
  return (
    <div>
      <SmallScreenSidebar />
      <Card className="h-full py-4">
        <CardContent className="h-full">{children}</CardContent>
      </Card>
    </div>
  );
};

export default async function RootLayout({ children }) {
  return (
    <section>
      <div className="max-md:hidden">
        <DesktopLayout>{children}</DesktopLayout>
      </div>
      <div className="md:hidden">
        <SmallScreenLayout>{children}</SmallScreenLayout>
      </div>
    </section>
  );
}
