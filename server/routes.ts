import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertApiEndpointSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Project routes
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if user owns the project
      const userId = req.user.claims.sub;
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId,
      });
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if user owns the project
      const userId = req.user.claims.sub;
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updates = insertProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(req.params.id, updates);
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if user owns the project
      const userId = req.user.claims.sub;
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // API endpoint routes
  app.get("/api/projects/:projectId/endpoints", isAuthenticated, async (req: any, res) => {
    try {
      // Verify user owns the project
      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const userId = req.user.claims.sub;
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const endpoints = await storage.getProjectEndpoints(req.params.projectId);
      res.json(endpoints);
    } catch (error) {
      console.error("Error fetching endpoints:", error);
      res.status(500).json({ message: "Failed to fetch endpoints" });
    }
  });

  app.post("/api/projects/:projectId/endpoints", isAuthenticated, async (req: any, res) => {
    try {
      // Verify user owns the project
      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const userId = req.user.claims.sub;
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const endpointData = insertApiEndpointSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
      });
      
      const endpoint = await storage.createApiEndpoint(endpointData);
      res.status(201).json(endpoint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid endpoint data", errors: error.errors });
      }
      console.error("Error creating endpoint:", error);
      res.status(500).json({ message: "Failed to create endpoint" });
    }
  });

  // AI generation routes
  app.post("/api/ai/generate-component", isAuthenticated, async (req: any, res) => {
    try {
      const { componentType, framework, stylePreferences } = req.body;
      
      if (!componentType || !framework || !stylePreferences) {
        return res.status(400).json({ 
          message: "Missing required fields: componentType, framework, stylePreferences" 
        });
      }

      const { generateReactComponent } = await import("./gemini");
      const generatedCode = await generateReactComponent(componentType, framework, stylePreferences);
      
      res.json({ 
        code: generatedCode,
        componentType,
        framework 
      });
    } catch (error) {
      console.error("Error generating component:", error);
      res.status(500).json({ 
        message: "Failed to generate component. Please check your API key and try again." 
      });
    }
  });

  app.post("/api/ai/generate-backend", isAuthenticated, async (req: any, res) => {
    try {
      const { database, framework, features } = req.body;
      
      if (!database || !framework || !features) {
        return res.status(400).json({ 
          message: "Missing required fields: database, framework, features" 
        });
      }

      const { generateBackendCode } = await import("./gemini");
      const generatedCode = await generateBackendCode(database, framework, features);
      
      res.json({ 
        ...generatedCode,
        database,
        framework 
      });
    } catch (error) {
      console.error("Error generating backend:", error);
      res.status(500).json({ 
        message: "Failed to generate backend code. Please check your API key and try again." 
      });
    }
  });

  // Build from prompt route
  app.post("/api/ai/build-from-prompt", isAuthenticated, async (req: any, res) => {
    try {
      const { prompt, mode } = req.body;
      
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ 
          message: "A valid prompt is required" 
        });
      }

      const { buildFromPrompt } = await import("./gemini");
      const generatedWebsite = await buildFromPrompt(prompt, mode || 'webapp');
      
      // Create a new project with the generated content
      const userId = req.user.claims.sub;
      const projectData = insertProjectSchema.parse({
        title: generatedWebsite.title,
        description: generatedWebsite.description,
        userId,
        components: generatedWebsite.components,
        htmlCode: generatedWebsite.htmlCode,
        cssCode: generatedWebsite.cssCode,
        jsCode: generatedWebsite.jsCode,
      });
      
      const project = await storage.createProject(projectData);
      
      res.json({ 
        project,
        generated: generatedWebsite 
      });
    } catch (error) {
      console.error("Error building from prompt:", error);
      res.status(500).json({ 
        message: "Failed to build from prompt. Please check your API key and try again." 
      });
    }
  });

  // Webapp preview route
  app.get("/api/preview/:projectId", isAuthenticated, async (req: any, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.claims.sub;
      
      // Get project from storage
      const project = await storage.getProject(projectId, userId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Generate HTML page with project content
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
${project.cssCode || ''}
  </style>
</head>
<body>
${project.htmlCode || '<div class="p-8 text-center"><h1 class="text-2xl font-bold">Generated WebApp</h1><p>Your AI-generated web application preview.</p></div>'}
  <script>
${project.jsCode || ''}
  </script>
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      console.error("Error serving preview:", error);
      res.status(500).json({ message: "Failed to load preview" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
