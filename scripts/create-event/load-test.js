/* eslint-disable import/no-anonymous-default-export */
import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// Test configuration
export const options = {
  // Basic test: 10 virtual users, ramping up over 30s, 1 minute test
  stages: [
    { duration: "30s", target: 10 }, // Ramp up to 10 users
    { duration: "1m", target: 10 }, // Stay at 10 users for 1 minute
    { duration: "20s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should complete within 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests should fail
  },
};

const eventTypeIds = [
  "47dbb263-2597-4430-969e-08be5f138f8d",
  "72944de0-d445-42ea-a8aa-20ad60b47ac7",
  "f5f33ff1-6e63-4c51-b567-84bbdbc86d25",
  "3e09d041-f38c-4f50-823d-f6259a9d8324",
];

const apiUrl = "http://localhost:3000/api/events";

export default function () {
  // Generate a random event title with timestamp to avoid duplicates
  const eventTitle = `Test Event: ${randomString(
    8
  )} - ${new Date().toISOString()}`;

  // Get a random event type ID from the array
  const randomEventTypeId =
    eventTypeIds[Math.floor(Math.random() * eventTypeIds.length)];

  // Calculate a random future date (1-30 days from now)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);

  // Prepare the payload
  const payload = JSON.stringify({
    title: eventTitle,
    date_time: futureDate.toISOString(),
    event_type_id: randomEventTypeId,
    venue: "EFL Campus",
    organizer_id: "0f5e6e7d-ef75-4299-88b2-8537193646d7",
  });

  const headers = {
    "Content-Type": "application/json",
  };

  // Make the POST request
  const response = http.post(apiUrl, payload, { headers });

  // Verify the response
  check(response, {
    "status is 201": (r) => r.status === 201,
    "response has event ID": (r) => JSON.parse(r.body).id !== undefined,
    "response time < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(Math.random() * 4 + 1);
}
