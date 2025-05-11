import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        job_id: id,
      },
      include: {
        payments: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ ...invoice }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        job_id: id,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const payment = await prisma.payment.create({
      data: {
        amount: body.amount,
        invoice_id: invoice.id,
      },
    });

    await updateJob(invoice.job_id);

    return NextResponse.json({ ...payment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ errors: [error] }, { status: 500 });
  }
}

const updateJob = async (jobId: string) => {
  const invoice = await prisma.invoice.findFirst({
    where: {
      job_id: jobId,
    },
    include: {
      payments: true,
    },
  });

  if (!invoice) return;

  const totalPaidAmount = invoice.payments.reduce((a, b) => a + b.amount, 0);

  if (invoice.total_amount !== totalPaidAmount) {
    return;
  }

  await prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      status: "COMPLETED",
    },
  });
};
