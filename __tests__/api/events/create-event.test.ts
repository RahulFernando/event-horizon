/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST as handler } from "@/app/api/events/route"; // Import the API handler
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma"; // Import Prisma client

describe("POST /api/events", () => {
  let createdEventId: string | null = null;

  const mockFetchRequest = (body: any) => {
    return new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
  };

  afterAll(async () => {
    if (createdEventId) {
      await prisma.event.delete({
        where: { id: createdEventId },
      });
    }
    await prisma.$disconnect();
  });

  it("should create an event successfully (201)", async () => {
    const req = mockFetchRequest({
      title: "Tech Conference 2025",
      venue: "New York Convention Center",
      date_time: "2025-06-15T10:00:00Z",
      duration: "2",
      event_type_id: "47dbb263-2597-4430-969e-08be5f138f8d",
      organizer_id: "0f5e6e7d-ef75-4299-88b2-8537193646d7",
    });

    const res = await handler(req);

    expect(res.status).toBe(201);
    const responseData = await res.json();
    expect(responseData).toHaveProperty("id");
    expect(responseData.title).toBe("Tech Conference 2025");

    createdEventId = responseData.id;
  });

  it("should return 400 for missing required fields", async () => {
    const req = mockFetchRequest({
      venue: "",
      date_time: "",
      duration: "5",
      event_type_id: "47dbb263-2597-4430-969e-08be5f138f8d",
      organizer_id: "0f5e6e7d-ef75-4299-88b2-8537193646d7",
    });

    const res = await handler(req);

    expect(res.status).toBe(400);
    const responseData = await res.json();
    expect(responseData.errors).toBeDefined();
  });
});
