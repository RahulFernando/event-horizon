import {
  Event,
  Gig,
  Invoice,
  Job,
  Payment,
  PricingTier,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { IMonthlyGig } from "..";

export interface IJob extends Job {
  gig: Gig;
  pricingTier: PricingTier;
  event: Event;
}

export type PrismaTransaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface IInvoice extends Invoice {
  payments?: Payment[];
}

export interface IMonthlyEarningJob extends Job {
  gig: IMonthlyGig;
  event: Event;
  pricingTier?: {
    id: string;
    level: string;
    description: string;
    price: number;
  };
  invoice?: IInvoice;
}
