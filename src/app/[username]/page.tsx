import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicBioPageClient from "./PublicBioPageClient";

export default async function PublicBioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const bioPage = await prisma.bioPage.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!bioPage) {
    notFound();
  }

  // Increment views
  await prisma.bioPage.update({
    where: { id: bioPage.id },
    data: { views: { increment: 1 } },
  });

  // Fetch Discord ID from accounts
  const account = await prisma.account.findFirst({
    where: { userId: bioPage.userId, provider: "discord" },
  });

  return <PublicBioPageClient bioPage={bioPage} discordId={account?.providerAccountId} />;
}
