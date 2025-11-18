import { prisma } from "@/lib/prismaDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const subscribers = await prisma.newsletter.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { subscribers, count: subscribers.length },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { message: "Failed to fetch subscribers", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
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

    const formattedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await prisma.newsletter.findUnique({
      where: {
        email: formattedEmail,
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 409 }
      );
    }

    // Create newsletter subscription
    const subscription = await prisma.newsletter.create({
      data: {
        email: formattedEmail,
      },
    });

    return NextResponse.json(
      { message: "Successfully subscribed to newsletter!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    // More detailed error message
    let errorMessage = "Internal Server Error";
    if (error.code === "P6008") {
      errorMessage = "Database connection failed. Please check your database configuration.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

