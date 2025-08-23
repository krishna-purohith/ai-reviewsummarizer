import { PrismaClient, type Review } from '../generated/prisma';

export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      const prisma = new PrismaClient();

      return prisma.review.findMany({
         where: { productId },
         take: limit,
         orderBy: { createdAt: 'desc' },
      });
   },
};
