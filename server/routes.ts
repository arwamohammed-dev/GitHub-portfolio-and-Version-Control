
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { connectDB, MongoUser, MongoProduct } from "./mongodb";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Connect to MongoDB
  await connectDB().catch(err => console.error("MongoDB connection error:", err));

  // Registration
  app.post(api.users.register.path, async (req, res) => {
    try {
      const input = api.users.register.input.parse(req.body);
      
      // Check MongoDB for existing user
      const existingUser = await MongoUser.findOne({ 
        $or: [{ username: input.username }, { email: input.email }] 
      });

      if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists" });
      }

      // Save to MongoDB
      const mongoUser = new MongoUser(input);
      await mongoUser.save();

      // Also save to Postgres (existing storage) for backward compatibility/redundancy
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  });

  // Products List
  app.get(api.products.list.path, async (req, res) => {
    try {
      const { category, sort } = req.query;
      
      let query = MongoProduct.find();
      if (category && category !== 'all') {
        query = query.where('category').equals(category);
      }

      if (sort === 'price_asc') {
        query = query.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        query = query.sort({ price: -1 });
      }

      const products = await query.exec();
      
      // If MongoDB is empty, fallback to Postgres storage (initial seed)
      if (products.length === 0) {
        const pgProducts = await storage.getProducts({ 
          category: category as string, 
          sort: sort as any 
        });
        return res.json(pgProducts);
      }

      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get Product
  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Initial Seed
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const products = await storage.getProducts();
  if (products.length === 0) {
    console.log("Seeding database...");
    await storage.createProduct({
      name: "Wireless Headphones",
      description: "Premium noise-cancelling headphones with 20h battery life.",
      price: 19999, // $199.99
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    });
    await storage.createProduct({
      name: "Ergonomic Office Chair",
      description: "Comfortable mesh chair with lumbar support.",
      price: 24900, // $249.00
      category: "Home",
      imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
    });
    await storage.createProduct({
      name: "Mechanical Keyboard",
      description: "RGB mechanical keyboard with cherry switches.",
      price: 12950, // $129.50
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
    });
    await storage.createProduct({
      name: "Running Shoes",
      description: "Lightweight running shoes for daily training.",
      price: 8999, // $89.99
      category: "Clothing",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    });
    await storage.createProduct({
      name: "Smart Watch",
      description: "Fitness tracker and smartwatch with heart rate monitor.",
      price: 15900, // $159.00
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    });
     await storage.createProduct({
      name: "Cotton T-Shirt",
      description: "100% organic cotton basic t-shirt.",
      price: 2500, // $25.00
      category: "Clothing",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    });
  }
}
