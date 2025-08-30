import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BuildFromPromptFormProps {
  onSuccess: (result?: any) => void;
  mode?: 'flow' | 'webapp';
}

export default function BuildFromPromptForm({ onSuccess, mode }: BuildFromPromptFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");

  const buildFromPromptMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      const response = await apiRequest('POST', '/api/ai/build-from-prompt', { 
        prompt: userPrompt,
        mode: mode || 'webapp' // Include mode in the request
      });
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Created!",
        description: `Successfully generated "${result.project?.title || 'Website'}" from your prompt`,
      });
      setPrompt("");
      onSuccess(result);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to build from prompt",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please describe what you want to build",
        variant: "destructive",
      });
      return;
    }
    buildFromPromptMutation.mutate(prompt);
  };

  const suggestions = mode === 'flow' ? [
    "Create a user registration flow with email verification and password setup",
    "Design an e-commerce checkout process with payment options",
    "Map out a customer support ticket resolution workflow",
    "Build a software deployment pipeline with testing stages",
    "Create an onboarding flow for a mobile app with tutorials",
  ] : [
    "Build a modern SaaS landing page with pricing tiers and testimonials",
    "Create a professional portfolio website with project showcase and contact form",
    "Design an e-commerce store with product catalog and shopping cart",
    "Make a restaurant website with menu, gallery, and online reservations",
    "Build a business website with services, team showcase, and client testimonials",
  ];

  return (
    <Card className="w-full max-w-3xl pointer-events-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {mode === 'flow' ? 'Describe the process or workflow you want to create' : 'Describe the web application you want to build'}
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'flow' 
                ? "e.g., Create a user onboarding flow that guides new users through account setup, profile creation, and initial tutorial..."
                : "e.g., Build a modern business website with hero section, services showcase, client testimonials, and contact form..."
              }
              className="min-h-[120px] resize-none"
              data-testid="textarea-build-prompt"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent text-white"
            disabled={buildFromPromptMutation.isPending || !prompt.trim()}
            data-testid="button-build-from-prompt"
          >
            {buildFromPromptMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Building your app...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {mode === 'flow' ? 'Create Flow with AI' : 'Build with AI'}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-3">Popular ideas to get you started:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                className="text-xs px-3 py-2 bg-muted hover:bg-muted-foreground/10 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`suggestion-${index}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}