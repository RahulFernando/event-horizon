/* eslint-disable @typescript-eslint/no-explicit-any */
import { PUT as handler } from "@/app/api/events/[id]/route"; // Import the API handler
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma"; // Import Prisma client

describe("PUT /api/events/:id", () => {
  let eventId: string | null = null;

  const mockFetchRequest = (id: string, body: any) => {
    return new NextRequest(`http://localhost:3000/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
  };

  beforeAll(async () => {
    const event = await prisma.event.create({
      data: {
        title: "Original Event",
        venue: "Old Venue",
        date_time: "2025-06-15T10:00:00Z",
        duration: "90",
        created_by: "test-user",
        updated_by: "test-user",
        event_type_id: "f5f33ff1-6e63-4c51-b567-84bbdbc86d25",
        organizer_id: "0f5e6e7d-ef75-4299-88b2-8537193646d7",
      },
    });

    eventId = event.id;
  });

  afterAll(async () => {
    if (eventId) {
      await prisma.event.delete({ where: { id: eventId } });
    }
    await prisma.$disconnect();
  });

  it("should update an existing event successfully (200)", async () => {
    const req = mockFetchRequest(eventId as string, {
      title: "Updated Event",
      venue: "New Venue",
      date_time: "2025-07-20T14:00:00Z",
      duration: "1",
      event_type_id: "f5f33ff1-6e63-4c51-b567-84bbdbc86d25",
      organizer_id: "0f5e6e7d-ef75-4299-88b2-8537193646d7",
    });

    const res = await handler(req, { params: { id: eventId as string } });

    expect(res.status).toBe(200);
    const responseData = await res.json();
    expect(responseData).toHaveProperty("id");
    expect(responseData.title).toBe("Updated Event");
    expect(responseData.venue).toBe("New Venue");
  });

  it("should return 404 when trying to update a non-existent event", async () => {
    const fakeEventId = "non-existent-event-id";

    const req = mockFetchRequest(fakeEventId, {
      title: "Non-Existent Event",
      venue: "Some Venue",
      date_time: "2025-07-20T14:00:00Z",
      duration: "1",
      event_type_id: "47dbb263-2597-4430-969e-08be5f138f8d",
      organizer_id: "0f5e6e7d-ef75-4299-88b2-8537193646d7",
    });

    const res = await handler(req, { params: { id: fakeEventId } });
    expect(res.status).toBe(500);
  });
});
