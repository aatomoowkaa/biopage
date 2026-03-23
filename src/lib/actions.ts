"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBioPage(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) throw new Error("Unauthorized");

  const username = formData.get("username") as string;
  if (!username || username.length < 3) throw new Error("Invalid username");

  // Check if username is taken
  const existing = await prisma.bioPage.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (existing) throw new Error("Username already taken");

  await prisma.bioPage.create({
    data: {
      userId: session.user.id,
      username: username.toLowerCase(),
      displayName: session.user.name || username,
      avatarUrl: session.user.image,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard/edit");
}

export async function updateBioPage(data: any) {
  const session = await auth();
  if (!session || !session.user?.id) throw new Error("Unauthorized");

  const {
    displayName, description, avatarUrl, bannerUrl,
    themeColor, textColor, bgColor, fontFamily,
    backgroundEffect, backgroundVideoUrl, cursorUrl,
    socialLinks, showDiscordPresence
  } = data;

  await prisma.bioPage.update({
    where: { userId: session.user.id },
    data: {
      displayName,
      description,
      avatarUrl,
      bannerUrl,
      themeColor,
      textColor,
      bgColor,
      fontFamily,
      backgroundEffect,
      backgroundVideoUrl,
      showDiscordPresence,
      cursorUrl,
      socialLinks: JSON.stringify(socialLinks || []),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/edit");
  revalidatePath(`/${data.username}`);
}
