import { Card, CardContent } from "@/components/ui/card";
import {
  LargeScreenSidebar,
  SmallScreenSidebar,
} from "@/components/account/account-sidebar";

export const metadata = {
  title: "Account",
};

const LargeScreenLayout = ({ children }) => {
  return (
    <div className="flex gap-x-5 max-w-5xl min-h-[60svh] py-5 mx-auto">
      <LargeScreenSidebar />
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
      <div className="max-lg:hidden">
        <LargeScreenLayout>{children}</LargeScreenLayout>
      </div>
      <div className="lg:hidden">
        <SmallScreenLayout>{children}</SmallScreenLayout>
      </div>
    </section>
  );
}
