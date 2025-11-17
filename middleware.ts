// export { auth as middleware } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!request.cookies.get("session_cart_id")) {
    const session_cart_id = crypto.randomUUID();

    const newRequestHeaders = new Headers(request.headers);
    const response = NextResponse.next({
      request: {
        headers: newRequestHeaders,
      },
    });

    response.cookies.set("session_cart_id", session_cart_id);

    return response;
  }

  const protectedPaths = [
    /^\/shipping-address/,
    /^\/place-order/,
    /^\/profile/,
    /^\/user\/(.*)/,
    /^\/order\/(.*)/,
    /^\/admin/,
  ];

  const isProtected = protectedPaths.some((regex) => regex.test(pathname));

  if (isProtected) {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      const redirectUrl = `/signin?redirectTo=${pathname}${request.nextUrl.search}`;
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  //If have no shipping and payment method
  if (pathname.startsWith("/place-order")) {
    const address = request.cookies.get("address")?.value;
    const payment_method = request.cookies.get("payment_method")?.value;

    if (!address && !payment_method) {
      try {
        const baseUrl = request.nextUrl.origin;
        const res = await fetch(`${baseUrl}/api/user`, {
          headers: request.headers,
        });

        const userInfo = await res.json();

        if (!userInfo.data.address || !userInfo.data.payment_method) {
          return NextResponse.redirect(
            new URL("/shipping-address", request.url)
          );
        }
      } catch (err) {
        console.log("Shipping check failed:", err);
        return NextResponse.redirect(new URL("/shipping-address", request.url));
      }
    }

    //console.log(address, payment_method);
  }

  return NextResponse.next();
}
