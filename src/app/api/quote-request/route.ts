import { prisma } from "@/lib/prismaDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, productOrService, company, message } = body;

    // Validate required fields (productOrService is optional for product detail pages)
    if (!firstName || !lastName || !email || !phone || !company) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create quote request
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        productOrService: productOrService || "",
        company,
        message: message || null,
        status: "pending",
      },
    });

    return NextResponse.json(
      { 
        message: "Quote request submitted successfully!",
        id: quoteRequest.id 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Quote request error:", error);
    
    return NextResponse.json(
      { message: "Failed to submit quote request", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const quoteRequests = await prisma.quoteRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { quoteRequests, count: quoteRequests.length },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching quote requests:", error);
    
    return NextResponse.json(
      { message: "Failed to fetch quote requests", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Quote request ID is required" },
        { status: 400 }
      );
    }

    // Delete the quote request
    await prisma.quoteRequest.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Quote request deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting quote request:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Quote request not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to delete quote request", error: error.message },
      { status: 500 }
    );
  }
}

