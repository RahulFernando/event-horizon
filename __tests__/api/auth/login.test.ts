/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST as handler } from "@/app/api/auth/login/route"; // Import the API handler
import { NextRequest } from "next/server";

describe("POST /api/auth/login", () => {
  const mockFetchRequest = (body: any) => {
    return new NextRequest("http://localhost:3006/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
  };

  it("should return 200 and a token for valid credentials", async () => {
    const req = mockFetchRequest({
      email: "rahulrulz680@gmail.com",
      password: "rahulF@123",
    });

    const res = await handler(req);

    expect(res.status).toBe(200);
    const responseData = await res.json();
    expect(responseData).toHaveProperty("token");
  });

  it("should return 404 for an invalid email", async () => {
    const req = mockFetchRequest({
      email: "invalid@example.com",
      password: "Test@1234",
    });

    const res = await handler(req);

    expect(res.status).toBe(404);
    const responseData = await res.json();
    expect(responseData.message).toBe("Incorrect email address");
  });

  it("should return 400 for an incorrect password", async () => {
    const req = mockFetchRequest({
      email: "json@gmail.com",
      password: "jasonR@123",
    });

    const res = await handler(req);

    expect(res.status).toBe(400);
    const responseData = await res.json();
    expect(responseData.message).toBe("Incorrect password");
  });

  it("should return 400 for missing email or password", async () => {
    const req = mockFetchRequest({});

    const res = await handler(req);

    expect(res.status).toBe(400);
    const responseData = await res.json();
    expect(responseData.errors).toBeDefined();
  });
});
