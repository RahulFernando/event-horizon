/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST as handler } from "@/app/api/auth/register/route"; // Import the API handler
import { NextRequest } from "next/server";

describe("POST /api/auth/register", () => {
  const mockFetchRequest = (body: any) => {
    return new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
  };

  it("should return 201 and create a new user", async () => {
    const req = mockFetchRequest({
      email: "testuser@example.com",
      password: "StrongPass@123",
      user: {
        name: "Test User",
        contacts: ["+123456789"],
        user_type: "ORGANIZER",
        addresses: [
          {
            line_1: "123 Main St",
            country: "USA",
            postal_code: "12345",
          },
        ],
      },
    });

    const res = await handler(req);

    expect(res.status).toBe(201);
    const responseData = await res.json();
    expect(responseData).toHaveProperty("profile");
    expect(responseData).toHaveProperty("account");
  });

  it("should return 400 for missing required fields", async () => {
    const req = mockFetchRequest({
      email: "",
      password: "WeakPass",
      user: {
        name: "",
        contacts: [],
        user_type: "ORGANIZER",
        addresses: [],
      },
    });

    const res = await handler(req);

    expect(res.status).toBe(400);
    const responseData = await res.json();
    expect(responseData.errors).toBeDefined();
  });

  it("should return 400 for invalid email format", async () => {
    const req = mockFetchRequest({
      email: "invalid-email",
      password: "ValidPass@123",
      user: {
        name: "Test User",
        contacts: ["+123456789"],
        user_type: "ORGANIZER",
        addresses: [
          {
            line_1: "123 Main St",
            country: "USA",
            postal_code: "12345",
          },
        ],
      },
    });

    const res = await handler(req);

    expect(res.status).toBe(400);
    const responseData = await res.json();
    expect(responseData.errors).toContain("Invalid email address");
  });

  it("should return 400 for a weak password", async () => {
    const req = mockFetchRequest({
      email: "test@example.com",
      password: "weakpass",
      user: {
        name: "Test User",
        contacts: ["+123456789"],
        user_type: "VENDOR",
        addresses: [
          {
            line_1: "123 Main St",
            country: "USA",
            postal_code: "12345",
          },
        ],
      },
    });

    const res = await handler(req);

    expect(res.status).toBe(400);
    const responseData = await res.json();
    expect(responseData.errors).toContain("Password must contain a number");
    expect(responseData.errors).toContain(
      "Password must contain a special character"
    );
  });

  it("should return 500 for an unsupported user type", async () => {
    const req = mockFetchRequest({
      email: "testuser@example.com",
      password: "StrongPass@123",
      user: {
        name: "Test User",
        contacts: ["+123456789"],
        user_type: "UNKNOWN_ROLE",
        addresses: [
          {
            line_1: "123 Main St",
            country: "USA",
            postal_code: "12345",
          },
        ],
      },
    });

    const res = await handler(req);

    expect(res.status).toBe(500);
    const responseData = await res.json();
    expect(responseData.errors).toContain("Invalid user type");
  });
});
