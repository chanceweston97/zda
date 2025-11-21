import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";
import { createClient } from "@sanity/client";

// Sanity client for creating orders
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2023-03-09",
  useCdn: false,
  token: process.env.SANITY_PROJECT_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderId,
      status,
      totalPrice,
      userId,
      userEmail,
      productQuantity,
      orderTitle,
      country,
      city,
      postalCode,
      line1,
      line2,
      products,
    } = body;

    // Basic validation
    if (
      !orderId ||
      !status ||
      !userEmail ||
      !productQuantity ||
      !country ||
      !city ||
      !products
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order in Prisma database
    const order = await prisma.order.create({
      data: {
        orderId,
        status,
        totalPrice,
        userId,
        userEmail,
        productQuantity,
        orderTitle,
        country,
        city,
        postalCode,
        line1,
        line2,
        products,
      },
    });

    // Also create order in Sanity CMS for admin panel
    try {
      // Map status to Sanity status values (Sanity only has: processing, on-hold, delivered)
      let sanityStatus = "processing";
      if (status === "pending") {
        sanityStatus = "processing";
      } else if (status === "paid") {
        sanityStatus = "processing";
      } else if (status === "processing" || status === "on-hold" || status === "delivered") {
        sanityStatus = status;
      }

      const sanityOrder = {
        _type: "order",
        orderId: orderId,
        status: sanityStatus,
        totalPrice: totalPrice,
        userId: userId || "",
        userEmail: userEmail.toLowerCase(),
        productQuantity: productQuantity,
        orderTitle: orderTitle || "Order from ZDAComm",
        country: country || "",
        city: city || "",
        postalCode: postalCode || "",
        line1: line1 || "",
        line2: line2 || "",
        orderDescription: products
          ? `Products: ${products.map((p: any) => `${p.name} (x${p.quantity})`).join(", ")}`
          : "",
      };

      await sanityClient.create(sanityOrder);
      console.log("Order created in Sanity:", orderId);
    } catch (sanityError: any) {
      // Log error but don't fail the request if Sanity creation fails
      console.error("Failed to create order in Sanity:", sanityError?.message || sanityError);
      // Continue even if Sanity creation fails
    }

    return NextResponse.json(
      { success: true, message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error?.stack || error, "error in create order route");
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}