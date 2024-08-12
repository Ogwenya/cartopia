"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
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
import SubmitButton from "@/components/ui/submit-button";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, set_loading] = useState(false);
  const [firstname, set_firstname] = useState("");
  const [lastname, set_lastname] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [confirm_password, set_confirm_password] = useState("");
  const [error, set_error] = useState(null);

  const create_account = async () => {
    set_error(null);

    if (!firstname || !lastname || !email || !password) {
      set_error("Provide firstname, lastname, email and role.");
      return;
    }

    // if (password !== confirm_password) {
    //   set_error("Passwords do not match.");
    //   return;
    // }

    try {
      set_loading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/client/users`,
        {
          method: "POST",
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            confirm_password,
          }),
          headers: {
            "Content-Type": "application/json",
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
          title: "Signup success.",
          description:
            "Account created successfully, you may now proceed to login.",
        });

        router.push("/auth/login");
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <section className="section-spacing">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First name</Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  value={firstname}
                  onChange={(e) => set_firstname(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last name</Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  value={lastname}
                  onChange={(e) => set_lastname(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => set_password(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirm_password}
                onChange={(e) => set_confirm_password(e.target.value)}
                disabled={loading}
              />
            </div>
            <SubmitButton
              type="submit"
              loading={loading}
              onClick={create_account}
              className="w-full"
            >
              Create an account
            </SubmitButton>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
