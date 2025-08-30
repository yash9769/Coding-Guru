import { useState, useCallback, useEffect } from "react";
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
  Handle,
  Position,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
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
  WandSparkles,
  Video,
  Music,
  Calendar,
  MapPin,
  ShoppingCart,
  Users,
  Mail,
  Phone,
  Clock,
  Globe,
  Layers,
  Layout,
  Columns,
  BarChart3,
  PieChart,
  TrendingUp,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Upload,
  Lock,
  User,
  Award,
  Bookmark,
  Tag,
} from "lucide-react";
import BuildFromPromptForm from "@/components/BuildFromPromptForm";

// Custom Node Component
const ComponentNode = ({ data, selected }: { data: any; selected: boolean }) => {
  // Map icon names to components
  const iconMap: Record<string, any> = {
    'NavigationIcon': NavigationIcon,
    'Star': Star,
    'Grid': Grid,
    'CreditCard': CreditCard,
    'FileText': FileText,
    'MousePointer': MousePointer,
    'Type': Type,
    'Monitor': Monitor,
    'Image': Image,
    'Video': Video,
    'Music': Music,
    'Calendar': Calendar,
    'MapPin': MapPin,
    'ShoppingCart': ShoppingCart,
    'Users': Users,
    'Mail': Mail,
    'Phone': Phone,
    'Clock': Clock,
    'Globe': Globe,
    'Layers': Layers,
    'Layout': Layout,
    'Columns': Columns,
    'BarChart3': BarChart3,
    'PieChart': PieChart,
    'TrendingUp': TrendingUp,
    'MessageSquare': MessageSquare,
    'Heart': Heart,
    'Share2': Share2,
    'Download': Download,
    'Upload': Upload,
    'Lock': Lock,
    'User': User,
    'Award': Award,
    'Bookmark': Bookmark,
    'Tag': Tag,
  };
  
  const IconComponent = data.iconName ? iconMap[data.iconName] || Type : data.icon || Type;
  
  return (
    <div className={`flex flex-col p-3 min-w-[200px] bg-white border-2 rounded-lg transition-all relative ${
      selected ? 'border-accent shadow-lg' : 'border-gray-200'
    }`}>
      {/* ReactFlow connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-accent border-2 border-white"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-accent border-2 border-white"
        style={{ bottom: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-accent border-2 border-white"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-accent border-2 border-white"
        style={{ right: -6 }}
      />
      
      <div className="flex items-center space-x-2 mb-2">
        <IconComponent className="w-4 h-4 text-accent" />
        <span className="font-medium text-sm">{data.componentName || data.name || 'Component'}</span>
      </div>
      {data.componentDescription && (
        <p className="text-xs text-muted-foreground mb-1">{data.componentDescription}</p>
      )}
      {data.componentContent && (
        <p className="text-xs text-muted-foreground mb-1">{data.componentContent}</p>
      )}
      {data.category && (
        <div className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full inline-block">
          {data.category}
        </div>
      )}
      {data.aiMode && (
        <div className="mt-2">
          <Badge variant="secondary" className="text-xs">
            {data.aiMode === 'flow' ? 'Flow Component' : 'WebApp Component'}
          </Badge>
        </div>
      )}
    </div>
  );
};

// Node types for ReactFlow
const nodeTypes: NodeTypes = {
  component: ComponentNode,
};

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
  { id: 'sidebar', name: 'Sidebar', icon: Layout, category: 'Layout', description: 'Side navigation panel' },
  { id: 'container', name: 'Container', icon: Layers, category: 'Layout', description: 'Content wrapper container' },
  { id: 'columns', name: 'Column Layout', icon: Columns, category: 'Layout', description: 'Multi-column layout' },
  
  // Content
  { id: 'hero', name: 'Hero Section', icon: Star, category: 'Content', description: 'Main hero banner' },
  { id: 'text', name: 'Text Block', icon: Type, category: 'Content', description: 'Rich text content' },
  { id: 'image', name: 'Image', icon: Image, category: 'Content', description: 'Image component' },
  { id: 'video', name: 'Video Player', icon: Video, category: 'Content', description: 'Video playback component' },
  { id: 'audio', name: 'Audio Player', icon: Music, category: 'Content', description: 'Audio playback component' },
  { id: 'gallery', name: 'Image Gallery', icon: Grid, category: 'Content', description: 'Photo gallery grid' },
  { id: 'testimonial', name: 'Testimonial', icon: MessageSquare, category: 'Content', description: 'Customer testimonial' },
  { id: 'faq', name: 'FAQ Section', icon: FileText, category: 'Content', description: 'Frequently asked questions' },
  
  // Interactive
  { id: 'button', name: 'Button', icon: MousePointer, category: 'Interactive', description: 'Clickable button' },
  { id: 'form', name: 'Contact Form', icon: FileText, category: 'Interactive', description: 'Input form' },
  { id: 'card', name: 'Card', icon: CreditCard, category: 'Interactive', description: 'Content card' },
  { id: 'modal', name: 'Modal Dialog', icon: Layers, category: 'Interactive', description: 'Popup modal window' },
  { id: 'tabs', name: 'Tab Container', icon: Columns, category: 'Interactive', description: 'Tabbed content switcher' },
  { id: 'accordion', name: 'Accordion', icon: Layers, category: 'Interactive', description: 'Collapsible content sections' },
  { id: 'search', name: 'Search Bar', icon: Search, category: 'Interactive', description: 'Search input component' },
  { id: 'rating', name: 'Star Rating', icon: Star, category: 'Interactive', description: 'Star rating component' },
  
  // E-commerce
  { id: 'product', name: 'Product Card', icon: ShoppingCart, category: 'E-commerce', description: 'Product display card' },
  { id: 'cart', name: 'Shopping Cart', icon: ShoppingCart, category: 'E-commerce', description: 'Shopping cart widget' },
  { id: 'pricing', name: 'Pricing Table', icon: CreditCard, category: 'E-commerce', description: 'Subscription pricing plans' },
  { id: 'checkout', name: 'Checkout Form', icon: CreditCard, category: 'E-commerce', description: 'Payment checkout form' },
  
  // Social
  { id: 'social', name: 'Social Media', icon: Share2, category: 'Social', description: 'Social media links' },
  { id: 'comments', name: 'Comments', icon: MessageSquare, category: 'Social', description: 'User comments section' },
  { id: 'like', name: 'Like Button', icon: Heart, category: 'Social', description: 'Like/favorite button' },
  { id: 'share', name: 'Share Button', icon: Share2, category: 'Social', description: 'Social sharing button' },
  
  // Data
  { id: 'chart', name: 'Bar Chart', icon: BarChart3, category: 'Data', description: 'Data visualization chart' },
  { id: 'pie', name: 'Pie Chart', icon: PieChart, category: 'Data', description: 'Circular data chart' },
  { id: 'stats', name: 'Statistics', icon: TrendingUp, category: 'Data', description: 'Key metrics display' },
  { id: 'progress', name: 'Progress Bar', icon: BarChart3, category: 'Data', description: 'Progress indicator' },
  
  // Utility
  { id: 'calendar', name: 'Calendar', icon: Calendar, category: 'Utility', description: 'Date picker calendar' },
  { id: 'map', name: 'Map', icon: MapPin, category: 'Utility', description: 'Interactive map' },
  { id: 'contact', name: 'Contact Info', icon: Phone, category: 'Utility', description: 'Contact information display' },
  { id: 'newsletter', name: 'Newsletter', icon: Mail, category: 'Utility', description: 'Email subscription form' },
  { id: 'team', name: 'Team Members', icon: Users, category: 'Utility', description: 'Team member showcase' },
  { id: 'countdown', name: 'Countdown Timer', icon: Clock, category: 'Utility', description: 'Event countdown timer' },
  { id: 'breadcrumb', name: 'Breadcrumbs', icon: NavigationIcon, category: 'Utility', description: 'Navigation breadcrumbs' },
];

const categories = ['Layout', 'Content', 'Interactive', 'E-commerce', 'Social', 'Data', 'Utility'];

export default function Dashboard() {
  console.log('Dashboard component rendering...');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [viewMode, setViewMode] = useState<'drag-drop' | 'ai-build'>('drag-drop');
  const [aiMode, setAiMode] = useState<'flow' | 'webapp' | null>(null);

  // Debug function to clear localStorage completely
  (window as any).clearAIBuilderStorage = () => {
    localStorage.removeItem('aibuilder-canvas-nodes');
    localStorage.removeItem('aibuilder-canvas-edges');
    console.log('AIBuilder localStorage cleared');
    window.location.reload();
  };

  // Load saved canvas state on component mount
  useEffect(() => {
    const savedNodes = localStorage.getItem('aibuilder-canvas-nodes');
    const savedEdges = localStorage.getItem('aibuilder-canvas-edges');
    
    if (savedNodes) {
      try {
        const parsedNodes = JSON.parse(savedNodes);
        
        // Validate and migrate nodes - remove any that contain React objects
        const validNodes = parsedNodes.map((node: any) => {
          // Check if node contains React component objects
          if (node.data && typeof node.data.icon === 'object' && node.data.icon.$$typeof) {
            console.warn('Removing node with React object icon:', node.id);
            return null;
          }
          
          // Ensure node has iconName, not icon object
          if (node.data && node.data.icon && !node.data.iconName) {
            console.warn('Converting old node format:', node.id);
            return null; // Remove to prevent React object errors
          }
          
          // Validate node structure
          if (!node.id || !node.data || !node.position) {
            console.warn('Invalid node structure:', node);
            return null;
          }
          
          return node;
        }).filter(Boolean); // Remove null nodes
        
        console.log(`Loaded ${validNodes.length} valid nodes from localStorage`);
        setNodes(validNodes);
      } catch (error) {
        console.error('Failed to load saved nodes:', error);
        // Clear corrupted localStorage completely
        localStorage.removeItem('aibuilder-canvas-nodes');
        localStorage.removeItem('aibuilder-canvas-edges');
        console.log('Cleared corrupted localStorage data');
      }
    }
    
    if (savedEdges) {
      try {
        const parsedEdges = JSON.parse(savedEdges);
        // Validate edges structure
        const validEdges = parsedEdges.filter((edge: any) => {
          return edge.id && edge.source && edge.target;
        });
        setEdges(validEdges);
      } catch (error) {
        console.error('Failed to load saved edges:', error);
        localStorage.removeItem('aibuilder-canvas-edges');
      }
    }
  }, [setNodes, setEdges]);

  // Save canvas state whenever nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      localStorage.setItem('aibuilder-canvas-nodes', JSON.stringify(nodes));
      localStorage.setItem('aibuilder-canvas-edges', JSON.stringify(edges));
    }
  }, [nodes, edges]);

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

  const handleGenerateCode = async () => {
    if (nodes.length === 0) {
      toast({
        title: "No Components",
        description: "Add some components to generate code",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCode(true);
    try {
      // Generate code based on current components
      const componentTypes = nodes.map(node => {
        return node.data.componentName || node.data.name || 'Component';
      });

      const prompt = `Generate a React component that includes: ${componentTypes.join(', ')}`;
      
      const response = await fetch('/api/ai/generate-component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentType: 'Combined Layout',
          framework: 'React + Tailwind CSS',
          stylePreferences: `Include ${componentTypes.join(', ')} with modern responsive design`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const result = await response.json();
      
      toast({
        title: "Code Generated!",
        description: "Your component code has been generated successfully",
      });

      // In a real app, you might save this to a project or show it in a modal
      console.log('Generated code:', result.code);
      
    } catch (error) {
      console.error('Code generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, { nodes, edges }]);
      setNodes(lastState.nodes);
      setEdges(lastState.edges);
      setUndoStack(prev => prev.slice(0, -1));
      
      // Update localStorage
      localStorage.setItem('aibuilder-canvas-nodes', JSON.stringify(lastState.nodes));
      localStorage.setItem('aibuilder-canvas-edges', JSON.stringify(lastState.edges));
      
      toast({
        title: "Undone",
        description: "Last action has been undone",
      });
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, { nodes, edges }]);
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setRedoStack(prev => prev.slice(0, -1));
      
      // Update localStorage
      localStorage.setItem('aibuilder-canvas-nodes', JSON.stringify(nextState.nodes));
      localStorage.setItem('aibuilder-canvas-edges', JSON.stringify(nextState.edges));
      
      toast({
        title: "Redone",
        description: "Action has been redone",
      });
    }
  };

  const handleClearCanvas = () => {
    // Save current state for undo
    setUndoStack(prev => [...prev, { nodes, edges }]);
    setRedoStack([]);
    
    // Clear the canvas
    setNodes([]);
    setEdges([]);
    setSelectedComponent(null);
    
    // Clear localStorage
    localStorage.removeItem('aibuilder-canvas-nodes');
    localStorage.removeItem('aibuilder-canvas-edges');
    
    toast({
      title: "Canvas Cleared",
      description: "All components have been removed from the canvas",
    });
  };

  const handleComponentDrop = (component: ComponentPaletteItem) => {
    // Save current state for undo
    setUndoStack(prev => [...prev, { nodes, edges }]);
    setRedoStack([]); // Clear redo stack when new action is performed
    
    // Get icon name for safe serialization
    const getIconName = (IconComponent: any) => {
      const iconName = IconComponent.displayName || IconComponent.name;
      if (iconName) return iconName;
      
      // Map specific icons to names
      if (IconComponent === Monitor) return 'Monitor';
      if (IconComponent === NavigationIcon) return 'NavigationIcon';
      if (IconComponent === Grid) return 'Grid';
      if (IconComponent === Star) return 'Star';
      if (IconComponent === Type) return 'Type';
      if (IconComponent === Image) return 'Image';
      if (IconComponent === MousePointer) return 'MousePointer';
      if (IconComponent === FileText) return 'FileText';
      if (IconComponent === CreditCard) return 'CreditCard';
      if (IconComponent === Video) return 'Video';
      if (IconComponent === Music) return 'Music';
      if (IconComponent === Calendar) return 'Calendar';
      if (IconComponent === MapPin) return 'MapPin';
      if (IconComponent === ShoppingCart) return 'ShoppingCart';
      if (IconComponent === Users) return 'Users';
      if (IconComponent === Mail) return 'Mail';
      if (IconComponent === Phone) return 'Phone';
      if (IconComponent === Clock) return 'Clock';
      if (IconComponent === Globe) return 'Globe';
      if (IconComponent === Layers) return 'Layers';
      if (IconComponent === Layout) return 'Layout';
      if (IconComponent === Columns) return 'Columns';
      if (IconComponent === BarChart3) return 'BarChart3';
      if (IconComponent === PieChart) return 'PieChart';
      if (IconComponent === TrendingUp) return 'TrendingUp';
      if (IconComponent === MessageSquare) return 'MessageSquare';
      if (IconComponent === Heart) return 'Heart';
      if (IconComponent === Share2) return 'Share2';
      if (IconComponent === Download) return 'Download';
      if (IconComponent === Upload) return 'Upload';
      if (IconComponent === Lock) return 'Lock';
      if (IconComponent === User) return 'User';
      if (IconComponent === Award) return 'Award';
      if (IconComponent === Bookmark) return 'Bookmark';
      if (IconComponent === Tag) return 'Tag';
      if (IconComponent === Search) return 'Search';
      return 'Type'; // fallback
    };
    
    const newNode: Node = {
      id: `${component.id}-${Date.now()}`,
      type: 'component',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        iconName: getIconName(component.icon),
        componentType: component.id,
        componentName: component.name,
        componentDescription: component.description,
        category: component.category,
        properties: {
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          width: 'auto',
        }
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
        {viewMode === 'drag-drop' ? (
          <>
            {/* Component Palette */}
            <div className="w-80 bg-card border-r border-border p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Components</h3>
                <Button
                  size="sm"
                  onClick={() => setViewMode('ai-build')}
                  className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                  data-testid="button-build-with-ai"
                >
                  <WandSparkles className="w-4 h-4 mr-1" />
                  Build with AI
                </Button>
              </div>
          
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
                          {(() => {
                            // Map icon components to their names and render safely
                            const iconMap: Record<string, any> = {
                              'Monitor': Monitor,
                              'NavigationIcon': NavigationIcon,
                              'Grid': Grid,
                              'Star': Star,
                              'Type': Type,
                              'Image': Image,
                              'MousePointer': MousePointer,
                              'FileText': FileText,
                              'CreditCard': CreditCard,
                              'Video': Video,
                              'Music': Music,
                              'Calendar': Calendar,
                              'MapPin': MapPin,
                              'ShoppingCart': ShoppingCart,
                              'Users': Users,
                              'Mail': Mail,
                              'Phone': Phone,
                              'Clock': Clock,
                              'Globe': Globe,
                              'Layers': Layers,
                              'Layout': Layout,
                              'Columns': Columns,
                              'BarChart3': BarChart3,
                              'PieChart': PieChart,
                              'TrendingUp': TrendingUp,
                              'MessageSquare': MessageSquare,
                              'Heart': Heart,
                              'Share2': Share2,
                              'Download': Download,
                              'Upload': Upload,
                              'Lock': Lock,
                              'User': User,
                              'Award': Award,
                              'Bookmark': Bookmark,
                              'Tag': Tag,
                              'Search': Search,
                            };
                            
                            // Get icon name from component
                            let iconName = 'Type'; // fallback
                            if (component.icon === Monitor) iconName = 'Monitor';
                            else if (component.icon === NavigationIcon) iconName = 'NavigationIcon';
                            else if (component.icon === Grid) iconName = 'Grid';
                            else if (component.icon === Star) iconName = 'Star';
                            else if (component.icon === Type) iconName = 'Type';
                            else if (component.icon === Image) iconName = 'Image';
                            else if (component.icon === MousePointer) iconName = 'MousePointer';
                            else if (component.icon === FileText) iconName = 'FileText';
                            else if (component.icon === CreditCard) iconName = 'CreditCard';
                            else if (component.icon === Video) iconName = 'Video';
                            else if (component.icon === Music) iconName = 'Music';
                            else if (component.icon === Calendar) iconName = 'Calendar';
                            else if (component.icon === MapPin) iconName = 'MapPin';
                            else if (component.icon === ShoppingCart) iconName = 'ShoppingCart';
                            else if (component.icon === Users) iconName = 'Users';
                            else if (component.icon === Mail) iconName = 'Mail';
                            else if (component.icon === Phone) iconName = 'Phone';
                            else if (component.icon === Clock) iconName = 'Clock';
                            else if (component.icon === Globe) iconName = 'Globe';
                            else if (component.icon === Layers) iconName = 'Layers';
                            else if (component.icon === Layout) iconName = 'Layout';
                            else if (component.icon === Columns) iconName = 'Columns';
                            else if (component.icon === BarChart3) iconName = 'BarChart3';
                            else if (component.icon === PieChart) iconName = 'PieChart';
                            else if (component.icon === TrendingUp) iconName = 'TrendingUp';
                            else if (component.icon === MessageSquare) iconName = 'MessageSquare';
                            else if (component.icon === Heart) iconName = 'Heart';
                            else if (component.icon === Share2) iconName = 'Share2';
                            else if (component.icon === Download) iconName = 'Download';
                            else if (component.icon === Upload) iconName = 'Upload';
                            else if (component.icon === Lock) iconName = 'Lock';
                            else if (component.icon === User) iconName = 'User';
                            else if (component.icon === Award) iconName = 'Award';
                            else if (component.icon === Bookmark) iconName = 'Bookmark';
                            else if (component.icon === Tag) iconName = 'Tag';
                            else if (component.icon === Search) iconName = 'Search';
                            
                            const IconComponent = iconMap[iconName] || Type;
                            return <IconComponent className="w-4 h-4 text-muted-foreground mr-2" />;
                          })()}
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
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerateCode}
                disabled={isGeneratingCode || nodes.length === 0}
                data-testid="button-generate-code"
              >
                {isGeneratingCode ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-1" />
                    Generate Code
                  </>
                )}
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                data-testid="button-undo"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                data-testid="button-redo"
              >
                <Redo className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleClearCanvas}
                disabled={nodes.length === 0}
                data-testid="button-clear-canvas"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-muted/20 relative">
            <div 
              className={`mx-auto transition-all duration-300 ${
                selectedDevice === 'mobile' ? 'max-w-sm' :
                selectedDevice === 'tablet' ? 'max-w-2xl' :
                'w-full'
              }`}
              style={{
                height: '100%',
                border: selectedDevice !== 'desktop' ? '2px solid #e5e7eb' : 'none',
                borderRadius: selectedDevice !== 'desktop' ? '12px' : '0',
                backgroundColor: selectedDevice !== 'desktop' ? 'white' : 'transparent'
              }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => setSelectedComponent(node.id)}
                onPaneClick={() => setSelectedComponent(null)}
                nodeTypes={nodeTypes}
                connectionMode="loose"
                snapToGrid={true}
                snapGrid={[20, 20]}
                fitView
              >
                <Controls />
                <MiniMap />
                <Background variant={"dots" as any} gap={20} size={1} />
              </ReactFlow>
            </div>

            {/* Empty Canvas Message (only for drag-drop mode) */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-muted/20">
                <div className="text-center max-w-2xl pointer-events-auto">
                  <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-medium text-foreground mb-2">
                    Start Building Your Website
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Drag components from the left panel to design your website visually
                  </p>
                  
                  <div className="bg-card border border-border rounded-lg p-6 mt-8">
                    <h4 className="font-medium mb-4">Quick Start Tips:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground text-left">
                      <p>• Choose components from the left sidebar</p>
                      <p>• Click components to add them to your canvas</p>
                      <p>• Drag from the connection points (small circles) to connect components</p>
                      <p>• Select components to edit their properties</p>
                      <p>• Use the "Build with AI" button for AI assistance</p>
                    </div>
                  </div>
                  
                  {projects && Array.isArray(projects) && projects.length > 0 && (
                    <div className="bg-card border border-border rounded-lg p-4 mt-4">
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
                        onChange={(e) => {
                          const node = nodes.find(n => n.id === selectedComponent);
                          if (node) {
                            setNodes(nodes.map(n => n.id === selectedComponent ? {
                              ...n,
                              style: { ...n.style, background: e.target.value },
                              data: {
                                ...n.data,
                                properties: {
                                  ...n.data.properties,
                                  backgroundColor: e.target.value
                                }
                              }
                            } : n));
                          }
                        }}
                      />
                      <Input
                        type="text"
                        defaultValue="#ffffff"
                        className="flex-1 text-sm"
                        data-testid="input-background-color-text"
                        onChange={(e) => {
                          const node = nodes.find(n => n.id === selectedComponent);
                          if (node && /^#[0-9A-F]{6}$/i.test(e.target.value)) {
                            setNodes(nodes.map(n => n.id === selectedComponent ? {
                              ...n,
                              style: { ...n.style, background: e.target.value },
                              data: {
                                ...n.data,
                                properties: {
                                  ...n.data.properties,
                                  backgroundColor: e.target.value
                                }
                              }
                            } : n));
                          }
                        }}
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
                        onChange={(e) => {
                          const node = nodes.find(n => n.id === selectedComponent);
                          if (node) {
                            setNodes(nodes.map(n => n.id === selectedComponent ? {
                              ...n,
                              style: { ...n.style, color: e.target.value },
                              data: {
                                ...n.data,
                                properties: {
                                  ...n.data.properties,
                                  textColor: e.target.value
                                }
                              }
                            } : n));
                          }
                        }}
                      />
                      <Input
                        type="text"
                        defaultValue="#1f2937"
                        className="flex-1 text-sm"
                        data-testid="input-text-color-text"
                        onChange={(e) => {
                          const node = nodes.find(n => n.id === selectedComponent);
                          if (node && /^#[0-9A-F]{6}$/i.test(e.target.value)) {
                            setNodes(nodes.map(n => n.id === selectedComponent ? {
                              ...n,
                              style: { ...n.style, color: e.target.value },
                              data: {
                                ...n.data,
                                properties: {
                                  ...n.data.properties,
                                  textColor: e.target.value
                                }
                              }
                            } : n));
                          }
                        }}
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
                    <select 
                      className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                      onChange={(e) => {
                        const node = nodes.find(n => n.id === selectedComponent);
                        if (node) {
                          let width = 'auto';
                          switch(e.target.value) {
                            case 'Full Width':
                              width = '100%';
                              break;
                            case 'Custom':
                              width = '300px';
                              break;
                            default:
                              width = 'auto';
                          }
                          setNodes(nodes.map(n => n.id === selectedComponent ? {
                            ...n,
                            style: { ...n.style, width },
                            data: {
                              ...n.data,
                              properties: {
                                ...n.data.properties,
                                width: e.target.value
                              }
                            }
                          } : n));
                        }
                      }}
                    >
                      <option>Auto</option>
                      <option>Full Width</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Actions
                    </label>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setNodes(nodes.filter(n => n.id !== selectedComponent));
                          setSelectedComponent(null);
                          toast({
                            title: "Component Deleted",
                            description: "Component has been removed from canvas",
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Component
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const node = nodes.find(n => n.id === selectedComponent);
                          if (node) {
                            const duplicatedNode = {
                              ...node,
                              id: `${node.data.componentType}-${Date.now()}`,
                              position: {
                                x: node.position.x + 20,
                                y: node.position.y + 20
                              }
                            };
                            setNodes(nodes => [...nodes, duplicatedNode]);
                            toast({
                              title: "Component Duplicated",
                              description: "Component has been duplicated",
                            });
                          }
                        }}
                      >
                        Duplicate Component
                      </Button>
                    </div>
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
        </>
        ) : (
          /* AI Build Mode */
          <div className="w-full flex flex-col">
            {/* AI Build Header */}
            <div className="bg-card border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <WandSparkles className="w-6 h-6 text-accent" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">AI Website Builder</h2>
                  <p className="text-sm text-muted-foreground">Describe your website and let AI build it for you</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setViewMode('drag-drop')}
                data-testid="button-back-to-drag-drop"
              >
                Back to Drag & Drop
              </Button>
            </div>

            {/* AI Build Content */}
            <div className="flex-1 p-8 bg-muted/20">
              <div className="max-w-4xl mx-auto">
                {!aiMode ? (
                  /* Mode Selection */
                  <>
                    <div className="text-center mb-8">
                      <Star className="w-16 h-16 text-accent mx-auto mb-4" />
                      <h3 className="text-3xl font-bold text-foreground mb-4">
                        Choose Your AI Building Mode
                      </h3>
                      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Select how you want AI to help you build your project
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {/* Flow Builder Mode */}
                      <div 
                        className="bg-card border border-border rounded-xl p-8 cursor-pointer hover:border-accent transition-all hover:shadow-lg group"
                        onClick={() => setAiMode('flow')}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                            <Grid className="w-8 h-8 text-blue-600" />
                          </div>
                          <h4 className="text-xl font-bold text-foreground mb-3">Make Flow with AI</h4>
                          <p className="text-muted-foreground mb-6">
                            Create interactive flowcharts, diagrams, and visual workflows. Perfect for process mapping, user journeys, and system designs.
                          </p>
                          <ul className="text-sm text-muted-foreground text-left space-y-2">
                            <li>• Interactive flowcharts</li>
                            <li>• Process diagrams</li>
                            <li>• User journey maps</li>
                            <li>• System workflows</li>
                          </ul>
                        </div>
                      </div>

                      {/* WebApp Builder Mode */}
                      <div 
                        className="bg-card border border-border rounded-xl p-8 cursor-pointer hover:border-accent transition-all hover:shadow-lg group"
                        onClick={() => setAiMode('webapp')}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                            <Code className="w-8 h-8 text-purple-600" />
                          </div>
                          <h4 className="text-xl font-bold text-foreground mb-3">Build Full WebApp with AI</h4>
                          <p className="text-muted-foreground mb-6">
                            Generate complete web applications with components, pages, and functionality. Ideal for landing pages, portfolios, and full websites.
                          </p>
                          <ul className="text-sm text-muted-foreground text-left space-y-2">
                            <li>• Complete web applications</li>
                            <li>• React components</li>
                            <li>• Responsive design</li>
                            <li>• Full code generation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Selected Mode Interface */
                  <>
                    <div className="text-center mb-8">
                      <Button
                        variant="ghost"
                        onClick={() => setAiMode(null)}
                        className="mb-4"
                      >
                        ← Back to Mode Selection
                      </Button>
                      
                      {aiMode === 'flow' ? (
                        <>
                          <Grid className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                          <h3 className="text-3xl font-bold text-foreground mb-4">
                            Create Flow with AI
                          </h3>
                          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Describe the process or workflow you want to visualize, and AI will create an interactive flowchart for you.
                          </p>
                        </>
                      ) : (
                        <>  
                          <Code className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                          <h3 className="text-3xl font-bold text-foreground mb-4">
                            Build WebApp with AI
                          </h3>
                          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Describe the web application you want to build, and AI will generate a complete, interactive website that you can preview immediately in your browser.
                          </p>
                        </>
                      )}
                    </div>

                    {/* AI Build Form */}
                    <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                      <BuildFromPromptForm 
                        mode={aiMode}
                        onSuccess={(result) => {
                          if (aiMode === 'webapp') {
                            // For webapp mode, redirect to preview the generated website
                            if (result && result.project && result.project.id) {
                              toast({
                                title: "WebApp Generated!",
                                description: "Your web application is ready! Opening preview...",
                              });
                              
                              // Open preview in new tab
                              setTimeout(() => {
                                window.open(`/api/preview/${result.project.id}`, '_blank');
                              }, 1000);
                              
                              // Reset mode
                              setAiMode(null);
                              setViewMode('drag-drop');
                            } else {
                              toast({
                                title: "WebApp Generated!",
                                description: "Your web application is ready!",
                              });
                              setAiMode(null);
                              setViewMode('drag-drop');
                            }
                          } else {
                            // Flow mode - Generate components from AI response and switch back to drag-drop mode
                            if (result && result.generated && result.generated.components) {
                              const components = result.generated.components;
                              const aiGeneratedNodes = components.map((component: any, index: number) => {
                                const getComponentContent = (comp: any, mode: 'flow' | 'webapp') => {
                                  const type = comp.type?.toLowerCase() || 'component';
                                  
                                  if (mode === 'flow') {
                                    // Flow-specific components
                                    if (type.includes('start') || type.includes('begin')) {
                                      return {
                                        iconName: 'Star',
                                        name: 'Start Node',
                                        content: 'Starting point of the workflow',
                                        description: 'Initial step in the process flow'
                                      };
                                    } else if (type.includes('decision') || type.includes('condition')) {
                                      return {
                                        iconName: 'Grid',
                                        name: 'Decision Point',
                                        content: 'Conditional branch in the flow',
                                        description: 'Yes/No decision making step'
                                      };
                                    } else if (type.includes('process') || type.includes('action')) {
                                      return {
                                        iconName: 'CreditCard',
                                        name: 'Process Step',
                                        content: 'Action or process execution',
                                        description: 'Main workflow processing step'
                                      };
                                    } else if (type.includes('end') || type.includes('finish')) {
                                      return {
                                        iconName: 'Type',
                                        name: 'End Node',
                                        content: 'Workflow completion point',
                                        description: 'Final step in the process'
                                      };
                                    } else {
                                      return {
                                        iconName: 'MousePointer',
                                        name: comp.name || 'Flow Element',
                                        content: comp.content || 'Custom flow step',
                                        description: comp.description || 'AI-generated flow component'
                                      };
                                    }
                                  } else {
                                    // This shouldn't be reached in flow mode, but keeping for safety
                                    return {
                                      iconName: 'Monitor',
                                      name: comp.name || 'Flow Component',
                                      content: comp.content || 'Custom flow element',
                                      description: comp.description || 'AI-generated component'
                                    };
                                  }
                                };
                                
                                const componentData = getComponentContent(component, aiMode);
                                
                                return {
                                  id: `ai-${component.type}-${Date.now()}-${index}`,
                                  type: 'component',
                                  position: { x: 100 + (index * 250), y: 100 + (Math.floor(index / 3) * 180) },
                                  data: {
                                    iconName: componentData.iconName,
                                    componentType: component.type,
                                    componentName: componentData.name,
                                    componentContent: componentData.content,
                                    componentDescription: componentData.description,
                                    aiGenerated: true,
                                    aiMode: aiMode,
                                    htmlCode: result.generated.htmlCode,
                                    cssCode: result.generated.cssCode,
                                    jsCode: result.generated.jsCode,
                                    properties: {
                                      backgroundColor: '#ffffff',
                                      textColor: '#1f2937',
                                      width: 'auto',
                                    }
                                  },
                                };
                              });
                              
                              // Save current state for undo
                              setUndoStack(prev => [...prev, { nodes, edges }]);
                              setRedoStack([]); // Clear redo stack
                              
                              // Add the AI generated nodes
                              setNodes(aiGeneratedNodes);
                              
                              // Reset AI mode and switch back to drag-drop mode
                              setAiMode(null);
                              setViewMode('drag-drop');
                              
                              toast({
                                title: "Flow Generated!",
                                description: `Created ${components.length} components from your prompt. You can now customize them!`,
                              });
                            } else {
                              // Reset mode and switch back anyway to show the updated interface
                              setAiMode(null);
                              setViewMode('drag-drop');
                              
                              toast({
                                title: "Flow Generated!",
                                description: "Your AI-generated project is ready. Check the Code Preview to see the full code!",
                              });
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Mode-specific Examples */}
                    <div className="mt-12">
                      <h4 className="text-lg font-semibold text-foreground mb-4 text-center">
                        {aiMode === 'flow' ? 'Flow Examples' : 'WebApp Examples'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(aiMode === 'flow' ? [
                          "Create a user registration flow with validation steps",
                          "Design an e-commerce checkout process workflow",
                          "Map out a customer support ticket resolution process",
                          "Build a software deployment pipeline diagram"
                        ] : [
                          "Create a modern SaaS landing page with pricing, features, and testimonials",
                          "Build a professional portfolio website with project gallery and contact form",
                          "Design an e-commerce store with product catalog and shopping cart",
                          "Make a restaurant website with menu, photo gallery, and online booking"
                        ]).map((example, index) => (
                          <div key={index} className="bg-background border border-border rounded-lg p-4 cursor-pointer hover:border-accent transition-colors">
                            <p className="text-sm text-muted-foreground">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
