import {
  users,
  projects,
  apiEndpoints,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type ApiEndpoint,
  type InsertApiEndpoint,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getUserProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // API endpoint operations
  getProjectEndpoints(projectId: string): Promise<ApiEndpoint[]>;
  createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint>;
  updateApiEndpoint(id: string, updates: Partial<InsertApiEndpoint>): Promise<ApiEndpoint>;
  deleteApiEndpoint(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getUserProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // API endpoint operations
  async getProjectEndpoints(projectId: string): Promise<ApiEndpoint[]> {
    return await db
      .select()
      .from(apiEndpoints)
      .where(eq(apiEndpoints.projectId, projectId))
      .orderBy(desc(apiEndpoints.createdAt));
  }

  async createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint> {
    const [newEndpoint] = await db
      .insert(apiEndpoints)
      .values(endpoint)
      .returning();
    return newEndpoint;
  }

  async updateApiEndpoint(id: string, updates: Partial<InsertApiEndpoint>): Promise<ApiEndpoint> {
    const [updatedEndpoint] = await db
      .update(apiEndpoints)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(apiEndpoints.id, id))
      .returning();
    return updatedEndpoint;
  }

  async deleteApiEndpoint(id: string): Promise<void> {
    await db.delete(apiEndpoints).where(eq(apiEndpoints.id, id));
  }
}

export const storage = new DatabaseStorage();
