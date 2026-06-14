import { prisma } from "@/lib/prisma";

export async function getUserMemories(userId: string) {
  return prisma.userMemory.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createMemory(userId: string, fact: string) {
  return prisma.userMemory.create({
    data: { userId, fact },
  });
}

export async function updateMemory(id: string, userId: string, fact: string) {
  const existing = await prisma.userMemory.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) return null;
  return prisma.userMemory.update({ where: { id }, data: { fact } });
}

export async function deleteMemory(id: string, userId: string) {
  const existing = await prisma.userMemory.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) return null;
  return prisma.userMemory.delete({ where: { id } });
}
