import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Search,
  Plus,
  Code,
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  Settings,
  Star,
  Type,
  Image,
  MousePointer,
  FileText,
  CreditCard,
  Grid,
  Navigation as NavigationIcon,
  Trash2,
} from "lucide-react";
import BuildFromPromptForm from "@/components/BuildFromPromptForm";

interface ComponentPaletteItem {
  id: string;
  name: string;
  icon: any;
  category: string;
  description: string;
}

const componentPalette: ComponentPaletteItem[] = [
  // Layout
  { id: 'header', name: 'Header', icon: Monitor, category: 'Layout', description: 'Page header section' },
  { id: 'navbar', name: 'Navigation', icon: NavigationIcon, category: 'Layout', description: 'Navigation menu' },
  { id: 'footer', name: 'Footer', icon: Grid, category: 'Layout', description: 'Page footer section' },
  
  // Content
  { id: 'hero', name: 'Hero Section', icon: Star, category: 'Content', description: 'Main hero banner' },
  { id: 'text', name: 'Text Block', icon: Type, category: 'Content', description: 'Rich text content' },
  { id: 'image', name: 'Image', icon: Image, category: 'Content', description: 'Image component' },
  
  // Interactive
  { id: 'button', name: 'Button', icon: MousePointer, category: 'Interactive', description: 'Clickable button' },
  { id: 'form', name: 'Form', icon: FileText, category: 'Interactive', description: 'Input form' },
  { id: 'card', name: 'Card', icon: CreditCard, category: 'Interactive', description: 'Content card' },
];

const categories = ['Layout', 'Content', 'Interactive'];

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Fetch user projects
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    retry: false,
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: { title: string; description?: string }) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleCreateProject = () => {
    createProjectMutation.mutate({
      title: "New Website",
      description: "Created with AI Builder",
    });
  };

  const handleComponentDrop = (component: ComponentPaletteItem) => {
    const newNode: Node = {
      id: `${component.id}-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: (
          <div className="flex items-center space-x-2 p-2">
            <component.icon className="w-4 h-4 text-accent" />
            <span className="font-medium">{component.name}</span>
          </div>
        ),
      },
      style: {
        background: 'white',
        border: '2px solid hsl(var(--accent))',
        borderRadius: '8px',
        padding: '4px',
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setSelectedComponent(newNode.id);
  };

  const filteredComponents = componentPalette.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-73px)]">
        {/* Component Palette */}
        <div className="w-80 bg-card border-r border-border p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">Components</h3>
          
          {/* Search */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              data-testid="input-search-components"
            />
          </div>

          {/* Component Categories */}
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryComponents = filteredComponents.filter(c => c.category === category);
              if (categoryComponents.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {categoryComponents.map((component) => (
                      <div
                        key={component.id}
                        className="bg-background border border-border rounded-lg p-3 cursor-move hover:shadow-md hover:-translate-y-0.5 transition-all"
                        onClick={() => handleComponentDrop(component)}
                        data-testid={`component-${component.id}`}
                      >
                        <div className="flex items-center">
                          <component.icon className="w-4 h-4 text-muted-foreground mr-2" />
                          <div>
                            <span className="text-sm font-medium">{component.name}</span>
                            <p className="text-xs text-muted-foreground">{component.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-card border-b border-border p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant={selectedDevice === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDevice('desktop')}
                data-testid="button-device-desktop"
              >
                <Monitor className="w-4 h-4 mr-1" />
                Desktop
              </Button>
              <Button
                variant={selectedDevice === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDevice('tablet')}
                data-testid="button-device-tablet"
              >
                <Tablet className="w-4 h-4 mr-1" />
                Tablet
              </Button>
              <Button
                variant={selectedDevice === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDevice('mobile')}
                data-testid="button-device-mobile"
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Mobile
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" data-testid="button-generate-code">
                <Code className="w-4 h-4 mr-1" />
                Generate Code
              </Button>
              <Button size="sm" variant="ghost" data-testid="button-undo">
                <Undo className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" data-testid="button-redo">
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-muted/20 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant={"dots" as any} gap={20} size={1} />
            </ReactFlow>

            {/* Build from Prompt Section (only in canvas area) */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-muted/20">
                <div className="text-center max-w-2xl pointer-events-auto">
                  <Star className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-medium text-foreground mb-2">
                    Build Anything with AI
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Describe what you want to build and let AI create it for you
                  </p>
                  
                  <BuildFromPromptForm onSuccess={() => {}} />
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground mb-4">Or start with drag & drop</p>
                    <p className="text-xs text-muted-foreground">
                      Drag components from the left panel to design manually
                    </p>
                  </div>
                  
                  {projects && Array.isArray(projects) && projects.length > 0 && (
                    <div className="bg-card border border-border rounded-lg p-4 mt-8">
                      <h4 className="font-medium mb-2">Your Recent Projects</h4>
                      <div className="space-y-2">
                        {projects.slice(0, 2).map((project: Project) => (
                          <div key={project.id} className="flex items-center justify-between text-sm">
                            <span>{project.title}</span>
                            <Badge variant="secondary">{project.isPublished ? 'Published' : 'Draft'}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">Properties</h3>
          
          {selectedComponent ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Styling
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Background Color
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        defaultValue="#ffffff"
                        className="w-10 h-8 rounded border border-border cursor-pointer"
                        data-testid="input-background-color"
                      />
                      <Input
                        type="text"
                        defaultValue="#ffffff"
                        className="flex-1 text-sm"
                        data-testid="input-background-color-text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Text Color
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        defaultValue="#1f2937"
                        className="w-10 h-8 rounded border border-border cursor-pointer"
                        data-testid="input-text-color"
                      />
                      <Input
                        type="text"
                        defaultValue="#1f2937"
                        className="flex-1 text-sm"
                        data-testid="input-text-color-text"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Layout
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Width
                    </label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded text-sm">
                      <option>Auto</option>
                      <option>Full Width</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Settings className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Select a component to edit its properties</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
