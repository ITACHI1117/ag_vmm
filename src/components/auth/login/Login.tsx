"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Car } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { loginSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { useLogin } from "@/queries/auth.queries";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import { createClient, supabase } from "@/supabse-client";

// Login Page Component
export const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { push } = useProgressBarNavigation();
  const LoginQuery = useLogin();
  const { setUser } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      const promise = LoginQuery.mutateAsync(data);
      toast.promise(promise, {
        loading: "Logging in...",
      });
      // await the login promise
      const result = await promise;
      // fetch user extra information fro the users table
      // we need the user role stored globally
      const { error, data: UserData } = await supabase
        .from("users")
        .select("*")
        .eq("email", result.user?.email)
        .single();
      if (error) {
        toast.error(`${error}`);
        return;
      }
      // store the user role
      setUser(UserData);
      toast.success(`Welcome Back ${UserData.full_name}`);
      push("/dashboard/overview");
    } catch (error) {
      toast.error(`${error}`);
    }
    // Add your login logic here
    console.log("Login attempt:", { email, password });
    push("/dashboard/overview");
  };

  // useEffect(() => {
  //   if (LoginQuery.isSuccess) {
  //     console.log(LoginQuery.data);
  //     toast.success("Welcome Back");
  //   }
  // });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative bg-primary rounded-full p-3">
                <Car className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-Inter">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to A&G Insurance Vehicle Maintenance Management
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
              onSubmit={form.handleSubmit(handleLogin)}
              className="gap-4 flex flex-col"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@aginsurance.com"
                        {...field}
                        // className="w-full"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
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
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="cursor-pointer" type="submit">
                {LoginQuery.isPending ? (
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
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              className="text-primary hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => push("/auth/register")}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
