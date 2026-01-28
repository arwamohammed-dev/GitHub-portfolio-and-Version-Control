
import { db } from "./db";
import { users, products, type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";
import { eq, asc, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getProducts(filters?: { category?: string; sort?: 'price_asc' | 'price_desc'; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(filters?: { category?: string; sort?: 'price_asc' | 'price_desc'; search?: string }): Promise<Product[]> {
    let query = db.select().from(products).$dynamic();

    if (filters?.category) {
      query = query.where(eq(products.category, filters.category));
    }

    if (filters?.sort) {
      if (filters.sort === 'price_asc') {
        query = query.orderBy(asc(products.price));
      } else if (filters.sort === 'price_desc') {
        query = query.orderBy(desc(products.price));
      }
    }

    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
}

export const storage = new DatabaseStorage();
