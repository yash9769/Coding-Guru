import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BuildFromPromptFormProps {
  onSuccess: () => void;
}

export default function BuildFromPromptForm({ onSuccess }: BuildFromPromptFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");

  const buildFromPromptMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      const response = await apiRequest('POST', '/api/ai/build-from-prompt', { 
        prompt: userPrompt 
      });
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Created!",
        description: `Successfully generated "${result.project.title}" from your prompt`,
      });
      setPrompt("");
      onSuccess();
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

  const suggestions = [
    "Build a modern landing page for a SaaS product with pricing tiers",
    "Create an e-commerce site for selling handmade crafts",
    "Design a portfolio website for a photographer",
    "Make a restaurant website with menu and online ordering",
    "Build a blog platform for technology articles",
  ];

  return (
    <Card className="w-full max-w-3xl pointer-events-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Describe what you want to build
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Build a modern portfolio website for a freelance designer with a contact form, project gallery, and about section..."
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
                Build with AI
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