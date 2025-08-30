import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  User,
  FileText,
  Server,
  Code,
  Download,
  Database,
  Shield,
  Zap,
  Mail,
  Upload,
  ChevronRight,
} from "lucide-react";
import { useLocation } from "wouter";

interface DatabaseModel {
  id: string;
  name: string;
  icon: any;
  fields: Array<{
    name: string;
    type: string;
  }>;
}

interface ApiRoute {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
}

const databaseModels: DatabaseModel[] = [
  {
    id: 'user',
    name: 'User',
    icon: User,
    fields: [
      { name: 'id', type: 'ObjectId' },
      { name: 'name', type: 'String' },
      { name: 'email', type: 'String' },
      { name: 'createdAt', type: 'Date' },
    ],
  },
  {
    id: 'project',
    name: 'Project',
    icon: FileText,
    fields: [
      { name: 'id', type: 'ObjectId' },
      { name: 'title', type: 'String' },
      { name: 'userId', type: 'ObjectId' },
      { name: 'html', type: 'String' },
    ],
  },
];

const apiRoutes: ApiRoute[] = [
  { id: '1', method: 'GET', path: '/api/users', description: 'Get all users' },
  { id: '2', method: 'POST', path: '/api/auth/login', description: 'User authentication' },
  { id: '3', method: 'POST', path: '/api/projects', description: 'Create new project' },
  { id: '4', method: 'PUT', path: '/api/projects/:id', description: 'Update project' },
];

const generatedFiles = [
  { name: 'server.js', icon: Code },
  { name: 'routes/', icon: FileText },
  { name: 'models/', icon: Database },
  { name: 'package.json', icon: FileText },
];

