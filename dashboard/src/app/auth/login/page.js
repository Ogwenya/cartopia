"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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

const LoginPage = () => {
  const router = useRouter();
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error, set_error] = useState(null);
  const [loading, set_loading] = useState(false);

  const user_login = async () => {
    // reset error message
    set_error(null);

    if (!email || !password) {
      set_error("Provide an email and password");
      return;
    }

    try {
      set_loading(true);
      const loginResponse = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      set_loading(false);

      if (loginResponse.error) {
        set_error(loginResponse.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="mx-autow-full md:w-auto md:min-w-96 max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>

          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-8">
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/reset-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => set_password(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <SubmitButton loading={loading} onClick={user_login}>
              Login
            </SubmitButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
