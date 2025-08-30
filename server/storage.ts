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
import { eq, desc } from "drizzle-orm";

// Conditional import of db
let db: any;
try {
  const dbModule = await import("./db");
  db = dbModule.db;
} catch (error) {
  console.warn("Database connection failed, using mock storage");
  db = null;
}

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

export class MockStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private apiEndpoints: Map<string, ApiEndpoint> = new Map();

  constructor() {
    // Add default demo user
    this.users.set("local_user_123", {
      id: "local_user_123",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: this.users.get(userData.id)?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      ...project,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error("Project not found");
    
    const updated: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  async getProjectEndpoints(projectId: string): Promise<ApiEndpoint[]> {
    return Array.from(this.apiEndpoints.values())
      .filter(e => e.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint> {
    const newEndpoint: ApiEndpoint = {
      id: `endpoint_${Date.now()}`,
      ...endpoint,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.apiEndpoints.set(newEndpoint.id, newEndpoint);
    return newEndpoint;
  }

  async updateApiEndpoint(id: string, updates: Partial<InsertApiEndpoint>): Promise<ApiEndpoint> {
    const existing = this.apiEndpoints.get(id);
    if (!existing) throw new Error("Endpoint not found");
    
    const updated: ApiEndpoint = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.apiEndpoints.set(id, updated);
    return updated;
  }

  async deleteApiEndpoint(id: string): Promise<void> {
    this.apiEndpoints.delete(id);
  }
}
export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!db) throw new Error("Database not available");
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
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    if (!db) throw new Error("Database not available");
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    if (!db) throw new Error("Database not available");
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    if (!db) throw new Error("Database not available");
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    if (!db) throw new Error("Database not available");
    await db.delete(projects).where(eq(projects.id, id));
  }

  // API endpoint operations
  async getProjectEndpoints(projectId: string): Promise<ApiEndpoint[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(apiEndpoints)
      .where(eq(apiEndpoints.projectId, projectId))
      .orderBy(desc(apiEndpoints.createdAt));
  }

  async createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint> {
    if (!db) throw new Error("Database not available");
    const [newEndpoint] = await db
      .insert(apiEndpoints)
      .values(endpoint)
      .returning();
    return newEndpoint;
  }

  async updateApiEndpoint(id: string, updates: Partial<InsertApiEndpoint>): Promise<ApiEndpoint> {
    if (!db) throw new Error("Database not available");
    const [updatedEndpoint] = await db
      .update(apiEndpoints)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(apiEndpoints.id, id))
      .returning();
    return updatedEndpoint;
  }

  async deleteApiEndpoint(id: string): Promise<void> {
    if (!db) throw new Error("Database not available");
    await db.delete(apiEndpoints).where(eq(apiEndpoints.id, id));
  }
}

// Choose storage implementation based on environment
export const storage: IStorage = db ? new DatabaseStorage() : new MockStorage();