export default function BackendBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDatabase, setSelectedDatabase] = useState('MongoDB');
  const [selectedFramework, setSelectedFramework] = useState('Express.js');
  const [features, setFeatures] = useState({
    userAuth: true,
    crudOps: true,
    fileUpload: false,
    emailIntegration: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [models, setModels] = useState(databaseModels);
  const [routes, setRoutes] = useState(apiRoutes);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [newModel, setNewModel] = useState({ name: '', fields: [{ name: '', type: '' }] });
  const [newRoute, setNewRoute] = useState({ method: 'GET' as const, path: '', description: '' });
  const [authSettings, setAuthSettings] = useState({
    jwtAuth: true,
    passwordHashing: true,
    rateLimiting: false,
  });

  const handleGenerateBackend = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-backend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          database: selectedDatabase,
          framework: selectedFramework,
          features,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate backend');
      }

      const result = await response.json();
      
      toast({
        title: "Backend Generated!",
        description: `Successfully generated ${selectedFramework} backend with ${selectedDatabase}`,
      });
      
      console.log("Generated backend files:", result);
      
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed", 
        description: error instanceof Error ? error.message : "Failed to generate backend",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddModel = () => {
    setIsAddingModel(true);
    setNewModel({ name: '', fields: [{ name: '', type: '' }] });
  };

  const handleSaveModel = () => {
    if (newModel.name && newModel.fields.every(f => f.name && f.type)) {
      const model: DatabaseModel = {
        id: newModel.name.toLowerCase().replace(/\s+/g, '_'),
        name: newModel.name,
        icon: FileText,
        fields: newModel.fields,
      };
      setModels(prev => [...prev, model]);
      setIsAddingModel(false);
      toast({
        title: "Model Added",
        description: `${newModel.name} model has been created successfully`,
      });
    } else {
      toast({
        title: "Invalid Model",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(prev => prev.filter(m => m.id !== modelId));
    toast({
      title: "Model Deleted",
      description: "Model has been removed",
    });
  };

  const handleAddRoute = () => {
    setIsAddingRoute(true);
    setNewRoute({ method: 'GET', path: '', description: '' });
  };

  const handleSaveRoute = () => {
    if (newRoute.path && newRoute.description) {
      const route: ApiRoute = {
        id: Date.now().toString(),
        method: newRoute.method,
        path: newRoute.path,
        description: newRoute.description,
      };
      setRoutes(prev => [...prev, route]);
      setIsAddingRoute(false);
      toast({
        title: "Route Added",
        description: `${newRoute.method} ${newRoute.path} has been created`,
      });
    } else {
      toast({
        title: "Invalid Route",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleExportAPI = () => {
    const apiSpec = {
      database: selectedDatabase,
      framework: selectedFramework,
      models: models,
      routes: routes,
      features: features,
      authSettings: authSettings,
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(apiSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-specification.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "API Exported",
      description: "API specification has been downloaded",
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-700';
      case 'POST': return 'bg-blue-100 text-blue-700';
      case 'PUT': return 'bg-orange-100 text-orange-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-73px)]">
        {/* API Builder */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setLocation('/code-preview')} data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Backend Builder</h1>
              </div>
              
              <Button variant="outline" onClick={handleExportAPI} data-testid="button-export">
                <Download className="w-4 h-4 mr-2" />
                Export API
              </Button>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  API Configuration
                </CardTitle>
                <p className="text-muted-foreground">
                  Configure your backend API endpoints, database schema, and authentication settings.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Database Schema */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Database Schema</h3>
                    <Button onClick={handleAddModel} data-testid="button-add-model">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Model
                    </Button>
                  </div>
                  
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="space-y-3">
                      {models.map((model) => (
                        <Card key={model.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <model.icon className="w-5 h-5 text-accent mr-2" />
                                <span className="font-medium">{model.name}</span>
                              </div>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" data-testid={`button-edit-${model.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteModel(model.id)}
                                  data-testid={`button-delete-${model.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              {model.fields.map((field, index) => (
                                <div key={index} className="flex justify-between">
                                  <span className="text-muted-foreground">{field.name}</span>
                                  <Badge variant="secondary" className="font-mono text-xs">
                                    {field.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Add Model Form */}
                      {isAddingModel && (
                        <Card className="border-dashed border-accent">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <Input
                                placeholder="Model name (e.g., Product)"
                                value={newModel.name}
                                onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                              />
                              {newModel.fields.map((field, index) => (
                                <div key={index} className="flex space-x-2">
                                  <Input
                                    placeholder="Field name"
                                    value={field.name}
                                    onChange={(e) => {
                                      const fields = [...newModel.fields];
                                      fields[index].name = e.target.value;
                                      setNewModel(prev => ({ ...prev, fields }));
                                    }}
                                  />
                                  <select
                                    value={field.type}
                                    onChange={(e) => {
                                      const fields = [...newModel.fields];
                                      fields[index].type = e.target.value;
                                      setNewModel(prev => ({ ...prev, fields }));
                                    }}
                                    className="px-3 py-2 bg-background border border-border rounded text-sm"
                                  >
                                    <option value="">Select type</option>
                                    <option value="String">String</option>
                                    <option value="Number">Number</option>
                                    <option value="Boolean">Boolean</option>
                                    <option value="Date">Date</option>
                                    <option value="ObjectId">ObjectId</option>
                                  </select>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const fields = newModel.fields.filter((_, i) => i !== index);
                                      setNewModel(prev => ({ ...prev, fields }));
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setNewModel(prev => ({
                                      ...prev,
                                      fields: [...prev.fields, { name: '', type: '' }]
                                    }));
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Field
                                </Button>
                                <Button size="sm" onClick={handleSaveModel}>
                                  Save Model
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsAddingModel(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>

                {/* API Endpoints */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">API Endpoints</h3>
                    <Button onClick={handleAddRoute} data-testid="button-add-route">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Route
                    </Button>
                  </div>
                  
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="space-y-3">
                      {routes.map((route) => (
                        <div
                          key={route.id}
                          className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                          data-testid={`route-${route.id}`}
                        >
                          <div className="flex items-center space-x-3">
                            <Badge className={`${getMethodColor(route.method)} font-medium`}>
                              {route.method}
                            </Badge>
                            <code className="font-mono text-sm">{route.path}</code>
                            <span className="text-muted-foreground text-sm">{route.description}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRoutes(prev => prev.filter(r => r.id !== route.id));
                                toast({
                                  title: "Route Deleted",
                                  description: `${route.method} ${route.path} has been removed`,
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Route Form */}
                      {isAddingRoute && (
                        <div className="p-3 bg-card border border-dashed border-accent rounded-lg">
                          <div className="space-y-3">
                            <div className="flex space-x-2">
                              <select
                                value={newRoute.method}
                                onChange={(e) => setNewRoute(prev => ({ ...prev, method: e.target.value as any }))}
                                className="px-3 py-2 bg-background border border-border rounded text-sm"
                              >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                              </select>
                              <Input
                                placeholder="/api/endpoint"
                                value={newRoute.path}
                                onChange={(e) => setNewRoute(prev => ({ ...prev, path: e.target.value }))}
                              />
                            </div>
                            <Input
                              placeholder="Description"
                              value={newRoute.description}
                              onChange={(e) => setNewRoute(prev => ({ ...prev, description: e.target.value }))}
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSaveRoute}>
                                Save Route
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsAddingRoute(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Authentication Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Authentication</h3>
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 text-accent mr-3" />
                          <div>
                            <span className="font-medium text-foreground">JWT Authentication</span>
                            <p className="text-sm text-muted-foreground">Secure token-based authentication</p>
                          </div>
                        </div>
                        <Switch 
                          checked={authSettings.jwtAuth} 
                          onCheckedChange={(checked) => setAuthSettings(prev => ({ ...prev, jwtAuth: checked }))}
                          data-testid="switch-jwt-auth" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 text-accent mr-3" />
                          <div>
                            <span className="font-medium text-foreground">Password Hashing</span>
                            <p className="text-sm text-muted-foreground">Bcrypt password protection</p>
                          </div>
                        </div>
                        <Switch 
                          checked={authSettings.passwordHashing}
                          onCheckedChange={(checked) => setAuthSettings(prev => ({ ...prev, passwordHashing: checked }))}
                          data-testid="switch-password-hash" 
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Zap className={`w-5 h-5 mr-3 ${authSettings.rateLimiting ? 'text-accent' : 'text-muted-foreground'}`} />
                          <div>
                            <span className="font-medium text-foreground">Rate Limiting</span>
                            <p className="text-sm text-muted-foreground">API request throttling</p>
                          </div>
                        </div>
                        <Switch 
                          checked={authSettings.rateLimiting}
                          onCheckedChange={(checked) => setAuthSettings(prev => ({ ...prev, rateLimiting: checked }))}
                          data-testid="switch-rate-limiting" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Code Generation Panel */}
        <div className="w-96 bg-card border-l border-border p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">Backend Generation</h3>
          
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Server className="w-5 h-5 text-accent mr-2" />
                <span className="font-medium text-accent">Express.js API</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate Node.js + Express backend with MongoDB integration and JWT authentication.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Database Provider
              </label>
              <select 
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                value={selectedDatabase}
                onChange={(e) => setSelectedDatabase(e.target.value)}
                data-testid="select-database"
              >
                <option>MongoDB</option>
                <option>PostgreSQL</option>
                <option>MySQL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Framework
              </label>
              <select 
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                data-testid="select-framework"
              >
                <option>Express.js</option>
                <option>Fastify</option>
                <option>Koa.js</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Features
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={features.userAuth}
                    onChange={(e) => setFeatures(prev => ({ ...prev, userAuth: e.target.checked }))}
                    className="mr-2 rounded border-border"
                    data-testid="checkbox-user-auth"
                  />
                  <span className="text-sm">User Authentication</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={features.crudOps}
                    onChange={(e) => setFeatures(prev => ({ ...prev, crudOps: e.target.checked }))}
                    className="mr-2 rounded border-border"
                    data-testid="checkbox-crud-ops"
                  />
                  <span className="text-sm">CRUD Operations</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={features.fileUpload}
                    onChange={(e) => setFeatures(prev => ({ ...prev, fileUpload: e.target.checked }))}
                    className="mr-2 rounded border-border"
                    data-testid="checkbox-file-upload"
                  />
                  <span className="text-sm">File Upload</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={features.emailIntegration}
                    onChange={(e) => setFeatures(prev => ({ ...prev, emailIntegration: e.target.checked }))}
                    className="mr-2 rounded border-border"
                    data-testid="checkbox-email-integration"
                  />
                  <span className="text-sm">Email Integration</span>
                </label>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-accent text-white mb-4"
            onClick={handleGenerateBackend}
            disabled={isGenerating}
            data-testid="button-generate-backend"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                Generate Backend
              </>
            )}
          </Button>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Generated Files</h4>
            <div className="space-y-2">
              {generatedFiles.map((file, index) => (
                <div key={index} className="bg-background border border-border rounded-lg p-3">
                  <div className="flex items-center">
                    <file.icon className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
