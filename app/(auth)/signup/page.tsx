import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "@/app/(auth)/signup/SignupForm";

function page() {
  return (
    <div className="w-full flex items-center min-h-[70vh]">
      <div className="w-full max-w-md mx-auto">
        <Card className="px-0">
          <CardHeader className="gap-0 mb-0">
            <CardTitle className="text-center mb-0">Create Account</CardTitle>
            <CardDescription className="text-center mb-0">
              Enter your information below to sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
