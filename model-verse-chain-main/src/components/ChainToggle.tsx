
import { Link2, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChainToggleProps {
  isChaining: boolean;
  onToggle: (chaining: boolean) => void;
  chainModels?: string[];
  onChainModelsChange?: (models: string[]) => void;
}

const availableModels = [
  // Chat / QA Models
  { id: 'mistral-7b-instruct', name: 'Mistral 7B Instruct', category: 'Chat/QA' },
  { id: 'kimi-72b', name: 'Kimi 72B', category: 'Chat/QA' },
  { id: 'cypher-alpha', name: 'Cypher Alpha', category: 'Chat/QA' },
  { id: 'qwen3-14b', name: 'Qwen3 14B', category: 'Chat/QA' },
  { id: 'qwen3-30b-a3b', name: 'Qwen3 30B A3B', category: 'Chat/QA' },
  // Coding Models
  { id: 'deepseek-chat', name: 'DeepSeek Chat', category: 'Coding' },
  { id: 'dolphin3.0-r1', name: 'Dolphin 3.0 R1', category: 'Coding' },
  { id: 'chimera', name: 'Chimera', category: 'Coding' },
  { id: 'qwen3-8b', name: 'Qwen3 8B', category: 'Coding' },
  // Multilingual / Indian Models
  { id: 'sarvam-m', name: 'Sarvam M', category: 'Multilingual' },
  { id: 'glm-z1', name: 'GLM Z1', category: 'Multilingual' },
  // Experimental Models
  { id: 'llama-4-maverick', name: 'Llama 4 Maverick', category: 'Experimental' },
  { id: 'mai-ds-r1', name: 'MAI DS R1', category: 'Experimental' }
];

export const ChainToggle = ({ 
  isChaining, 
  onToggle, 
  chainModels = ['mistral-7b-instruct', 'deepseek-chat'], 
  onChainModelsChange 
}: ChainToggleProps) => {
  const handleModelChange = (index: number, modelId: string) => {
    if (onChainModelsChange) {
      const newModels = [...chainModels];
      newModels[index] = modelId;
      onChainModelsChange(newModels);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-400 font-medium">Mode:</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isChaining ? "default" : "outline"}
              size="sm"
              onClick={() => onToggle(!isChaining)}
              className={`transition-all duration-200 ${
                isChaining
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg'
                  : 'border-slate-600 text-slate-100 hover:bg-slate-700 hover:text-white bg-slate-800/50'
              }`}
            >
              {isChaining ? (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Chain Mode
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Single Mode
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700 text-white">
            <div className="space-y-1">
              <p className="font-medium">
                {isChaining ? 'Chain Mode Active' : 'Single Mode Active'}
              </p>
              <p className="text-sm text-slate-300">
                {isChaining 
                  ? 'Output from one model becomes input for the next'
                  : 'Get response from selected model only'
                }
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isChaining && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Chain:</span>
          <div className="flex items-center gap-2">
            {chainModels.map((modelId, index) => (
              <div key={index} className="flex items-center gap-1">
                <Select value={modelId} onValueChange={(value) => handleModelChange(index, value)}>
                  <SelectTrigger className="w-32 h-8 bg-slate-800/50 border-slate-600 text-slate-300">
                    <SelectValue>
                      <span className="text-xs">{availableModels.find(m => m.id === modelId)?.name}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id} className="text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {model.category}
                          </Badge>
                          <span>{model.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {index < chainModels.length - 1 && (
                  <span className="text-slate-500 text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
