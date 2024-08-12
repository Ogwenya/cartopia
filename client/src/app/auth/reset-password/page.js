"use client";

import { useState } from "react";
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
import { AlertCircle, CircleCheck } from "lucide-react";
import SubmitButton from "@/components/ui/submit-button";

const ResetPasswordPage = () => {
  const [email, set_email] = useState("");
  const [success, set_success] = useState(null);
  const [error, set_error] = useState(null);
  const [loading, set_loading] = useState(false);

  const send_reset_link = async () => {
    // reset error message
    set_error(null);
    set_success(null);

    if (!email) {
      set_error("Provide your email address.");
      return;
    }

    try {
      set_loading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/auth/generate-reset-token`,
        {
          method: "POST",
          body: JSON.stringify({ email, account_type: "customer" }),
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
        set_success(result.message);
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <section className="section-spacing">
      <Card className="mx-auto md:w-auto md:min-w-96 max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Password Reset</CardTitle>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <CardDescription>
              Enter your email to recieve password reset link
            </CardDescription>
          )}

          {success && (
            <Alert variant="success">
              <CircleCheck className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => set_email(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <SubmitButton loading={loading} onClick={send_reset_link}>
              Send Link
            </SubmitButton>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ResetPasswordPage;
