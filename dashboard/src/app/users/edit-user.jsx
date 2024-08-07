"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

export function EditUserModal({ user, set_modal_open, access_token }) {
  const [firstname, set_firstname] = useState(user.firstname);
  const [lastname, set_lastname] = useState(user.lastname);
  const [email, set_email] = useState(user.email);
  const [role, set_role] = useState(user.role);
  const [status, set_status] = useState(user.is_active);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);

  const update_user = async () => {
    set_error(null);
    if (!firstname || !lastname || !email || !role) {
      set_error("Provide firstname, lastname, email and role.");
      return;
    }

    try {
      set_loading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/users/update-user/${user.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            role,
            is_active: status,
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
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogDescription>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
          <Select value={role} onValueChange={(value) => set_role(value)}>
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
        <div className="grid gap-2 col-span-full">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value) => set_status(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={true}>Active</SelectItem>
                <SelectItem value={false}>Deactivate</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <SubmitButton loading={loading} onClick={update_user}>
          Update User
        </SubmitButton>
      </DialogFooter>
    </DialogContent>
  );
}
