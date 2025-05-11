import {
  Event,
  Gig,
  Job,
  PricingTier,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export interface IJob extends Job {
  gig: Gig;
  pricingTier: PricingTier;
  event: Event;
}

export type PrismaTransaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
