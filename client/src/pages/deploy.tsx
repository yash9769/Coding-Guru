import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Rocket,
  CheckCircle,
  ExternalLink,
  Settings,
  Clock,
  Globe,
  Activity,
  Zap,
  Shield,
  Plus,
  Trash2,
} from "lucide-react";
import { useLocation } from "wouter";

interface DeploymentProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  pricing: string;
  deployTime: string;
  selected: boolean;
  recommended?: boolean;
}

interface Deployment {
  id: string;
  type: string;
  date: string;
  status: 'live' | 'archived';
  url?: string;
  buildTime?: string;
}

const deploymentProviders: DeploymentProvider[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    logo: '▲',
    description: 'Automatic deployments, global CDN, serverless functions',
    pricing: 'Free Plan Available',
    deployTime: '~30s deploy',
    selected: true,
    recommended: true,
  },
  {
    id: 'netlify',
    name: 'Netlify',
    logo: 'N',
    description: 'Git-based deployments, form handling, edge functions',
    pricing: 'Free Plan Available',
    deployTime: '~45s deploy',
    selected: false,
  },
  {
    id: 'aws',
    name: 'AWS Amplify',
    logo: 'AWS',
    description: 'Scalable hosting, full AWS integration, custom domains',
    pricing: 'Pay per use',
    deployTime: '~2min deploy',
    selected: false,
  },
];

const deploymentHistory: Deployment[] = [
  {
    id: '1',
    type: 'Production Deploy',
    date: 'Dec 15, 2023 at 2:30 PM',
    status: 'live',
    url: 'my-ai-website.vercel.app',
  },
  {
    id: '2',
    type: 'Preview Deploy',
    date: 'Dec 14, 2023 at 4:15 PM',
    status: 'archived',
    buildTime: '31s',
  },
  {
    id: '3',
    type: 'Initial Deploy',
    date: 'Dec 13, 2023 at 9:20 AM',
    status: 'archived',
    buildTime: '45s',
  },
];

const projectStats = [
  { label: 'Components', value: '3', icon: Activity },
  { label: 'API Endpoints', value: '5', icon: Zap },
  { label: 'Bundle Size', value: '2.3MB', icon: Settings },
  { label: 'Performance', value: '98%', icon: Shield, accent: true },
];

