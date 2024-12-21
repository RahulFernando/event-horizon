import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedData() {
  // await prisma.address.deleteMany();
  // await prisma.organizer.deleteMany();
  // await prisma.account.deleteMany();
  // await prisma.user.deleteMany();
  const admin = await prisma.user.upsert({
    where: { id: "af3ba7ca-d9f0-40e8-a863-b36baf4528c4" },
    update: {},
    create: {
      name: "John Doe",
      contacts: ["+94 712 345 678"],
      addresses: {
        create: [
          {
            number: "123",
            line_1: "Main St",
            country: "Sri Lanka",
            postal_code: "10115",
            created_by: "admin",
            updated_by: "admin",
          },
        ],
      },
      user_type: "ADMIN",
      created_by: "admin",
      updated_by: "admin",
    },
  });

  const organizer = await prisma.user.upsert({
    where: { id: "21157cc4-5adf-492f-ba25-36078e9fa226" },
    update: {},
    create: {
      name: "Jane Smith",
      contacts: ["+94 765 432 109"],
      addresses: {
        create: [
          {
            number: "456",
            line_1: "Another St",
            country: "Sri Lanka",
            postal_code: "10200",
            created_by: "admin",
            updated_by: "admin",
          },
        ],
      },
      user_type: "ORGANIZER",
      created_by: "admin",
      updated_by: "admin",
    },
  });

  const janeSmithOrganizer = await prisma.organizer.upsert({
    where: { id: "3b4b7d67-2280-45b0-8bfb-4ce10341d995" },
    update: {},
    create: {
      first_name: "Jane",
      last_name: "Smith",
      user_id: organizer.id,
      created_by: "admin",
      updated_by: "admin",
    },
  });

  const adminAccount = await prisma.account.upsert({
    where: { id: "7afe6fa9-7282-43a0-a85e-17dcb1e553cb" },
    update: {},
    create: {
      email: "john.doe@gmail.com",
      password: "$2a$10$4I9jyzI8SSCTHcE1frUf9OElCyqnAlgJJMNaCI6ApylfLxXAFL1om",
      user_id: admin.id,
      created_by: "admin",
      updated_by: "admin",
    },
  });

  const eventTypes = await seedEventTypes();

  console.log({
    admin,
    organizer,
    janeSmithOrganizer,
    adminAccount,
    eventTypes,
  });
}

async function seedEventTypes() {
  const eventTypes = [
    { name: "Wedding", created_by: "system", updated_by: "system" },
    { name: "Corporate Gathering", created_by: "system", updated_by: "system" },
    { name: "Birthday Party", created_by: "system", updated_by: "system" },
    {
      name: "Anniversary Celebration",
      created_by: "system",
      updated_by: "system",
    },
    { name: "Baby Shower", created_by: "system", updated_by: "system" },
    { name: "Conference", created_by: "system", updated_by: "system" },
    { name: "Team Building", created_by: "system", updated_by: "system" },
    { name: "Fundraiser", created_by: "system", updated_by: "system" },
    { name: "Festival", created_by: "system", updated_by: "system" },
    { name: "Sports Event", created_by: "system", updated_by: "system" },
  ];

  for (const eventType of eventTypes) {
    await prisma.eventType.upsert({
      where: { name: eventType.name },
      update: {
        updated_by: eventType.updated_by,
        updated_at: new Date(),
      },
      create: {
        name: eventType.name,
        created_by: eventType.created_by,
        updated_by: eventType.updated_by,
      },
    });
  }

  return eventTypes;
}

seedData()
  .then(() => console.log("Seeding completed"))
  .catch(async (e) => {
    console.error("Seeding failed with an error", e);
    await prisma.$disconnect();
    process.exit(1);
  });
