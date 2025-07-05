
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const models = [
  // Chat / QA Models
  {
    id: 'mistral-7b-instruct',
    name: 'Mistral 7B Instruct',
    description: 'Fast chat and QA',
    category: 'Chat/QA',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'kimi-72b',
    name: 'Kimi 72B',
    description: 'Large scale chat model',
    category: 'Chat/QA',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'cypher-alpha',
    name: 'Cypher Alpha',
    description: 'Advanced reasoning',
    category: 'Chat/QA',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'qwen3-14b',
    name: 'Qwen3 14B',
    description: 'Balanced performance',
    category: 'Chat/QA',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'qwen3-30b-a3b',
    name: 'Qwen3 30B A3B',
    description: 'High capacity model',
    category: 'Chat/QA',
    color: 'from-blue-500 to-cyan-600'
  },
  // Coding Models
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    description: 'Specialized for coding',
    category: 'Coding',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'dolphin3.0-r1',
    name: 'Dolphin 3.0 R1',
    description: 'Code generation expert',
    category: 'Coding',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'chimera',
    name: 'Chimera',
    description: 'Multi-modal coding',
    category: 'Coding',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'qwen3-8b',
    name: 'Qwen3 8B',
    description: 'Efficient coding model',
    category: 'Coding',
    color: 'from-green-500 to-emerald-600'
  },
  // Multilingual / Indian Models
  {
    id: 'sarvam-m',
    name: 'Sarvam M',
    description: 'Indian language support',
    category: 'Multilingual',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'glm-z1',
    name: 'GLM Z1',
    description: 'Multilingual capabilities',
    category: 'Multilingual',
    color: 'from-orange-500 to-red-600'
  },
  // Experimental Models
  {
    id: 'llama-4-maverick',
    name: 'Llama 4 Maverick',
    description: 'Experimental features',
    category: 'Experimental',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'mai-ds-r1',
    name: 'MAI DS R1',
    description: 'Research model',
    category: 'Experimental',
    color: 'from-purple-500 to-pink-600'
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export const ModelSelector = ({ selectedModel, onModelChange, disabled }: ModelSelectorProps) => {
  const currentModel = models.find(model => model.id === selectedModel);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-400 font-medium">Model:</span>
      <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
        <SelectTrigger className="w-[220px] bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50 transition-all duration-200 shadow-lg">
          <SelectValue>
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className={`text-xs border-slate-600 bg-gradient-to-r ${currentModel?.color} text-white border-0`}
              >
                {currentModel?.category}
              </Badge>
              <span className="font-medium">{currentModel?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700 shadow-2xl">
          {models.map((model) => (
            <SelectItem 
              key={model.id} 
              value={model.id}
              className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`text-xs bg-gradient-to-r ${model.color} text-white border-0`}
                  >
                    {model.category}
                  </Badge>
                  <span className="font-medium">{model.name}</span>
                </div>
                <span className="text-xs text-slate-400 ml-3">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
