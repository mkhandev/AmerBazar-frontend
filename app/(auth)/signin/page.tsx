"use client";

import { signInSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SigninPage = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setLoginError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      setLoginError("Invalid email or password");
    } else {
      router.push("/");
    }
  };
  return (
    <div className="w-full flex items-center min-h-[70vh]">
      <div className="w-full max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className="space-y-4">
                <CardTitle className="text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Sign in to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="off"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#37a001] rounded p-2 text-white hover:bg-[#37a001] cursor-pointer"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Sign In..." : "Sign In"}
                </Button>

                {loginError && (
                  <div className="text-center text-destructive text-[17px]">
                    {loginError}
                  </div>
                )}

                <div className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account ? &nbsp;
                  <Link
                    href="/signup"
                    target="_self"
                    className="link text-[#37a001] hover:underline"
                  >
                    Sign Up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SigninPage;
