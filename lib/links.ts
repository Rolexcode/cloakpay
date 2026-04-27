import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
});

export type PaymentLink = {
  slug: string;
  recipientAddress: string;
  amount: number;
  token: string;
  label: string;
  createdAt: number;
};

export async function createPaymentLink(data: Omit<PaymentLink, "slug" | "createdAt">) {
  const slug = Math.random().toString(36).substring(2, 8); // e.g. "x4k9mz"
  const link: PaymentLink = {
    ...data,
    slug,
    createdAt: Date.now(),
  };
  await redis.set(`link:${slug}`, JSON.stringify(link));
  return link;
}

export async function getPaymentLink(slug: string): Promise<PaymentLink | null> {
  const data = await redis.get(`link:${slug}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data as PaymentLink;
}