"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { useRegister } from "@/queries/auth.queries";
import { registerSchema } from "@/schema/auth";
import { supabase } from "@/supabse-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    roleKey: "",
  });
  const [error, setError] = useState("");
  const { push } = useProgressBarNavigation();

  // sign up query
  const RegisterQuery = useRegister();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      roleKey: "",
      password: "",
    },
  });

  const handleRegister = async (data) => {
    console.log(data);
    try {
      const promise = RegisterQuery.mutateAsync({
        email: data.email,
        password: data.password,
      });

      toast.promise(promise, {
        loading: "Signing In",
      });

      // await supabase auth sign up to complete
      const result = await promise;
      console.log(result);

      // once mutation succeeds, insert the rest of the data in Supabase users table
      const { fullName, password, roleKey, ...rest } = data;
      const { error } = await supabase
        .from("users")
        .insert({ ...rest, full_name: fullName, role_key: roleKey })
        .single();

      if (error) {
        // dosent work yet FIX JOSEPH
        await supabase.auth.admin.deleteUser(result.user.id);
        toast.error("User record creation failed, rolled back.");
        return;
      }

      toast.success(
        "Sign Up Successfully, Check your mail for your verification code."
      );
      console.log("Registration attempt:", data);
      push("/auth/login");
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error(error);
    }
  };

  useEffect(() => {
    RegisterQuery.isError &&
      toast.error(`Error While trying to sign up, ${RegisterQuery.error}`);
  }, [RegisterQuery.isError]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative bg-primary rounded-full p-3">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join A&G Insurance Vehicle Maintenance Management
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="gap-4 flex flex-col"
            >
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      {...field}
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@aginsuranceplc.com"
                      {...field}
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Yor role key is a unique ID generated by the IT admin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="roleKey"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Input
                      id="roleKey"
                      type="text"
                      placeholder="role Key"
                      {...field}
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Input
                      id="password"
                      type="text"
                      placeholder="Password"
                      {...field}
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={RegisterQuery.isPending}
                className="cursor-pointer"
                type="submit"
              >
                {RegisterQuery.isPending ? (
                  <>
                    <Spinner />
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </FormProvider>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-border"
              required
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I agree to the{" "}
              <span className="text-primary hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-primary hover:underline">
                Privacy Policy
              </span>
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => push("/auth/login")}
              className="text-primary hover:underline font-medium cursor-pointer "
            >
              Sign In
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
