"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import SubmitButton from "@/components/ui/submit-button";

const PasswordResetForm = ({ user_id, reset_token }) => {
  const [new_password, set_new_password] = useState("");
  const [confirm_new_password, set_confirm_new_password] = useState("");
  const [error, set_error] = useState(null);
  const [success, set_success] = useState(false);
  const [loading, set_loading] = useState(false);

  const reset_password = async () => {
    // reset error message
    set_error(null);

    if (!new_password || !confirm_new_password) {
      set_error("Fill all fields.");
      return;
    }

    try {
      set_loading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/auth/password-reset/${user_id}/${reset_token}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            new_password,
            confirm_new_password,
            account_type: "customer",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      set_loading(false);

      if (result.error) {
        set_error(
          Array.isArray(result.message) ? result.message[0] : result.message
        );
      } else {
        set_success(true);
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <section className="section-spacing">
      {success ? (
        <Card className="mx-auto md:w-auto md:min-w-96 max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Password Reset Success.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Your password has been successfully reset, you can proceed to
              login.
            </p>

            <Button asChild className="mt-4">
              <Link href="/auth/login"> Proceed to Login</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mx-auto md:w-auto md:min-w-96 max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Password Reset</CardTitle>

            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="break-words">
                  {error}
                </AlertDescription>
              </Alert>
            ) : (
              <CardDescription>Reset Your Password</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={new_password}
                  onChange={(e) => set_new_password(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm New Password</Label>
                <Input
                  id="confirm_new_password"
                  type="password"
                  value={confirm_new_password}
                  onChange={(e) => set_confirm_new_password(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <SubmitButton loading={loading} onClick={reset_password}>
                Reset Password
              </SubmitButton>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default PasswordResetForm;
