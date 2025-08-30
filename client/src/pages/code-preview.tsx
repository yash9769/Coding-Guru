import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Copy,
  Rocket,
  Bot,
  Check,
  Code,
  Palette,
  Braces,
} from "lucide-react";
import { useLocation } from "wouter";

const sampleCode = `import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Our Platform
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Build amazing web applications with our AI-powered tools
          and deploy them instantly to the cloud.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;`;

const codeVariants = [
  {
    id: 'hero-v1',
    name: 'Hero v1',
    description: 'Gradient with centered content',
    selected: true,
  },
  {
    id: 'hero-v2',
    name: 'Hero v2',
    description: 'Image background variant',
    selected: false,
  },
  {
    id: 'hero-v3',
    name: 'Hero v3',
    description: 'Split layout design',
    selected: false,
  },
];

export default function CodePreview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'react' | 'css' | 'js'>('react');
  const [componentType, setComponentType] = useState('Hero Section');
  const [framework, setFramework] = useState('React + Tailwind CSS');
  const [stylePreferences, setStylePreferences] = useState('Modern, gradient background, centered content, responsive design');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState({
    react: sampleCode,
    css: '/* Add your custom CSS here */\n.hero-gradient {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n}',
    js: '// Add your JavaScript here\nconsole.log("Component loaded");'
  });
  const [selectedVariant, setSelectedVariant] = useState('hero-v1');
  const [variants, setVariants] = useState(codeVariants);

  const handleCopyCode = () => {
    const currentCode = generatedCode[activeTab];
    navigator.clipboard.writeText(currentCode);
    toast({
      title: "Copied!",
      description: `${activeTab.toUpperCase()} code copied to clipboard`,
    });
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentType,
          framework,
          stylePreferences,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate code');
      }

      const result = await response.json();
      
      // Update the generated code
      setGeneratedCode(prev => ({
        ...prev,
        react: result.code || prev.react
      }));
      
      // Create new variant
      const newVariantId = `${componentType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const newVariant = {
        id: newVariantId,
        name: `${componentType} v${variants.length + 1}`,
        description: stylePreferences.substring(0, 50) + '...',
        selected: false,
      };
      
      setVariants(prev => prev.map(v => ({ ...v, selected: false })).concat(newVariant));
      setSelectedVariant(newVariantId);
      
      toast({
        title: "Code Generated!",
        description: `Successfully generated ${componentType} component using AI`,
      });
      
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVariantSelect = (variantId: string) => {
    setVariants(prev => prev.map(v => ({ ...v, selected: v.id === variantId })));
    setSelectedVariant(variantId);
    // In a real app, you would load the code for this variant
    toast({
      title: "Variant Selected",
      description: `Switched to ${variants.find(v => v.id === variantId)?.name}`,
    });
  };

  const handleDeploy = () => {
    setLocation('/deploy');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-73px)]">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Code Tabs */}
          <div className="bg-card border-b border-border px-4 flex space-x-1">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'react'
                  ? 'bg-background border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('react')}
              data-testid="tab-react"
            >
              <Code className="w-4 h-4 mr-2 inline" />
              React Component
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'css'
                  ? 'bg-background border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('css')}
              data-testid="tab-css"
            >
              <Palette className="w-4 h-4 mr-2 inline" />
              Tailwind CSS
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'js'
                  ? 'bg-background border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('js')}
              data-testid="tab-js"
            >
              <Braces className="w-4 h-4 mr-2 inline" />
              JavaScript
            </button>
          </div>

          {/* Code Content */}
          <div className="flex-1 bg-gray-900 text-white p-6 overflow-auto">
            <div className="font-mono text-sm leading-relaxed">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  {activeTab === 'react' ? 'Generated React Component' :
                   activeTab === 'css' ? 'Custom CSS Styles' :
                   'JavaScript Logic'}
                </span>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Bot className="w-4 h-4" />
                  <span>AI Generated</span>
                </div>
              </div>
              
              <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                <code>{generatedCode[activeTab]}</code>
              </pre>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-card border-t border-border p-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setLocation('/')} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleCopyCode} data-testid="button-copy">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button onClick={handleDeploy} data-testid="button-deploy">
                <Rocket className="w-4 h-4 mr-2" />
                Deploy
              </Button>
            </div>
          </div>
        </div>

        {/* AI Generation Panel */}
        <div className="w-96 bg-card border-l border-border p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="AI Ready"></div>
          </div>

          {/* AI Status */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Bot className="w-5 h-5 text-accent mr-2" />
                <span className="font-medium text-accent">AI Status</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ready to generate code from your design. Click "Generate" to create React components with Tailwind CSS.
              </p>
            </CardContent>
          </Card>

          {/* Generation Controls */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Component Type
              </label>
              <select 
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                data-testid="select-component-type"
              >
                <option>Hero Section</option>
                <option>Navigation Bar</option>
                <option>Card Component</option>
                <option>Form Component</option>
                <option>Footer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Framework
              </label>
              <select 
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                data-testid="select-framework"
              >
                <option>React + Tailwind CSS</option>
                <option>Vue + Tailwind CSS</option>
                <option>HTML + CSS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Style Preferences
              </label>
              <Textarea
                className="w-full h-20 resize-none"
                placeholder="Describe the styling preferences..."
                value={stylePreferences}
                onChange={(e) => setStylePreferences(e.target.value)}
                data-testid="textarea-style-preferences"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            className="w-full bg-gradient-to-r from-primary to-accent text-white mb-4"
            onClick={handleGenerateCode}
            disabled={isGenerating}
            data-testid="button-generate"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>

          {/* Generated Variants */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Generated Variants</h4>
            <div className="space-y-2">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`bg-background border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedVariant === variant.id
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent'
                  }`}
                  onClick={() => handleVariantSelect(variant.id)}
                  data-testid={`variant-${variant.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{variant.name}</span>
                    {selectedVariant === variant.id && <Check className="w-4 h-4 text-accent" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {variant.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
