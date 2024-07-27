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

const UpdateDetails = ({ user, access_token, updateSession }) => {
  const { toast } = useToast();

  const [firstname, set_firstname] = useState(user.firstname);
  const [lastname, set_lastname] = useState(user.lastname);
  const [email, set_email] = useState(user.email);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);

  const update_details = async () => {
    set_error(null);

    if (!firstname || !lastname || !email) {
      set_error("Fill all the fields.");
      return;
    }

    try {
      set_loading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/users/${user.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            account_type: "administrator",
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const result = await res.json();

      if (result.error) {
        set_loading(false);
        set_error(
          Array.isArray(result.message) ? result.message[0] : result.message
        );
      } else {
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        });
        await updateSession(result.access_token);
        set_loading(false);
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">User Details</CardTitle>
        <CardDescription>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <span>You can change your details below.</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid gap-2">
          <Label htmlFor="firstname">Firstname</Label>
          <Input
            id="firstname"
            type="text"
            value={firstname}
            onChange={(e) => set_firstname(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastname">Lastname</Label>
          <Input
            id="lastname"
            type="text"
            value={lastname}
            onChange={(e) => set_lastname(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => set_email(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton
          className="w-full"
          loading={loading}
          onClick={update_details}
        >
          Update Details
        </SubmitButton>
      </CardFooter>
    </Card>
  );
};

export default UpdateDetails;
