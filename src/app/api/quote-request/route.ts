import { prisma } from "@/lib/prismaDB";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { message: "Invalid request body. Please check your form data." },
        { status: 400 }
      );
    }

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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        productOrService: productOrService ? productOrService.trim() : "",
        company: company.trim(),
        message: message ? message.trim() : null,
        status: "pending",
      },
    });

    // Send email notification for contact form submissions (when productOrService is empty)
    const isContactForm = !productOrService || productOrService.trim() === "";
    
    if (isContactForm) {
      try {
        // Get recipient emails from environment variable or use defaults
        const recipientEmails = process.env.CONTACT_FORM_RECIPIENTS
          ? process.env.CONTACT_FORM_RECIPIENTS.split(',').map(email => email.trim())
          : [
              "chanceweston97@gmail.com",
              "daniel@zdacomm.com"
            ];

        // Escape HTML to prevent XSS attacks
        const escapeHtml = (text: string) => {
          return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        };

        const emailSubject = `New Contact Form Submission from ${escapeHtml(firstName)} ${escapeHtml(lastName)}`;
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2958A4;">New Contact Form Submission</h2>
            <div style="background-color: #f4f5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
              <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>
              <p><strong>Company:</strong> ${escapeHtml(company)}</p>
              ${message ? `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This email was sent from the contact form on your website.
            </p>
          </div>
        `;

        await sendEmail({
          to: recipientEmails,
          subject: emailSubject,
          html: emailHtml,
          replyTo: email.trim(),
        });

        console.log("Contact form email sent successfully to:", recipientEmails);
      } catch (emailError: any) {
        // Log email error but don't fail the request
        console.error("Failed to send contact form email:", emailError);
        // Continue with the response even if email fails
      }
    }

    return NextResponse.json(
      { 
        message: "Quote request submitted successfully!",
        id: quoteRequest.id 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Quote request error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    // Handle Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "A quote request with this information already exists" },
        { status: 409 }
      );
    }
    
    // Handle Prisma schema mismatch errors
    if (error.message?.includes("Unknown argument") || error.message?.includes("Unknown field")) {
      console.error("Prisma schema mismatch detected. Please run: npx prisma generate && npx prisma migrate dev");
      return NextResponse.json(
        { message: "Database schema error. Please contact support." },
        { status: 500 }
      );
    }
    
    // Handle database connection errors
    if (error.code === "P1001" || error.message?.includes("Can't reach database server")) {
      return NextResponse.json(
        { message: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: error.message || "Failed to submit quote request. Please try again." },
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

