import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const StaffDetails = ({ user }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">User Details</CardTitle>
        <CardDescription className="text-destructive">
          To update your details below, reach out to your administrator .
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid gap-2">
          <Label htmlFor="firstname">Firstname</Label>
          <p className="lex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {user?.firstname}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastname">Lastname</Label>
          <p className="lex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {user?.lastname}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <p className="lex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {user?.email}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <p className="lex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            Staff
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffDetails;
