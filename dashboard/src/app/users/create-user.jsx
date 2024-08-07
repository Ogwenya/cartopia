"use client";

import { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "@/components/ui/submit-button";
import revalide_data from "../actions";

export function CreateUser({ access_token }) {
  const [loading, set_loading] = useState(false);
  const [firstname, set_firstname] = useState("");
  const [lastname, set_lastname] = useState("");
  const [email, set_email] = useState("");
  const [role, set_role] = useState("");
  const [error, set_error] = useState(null);
  const [modal_open, set_modal_open] = useState(false);

  const create_user = async () => {
    set_error(null);
    if (!firstname || !lastname || !email || !role) {
      set_error("Provide firstname, lastname, email and role.");
      return;
    }

    try {
      set_loading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/users`,
        {
          method: "POST",
          body: JSON.stringify({ firstname, lastname, email, role }),
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
        revalide_data("users");
        set_firstname("");
        set_lastname("");
        set_email("");
        set_role("");
        set_error(null);
        set_modal_open(false);
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };
  return (
    <Dialog open={modal_open} onOpenChange={set_modal_open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <span> A password will be sent to the user&apos;s email.</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 gap-y-8 py-4">
          <div className="grid gap-2">
            <Label htmlFor="firstname">Firstname</Label>
            <Input
              id="firstname"
              type="text"
              placeholder="John"
              value={firstname}
              onChange={(e) => set_firstname(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname">Lastname</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Doe"
              value={lastname}
              onChange={(e) => set_lastname(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="doe@example.com"
              value={email}
              onChange={(e) => set_email(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => set_role(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="SUPER_USER">Administrator</SelectItem>
                  <SelectItem value="ADMIN">Staff</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <SubmitButton loading={loading} onClick={create_user}>
            Create User
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
