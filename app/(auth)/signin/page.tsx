"use server";

import SigninClient from "@/app/(auth)/signin/SigninClient";

const SigninPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) => {
  const params = await searchParams;
  const redirectTo = params?.redirectTo || "/";

  return <SigninClient redirectTo={redirectTo} />;
};

export default SigninPage;
