import type { Article, Product, User } from "@prisma/client";

export type ArticleListItem = Pick<
  Article,
  "id" | "title" | "content" | "userId" | "createdAt" | "updatedAt"
>;
export type ProductListItem = Pick<
  Product,
  "id" | "name" | "price" | "createdAt" | "updatedAt"
>;
export type SafeUser = Pick<User, "id" | "email" | "nickname" | "createdAt">;
