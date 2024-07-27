"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import ChangePasswordForm from "./change-password";
import UpdateDetails from "./update-details";
import StaffDetails from "./staff-details";
import LoadingComponent from "../loading";

const ProfilePage = () => {
  const { status, data: session, update: updateSession } = useSession();

  if (status === "loading") {
    return <LoadingComponent />;
  }

  return (
    <section className="min-h-full">
      <div className="grid lg:grid-cols-3 gap-y-10 lg:gap-x-6">
        <div className="space-y-4 max-lg:col-span-2">
          {/* profile overview */}
          <Card className="w-full">
            <CardContent className="py-2">
              <div className=" flex items-center space-x-4 p-2">
                <User />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user.firstname} {session?.user.lastname}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session?.user.role === "SUPER_USER"
                      ? "Administrator"
                      : "Staff"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* change password form */}
          <ChangePasswordForm
            user={session?.user}
            access_token={session?.access_token}
          />
        </div>
        <div className="col-span-2">
          {session?.user.role === "SUPER_USER" ? (
            <UpdateDetails
              user={session?.user}
              access_token={session?.access_token}
              updateSession={updateSession}
            />
          ) : (
            <StaffDetails user={session?.user} />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
