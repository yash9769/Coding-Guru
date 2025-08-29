import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateReactComponent(
  componentType: string,
  framework: string,
  stylePreferences: string
): Promise<string> {
  const prompt = `Generate a modern ${componentType} component using ${framework}. 

Style preferences: ${stylePreferences}

Requirements:
- Use TypeScript
- Include proper TypeScript types
- Use Tailwind CSS for styling
- Make it responsive and accessible
- Include proper JSX structure
- Add data-testid attributes for interactive elements
- Follow modern React best practices

Return only the component code, no explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "// Error generating component";
  } catch (error) {
    console.error("Error generating component:", error);
    throw new Error("Failed to generate component with AI");
  }
}

export async function generateBackendCode(
  database: string,
  framework: string,
  features: {
    userAuth: boolean;
    crudOps: boolean;
    fileUpload: boolean;
    emailIntegration: boolean;
  }
): Promise<{
  routes: string;
  models: string;
  middleware: string;
}> {
  const featuresText = Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature)
    .join(", ");

  const routesPrompt = `Generate ${framework} API routes for a web application with ${database} database.

Features to include: ${featuresText}

Requirements:
- Use TypeScript
- Include proper error handling
- Add input validation
- Use modern async/await patterns
- Include proper HTTP status codes
- Add middleware for authentication where needed

Generate the routes file with all necessary endpoints.`;

  const modelsPrompt = `Generate ${database} database models/schemas for a web application.

Features: ${featuresText}

Requirements:
- Use TypeScript
- Include proper field types
- Add relationships between models
- Include timestamps
- Add validation rules where appropriate

Generate the models/schema file.`;

  const middlewarePrompt = `Generate middleware functions for a ${framework} application.

Features: ${featuresText}

Requirements:
- Use TypeScript
- Include authentication middleware
- Add error handling middleware
- Include request logging
- Add CORS configuration if needed

Generate the middleware file.`;

  try {
    const [routesResponse, modelsResponse, middlewareResponse] = await Promise.all([
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: routesPrompt,
      }),
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: modelsPrompt,
      }),
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: middlewarePrompt,
      }),
    ]);

    return {
      routes: routesResponse.text || "// Error generating routes",
      models: modelsResponse.text || "// Error generating models",
      middleware: middlewareResponse.text || "// Error generating middleware",
    };
  } catch (error) {
    console.error("Error generating backend code:", error);
    throw new Error("Failed to generate backend code with AI");
  }
}

export async function optimizeCode(code: string, type: 'component' | 'backend'): Promise<string> {
  const prompt = `Analyze and optimize the following ${type} code:

${code}

Please provide optimized version with:
- Better performance
- Improved readability
- Modern best practices
- Proper error handling
- Security improvements (if applicable)

Return only the optimized code, no explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return response.text || code; // Return original if optimization fails
  } catch (error) {
    console.error("Error optimizing code:", error);
    return code; // Return original code if optimization fails
  }
}