export default function Deploy() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('my-ai-website');
  const [customDomain, setCustomDomain] = useState('');
  const [environment, setEnvironment] = useState('Production');
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('vercel');
  const [envVars, setEnvVars] = useState([
    { key: 'NODE_ENV', value: 'production' },
    { key: 'DATABASE_URL', value: '••••••••••••' },
  ]);

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    // Simulate deployment process with progress updates
    const steps = [
      'Preparing deployment...',
      'Building application...',
      'Uploading assets...',
      'Configuring server...',
      'Starting application...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      toast({
        title: "Deploying",
        description: steps[i],
      });
    }
    
    setIsDeploying(false);
    toast({
      title: "Deployment Successful!",
      description: `Your website is now live at ${projectName}.${selectedProvider === 'vercel' ? 'vercel.app' : selectedProvider === 'netlify' ? 'netlify.app' : 'aws.com'}`,
    });
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    toast({
      title: "Provider Selected",
      description: `Switched to ${deploymentProviders.find(p => p.id === providerId)?.name}`,
    });
  };

  const handleAddEnvVar = () => {
    setEnvVars(prev => [...prev, { key: '', value: '' }]);
  };

  const handleUpdateEnvVar = (index: number, field: 'key' | 'value', newValue: string) => {
    setEnvVars(prev => prev.map((envVar, i) => 
      i === index ? { ...envVar, [field]: newValue } : envVar
    ));
  };

  const handleRemoveEnvVar = (index: number) => {
    setEnvVars(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setLocation('/backend-builder')} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Deploy</h1>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Ready to Deploy</span>
          </div>
        </div>

        {/* Deployment Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Deploy Your Project</CardTitle>
                <p className="text-muted-foreground">
                  Deploy your AI-generated website to the cloud with one click. Choose from multiple hosting providers.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">My Website</div>
                <div className="text-sm text-muted-foreground">Last updated 2 minutes ago</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {projectStats.map((stat, index) => (
                <div key={index} className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${stat.accent ? 'text-accent' : 'text-foreground'}`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deployment Providers */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Hosting Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deploymentProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedProvider === provider.id
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent'
                    }`}
                    onClick={() => handleProviderSelect(provider.id)}
                    data-testid={`provider-${provider.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-foreground text-background rounded flex items-center justify-center mr-3">
                          <span className="font-bold text-sm">{provider.logo}</span>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{provider.name}</span>
                            {provider.recommended && (
                              <Badge variant="secondary" className="ml-2">Recommended</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 border-2 rounded-full ${
                        selectedProvider === provider.id
                          ? 'border-accent bg-accent'
                          : 'border-border'
                      }`}>
                        {selectedProvider === provider.id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {provider.description}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">{provider.pricing}</span>
                      <span className="text-muted-foreground">{provider.deployTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deployment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Deployment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Name
                  </label>
                  <Input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    data-testid="input-project-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Custom Domain
                  </label>
                  <Input
                    type="text"
                    placeholder="yoursite.com (optional)"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    data-testid="input-custom-domain"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can add a custom domain after deployment
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Environment
                  </label>
                  <select 
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    data-testid="select-environment"
                  >
                    <option>Production</option>
                    <option>Preview</option>
                    <option>Development</option>
                  </select>
                </div>

                {/* Environment Variables */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Environment Variables
                  </label>
                  <div className="bg-background border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Variables ({envVars.length})</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleAddEnvVar}
                        data-testid="button-add-env-var"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {envVars.map((envVar, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <input
                            type="text"
                            placeholder="KEY"
                            value={envVar.key}
                            onChange={(e) => handleUpdateEnvVar(index, 'key', e.target.value)}
                            className="bg-muted px-2 py-1 rounded flex-1 text-xs"
                          />
                          <span>=</span>
                          <input
                            type={envVar.key.toLowerCase().includes('password') || envVar.key.toLowerCase().includes('secret') ? 'password' : 'text'}
                            placeholder="value"
                            value={envVar.value}
                            onChange={(e) => handleUpdateEnvVar(index, 'value', e.target.value)}
                            className="bg-muted px-2 py-1 rounded flex-1 text-xs"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveEnvVar(index)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Build Settings */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Build Settings
                  </label>
                  <div className="bg-background border border-border rounded-lg p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Build Command</span>
                        <code className="font-mono bg-muted px-2 py-1 rounded text-xs">npm run build</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Output Directory</span>
                        <code className="font-mono bg-muted px-2 py-1 rounded text-xs">dist/</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Node Version</span>
                        <code className="font-mono bg-muted px-2 py-1 rounded text-xs">18.x</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deploy Button */}
        <div className="mt-6 text-center">
          <Button
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
            onClick={handleDeploy}
            disabled={isDeploying}
            data-testid="button-deploy-now"
          >
            {isDeploying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5 mr-3" />
                Deploy Now
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Your website will be live in under 60 seconds
          </p>
        </div>

        {/* Previous Deployments */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Deployment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deploymentHistory.map((deployment) => (
                <div
                  key={deployment.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                  data-testid={`deployment-${deployment.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      deployment.status === 'live' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{deployment.type}</div>
                      <div className="text-xs text-muted-foreground">{deployment.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={deployment.status === 'live' ? 'default' : 'secondary'}>
                      {deployment.status === 'live' ? 'Live' : 'Archived'}
                    </Badge>
                    {deployment.url ? (
                      <button
                        onClick={() => {
                          // In a real app, this would open the actual deployment
                          toast({
                            title: "Opening Deployment",
                            description: `Opening ${deployment.url} in a new tab`,
                          });
                          window.open(`https://${deployment.url}`, '_blank');
                        }}
                        className="text-accent hover:text-accent-foreground text-sm flex items-center hover:underline"
                        data-testid={`link-${deployment.id}`}
                      >
                        {deployment.url}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </button>
                    ) : (
                      <span className="text-sm text-muted-foreground">{deployment.buildTime}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
