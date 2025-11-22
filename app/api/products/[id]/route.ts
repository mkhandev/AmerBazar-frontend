import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/lib/constants";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const { id } = await params;
    if (!id) throw new Error("Product ID is required");

    const session = await auth();
    const accessToken = session?.accessToken;

    if (!accessToken) throw new Error("Please login");

    const res = await fetch(`${apiUrl}/product-details/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message:
            data.message || "Failed to fetch product details from server",
          error: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch order details", error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const accessToken = session?.accessToken;
    if (!accessToken) throw new Error("Please login");

    const { id } = await params;
    if (!id) throw new Error("Product ID is required");

    const formData = await request.formData();

    if (!formData.has("_method")) {
      formData.append("_method", "PATCH");
    }

    //console.log(formData);

    const res = await fetch(`${apiUrl}/update-product/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await res.json();

    //console.log(data);

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to update product", error: data },
        { status: res.status }
      );
    }

    //revalidatePath(`/admin/products/${id}`);

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update product", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const accessToken = session?.accessToken;
    if (!accessToken) throw new Error("Please login");

    const { id } = await params;
    if (!id) throw new Error("Product ID is required");

    console.log(id);

    const res = await fetch(`${apiUrl}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to add product", error: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add product", error: error.message || error },
      { status: 500 }
    );
  }
}
