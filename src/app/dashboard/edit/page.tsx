import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BioEditor from "@/components/creator/BioEditor";

export default async function EditPage() {
  const session = await auth();
  if (!session || !session.user) redirect("/api/auth/signin");

  const bioPage = await prisma.bioPage.findUnique({
    where: { userId: session.user.id },
  });

  if (!bioPage) redirect("/dashboard/new");

  return (
    <div style={{ height: 'calc(100vh - 120px)' }}>
      <BioEditor initialData={{
        ...bioPage,
        socialLinks: JSON.parse(bioPage.socialLinks as string),
      }} />
    </div>
  );
}
