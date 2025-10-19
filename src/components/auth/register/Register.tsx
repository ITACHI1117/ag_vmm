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
import { Spinner } from "@/components/ui/spinner";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { useRegister } from "@/queries/auth.queries";
import {
  useGetActiveKey,
  useUpdateRoleKey,
} from "@/queries/keyGenerator.queries";
import { registerSchema } from "@/schema/auth";
import { supabase } from "@/supabse-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Shield } from "lucide-react";
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
  // get active role key
  const GetActiveKey = useGetActiveKey();
  // update role key query
  const UpdateRoleKeyQuery = useUpdateRoleKey();

  useEffect(() => {
    if (GetActiveKey.isSuccess) {
      console.log(GetActiveKey.data);
    }
  }, [GetActiveKey.isSuccess]);

  // useEffect(() => {
  //   if (GetActiveKey.isSuccess) {
  //     UpdateRoleKeyQuery.mutateAsync({
  //       status: "used",
  //       role_key: GetActiveKey.data[0].role_key,
  //     });
  //   }
  // }, [GetActiveKey.isSuccess]);

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

  // validate role key
  function ValidateRoleKey(key) {
    // fetch role key
    if (GetActiveKey.data && GetActiveKey.data.length == 0) {
      return false;
    }
    console.log(GetActiveKey.data);
    if (GetActiveKey.data && GetActiveKey.data[0].role_key === key) {
      return true;
    } else {
      return false;
    }
  }

  const handleRegister = async (data) => {
    console.log("Registration data:", data);

    // Step 1: Validate role key
    const isValidKey = ValidateRoleKey(data.roleKey);
    if (!isValidKey) {
      toast.error("Invalid role key");
      return;
    }

    try {
      // Step 2: Register the user in Supabase Auth
      const promise = RegisterQuery.mutateAsync({
        email: data.email,
        password: data.password,
      });

      toast.promise(promise, {
        loading: "Creating your account...",
        error: "Failed to create account.",
      });

      const result = await promise;
      console.log(result);
      const userId = result?.user?.id;
      // console.log(userId);

      // Step 3: Stop immediately if no userId
      if (result?.user?.identities?.length == 0) {
        toast.error("User already exist");
        // console.error("Supabase did not return a valid user ID:", result);
        return;
      }

      // Step 4: Insert user record in your 'users' table
      const { fullName, password, roleKey, ...rest } = data;
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          ...rest,
          full_name: fullName,
          role_key: roleKey,
          role: GetActiveKey?.data?.[0]?.role_type?.name ?? null,
          user_id: userId,
        })
        .single();

      if (insertError) {
        console.error("User insert failed:", insertError);
        toast.error("Something went wrong while saving your details.");
        return;
      }

      toast.success(
        "Sign Up Successful! Check your email for verification instructions."
      );
      // Step 5: Update role key status
      try {
        await UpdateRoleKeyQuery.mutateAsync({
          status: "used",
          role_key: GetActiveKey?.data?.[0]?.role_key,
        });
      } catch (updateError) {
        console.error("Failed to update role key:", updateError);
        toast.error("User created, but failed to update role key.");
      }

      // Step 6: Done
      toast.success("Redirecting to login");
      push("/auth/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.message || "An unexpected error occurred during registration."
      );
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
                    <FormLabel>Full Name</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
              {/* removed the role select field this is now detrmined by the IT Admin */}
              {/* <FormField
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
              /> */}
              <FormField
                name="roleKey"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Key</FormLabel>
                    <Input
                      id="roleKey"
                      type="text"
                      placeholder="uuid"
                      {...field}
                      className="w-full"
                    />
                    <FormDescription>
                      Your role key is a unique ID generated by the IT Admin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                        className="w-full pr-10" // add padding-right for icon space
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
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
