import type { Metadata } from "next";
import Thread from "@/components/Thread";

export const metadata: Metadata = {
  title: "Chat with Sagnik",
  robots: { index: false },
};

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Thread id={id} />;
}
