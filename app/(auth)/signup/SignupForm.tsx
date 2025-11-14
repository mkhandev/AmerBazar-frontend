"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { signUp } from "@/lib/actions/api";
import { signUpFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

function SignupForm() {
  const router = useRouter();
  const [signupError, setSignupError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    setSignupError(null);
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
    };

    try {
      //User sign up
      const res = await signUp(payload);

      //User login
      const resData = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (resData?.error) {
        setSignupError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setSignupError(err.message);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  className="rounded-[3px]"
                  autoComplete="off"
                  placeholder="Full name"
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
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="rounded-[3px]"
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
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  className="rounded-[3px]"
                  autoComplete="off"
                  placeholder="Phone"
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

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="off"
                  placeholder="Con password"
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
          className="w-full bg-[#37a001] rounded p-2 text-white hover:bg-[#37a001] cursor-pointer flex items-center justify-center"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Spinner className="w-4 h-4 animate-spin" />
          )}
          &nbsp; Sign Up
        </Button>

        {signupError && (
          <div className="text-center text-destructive text-[17px]">
            {signupError}
          </div>
        )}
      </form>
    </Form>
  );
}

export default SignupForm;
