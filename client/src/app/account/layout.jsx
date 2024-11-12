import { Card, CardContent } from "@/components/ui/card";
import { AccountSidebar } from "@/components/account/account-sidebar";

export const metadata = {
  title: "Account",
};

export default async function AccountLayout({ children }) {
  return (
    <section>
      <div className="max-lg:hidden">
        <div className="lg:flex lg:gap-x-5 lg:max-w-5xl lg:min-h-[60svh] lg:py-5 lg:mx-auto">
          <AccountSidebar />
          <div className="lg:flex-1 ">
            <Card className="h-full py-4">
              <CardContent className="h-full">{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
