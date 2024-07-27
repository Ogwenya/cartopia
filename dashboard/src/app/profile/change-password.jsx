import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ChangePasswordForm({ user, access_token }) {
  const { toast } = useToast();

  const [current_password, set_current_password] = useState("");
  const [new_password, set_new_password] = useState("");
  const [confirm_new_password, set_confirm_new_password] = useState("");
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);

  const change_password = async () => {
    set_error(null);

    if (!current_password || !new_password || !confirm_new_password) {
      set_error("Fill all the fields.");
      return;
    }

    try {
      set_loading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/users/update-password/${user.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            current_password,
            new_password,
            confirm_new_password,
            account_type: "administrator",
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const result = await res.json();

      set_loading(false);

      if (result.error) {
        set_error(
          Array.isArray(result.message) ? result.message[0] : result.message
        );
      } else {
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        });
        set_current_password("");
        set_new_password("");
        set_confirm_new_password("");
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Change Password</CardTitle>
        <CardDescription>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <span>Enter your new password below.</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid gap-2">
          <Label htmlFor="current_password">Current Password</Label>
          <Input
            id="current_password"
            type="password"
            value={current_password}
            onChange={(e) => set_current_password(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new_password">New Password</Label>
          <Input
            id="new_password"
            type="password"
            value={new_password}
            onChange={(e) => set_new_password(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm_new_password">Confirm New Password</Label>
          <Input
            id="confirm_new_password"
            type="password"
            value={confirm_new_password}
            onChange={(e) => set_confirm_new_password(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton
          className="w-full"
          loading={loading}
          onClick={change_password}
        >
          Change Password
        </SubmitButton>
      </CardFooter>
    </Card>
  );
}
