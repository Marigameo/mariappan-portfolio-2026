The Challenge: Streamlining UI Development for Our AI Agents
As we accelerate our efforts in prototyping of AI agents to unlock our platform’s full potential, UI development has emerged as a major bottleneck.

While our long-term vision is a  configuration-based system for rapid, scalable UI generation without deep technical overhead, it’s not ready to support our initial agents.

In the meantime, our internal developers, who are the primary builders in this phase should be enabled with a fast way to prototype UIs that aligns with our standards and platform contracts, ensuring we keep momentum.

Templating agents (scaffolding)
The simple way we can enable pluggable agent interfaces can be via simple app scaffolding. If we managed to offer a complete scaffolding with all necessary capabilities and examples, agent builders can simply focus on the core agent logics and wire up the interface. 

Actively maintained here, check for updated interfaces - https://github.com/strivelabsco/root/blob/main/apps/client/platform/guides/AGENT_BUILDER_HANDOVER.mdConnect your Github account 

Agent Builder Handover Template
Overview
This document provides a comprehensive guide for building new agents using the existing platform infrastructure. The platform provides abstracted hooks and components that handle common functionality, allowing you to focus on agent-specific business logic.

Platform Architecture
Agent Structure


src/agents/[agent-name]/
├── screens/
│   ├── InputScreen.tsx      # Initial input/configuration screen
│   ├── LoadingScreen.tsx    # Processing/loading state
│   └── OutputScreen.tsx     # Results/output display
├── constants/
│   └── index.ts             # Node IDs and workflow configuration
└── assets/                  # Agent-specific assets
Agent States
The platform manages three primary agent states:

AgentState.Idle - Initial state, shows InputScreen

AgentState.Loading - Processing state, shows LoadingScreen  

AgentState.Completed - Results state, shows OutputScreen

Core Platform Hooks
1. useAgentWorkflowTrigger
Purpose: Abstracts workflow triggering with automatic state management

Usage:



import { useAgentWorkflowTrigger } from '@/hooks/useAgentWorkflowTrigger';
const { trigger, isLoading } = useAgentWorkflowTrigger();
// Basic usage
trigger({
  data: workflowData,
  callbacks: {
    onSuccess: (executionId) => {
      // Success logic
    },
    onFailure: (error) => {
      // Error handling
    },
    onStart: () => {
      // Start logic
    }
  }
});
Check out other advanced usage options here

What it handles automatically:

✅ Workflow instance validation

✅ setWorkflowExecutionId()

✅ setCurrentAgentState(AgentState.Loading)

✅ setIsLoading() management

✅ Error handling with default alerts

✅ State reset on failures

2. useAgentOutput
Purpose: Abstracts workflow output fetching and processing

Usage:



import { useAgentOutput } from '@/hooks/useAgentOutput';
const { data, isLoading, error, hasData } = useAgentOutput({
  targetNodeId: nodeIds.YOUR_TARGET_NODE,
  transformOutput: (rawData) => {
    // Optional: Transform raw data
    return processedData;
  }
});
What it provides:

✅ Automatic workflow execution state polling

✅ Node-specific output extraction

✅ Loading and error states

✅ Data transformation support

✅ Raw data access

3. useAgentReset
Purpose: Abstracts agent state reset for "new session" functionality

Usage:



import { useAgentReset } from '@/hooks/useAgentReset';
const { resetAgent } = useAgentReset();
const handleNewSession = () => {
  resetAgent({
    onReset: () => {
      // Custom reset logic
    }
  });
};
What it handles:

✅ setWorkflowExecutionId(null)

✅ setCurrentAgentState(AgentState.Idle)

✅ Custom reset callbacks

Platform Components
1. StepLoadingProgress
Purpose: Shows workflow step progress during loading

Usage:



import StepLoadingProgress from "@/components/main-stage-enablers/StepLoadingProgress";
<StepLoadingProgress
  isLoading={true}
  workflowNodes={workflowNodes}
/>
2. UI Components
Available from @strivelabs/ui-core:

Card, CardContent, CardHeader, CardTitle

Button, Input, Label

Tabs, TabsList, TabsTrigger, TabsContent

Separator

3. Icons
Available from lucide-react:

Common icons for various use cases

Consistent styling across agents

Platform Utilities
1. useCopyToClipboard
Purpose: Copy functionality with visual feedback

2. Logger Utility `lo
Purpose: Centralized logging mechanism

Usage:



import { log } from "@/lib/logger"; // import the logger utility at top
log('info', 'This is an info message', { response })
log('error', 'An error occurred:', { err })
Usage:



import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
const { copied, copy } = useCopyToClipboard();
const handleCopy = () => {
  copy(dataToClipboard);
};
2. Form Validation
Recommended: Use react-hook-form with zod validation

Usage:



import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const formSchema = z.object({
  field1: z.string().min(1, "Field 1 is required"),
  field2: z.string().url("Please enter a valid URL")
});
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(formSchema)
});
Quick scaffolding script
Make sure you've the terminal pointed to the platform root directory.



pnpm clone-agent-template [agent-name]
Best Practices
1. Data Transformation
Keep workflow data transformation in InputScreen

Use the transformOutput option in useAgentOutput for result processing

Separate presentation logic from data logic

2. Error Handling
Use default platform error handling for common scenarios

Implement custom error handling only for agent-specific cases

Always provide user-friendly error messages

3. State Management
Let the platform handle common state transitions

Use callbacks for agent-specific state logic

Avoid direct store manipulation unless absolutely necessary

4. UI Consistency
Use the provided UI components for consistency

Follow the existing design patterns

Keep loading states simple and informative

5. Testing
Test each screen independently

Test error scenarios and edge cases

Available Platform APIs
Store Functions
useAppStore - Access global application state

setCurrentAgentState - Change agent state (handled by hooks)

setWorkflowExecutionId - Set execution ID (handled by hooks)

setActiveWorkflowInstance - Set active workflow

Workflow Functions
useTriggerWorkflow - Direct workflow trigger (prefer useAgentWorkflowTrigger)

useWorkflowExecutionState - Execution state polling (prefer useAgentOutput)

useExecutionStatus - Execution status polling

UI Functions
useCopyToClipboard - Copy to clipboard with feedback

Form validation helpers

Loading state management

Common Pitfalls to Avoid
Direct State Management: Don't directly manipulate store state - use the provided hooks

Reinventing Common Logic: Use platform hooks instead of reimplementing common patterns

Tight Coupling: Keep agent-specific logic separate from platform concerns

Inconsistent UI: Use the provided components and follow existing patterns

Missing Error Handling: Always handle loading and error states appropriately

Getting Help
Check existing agents for patterns and examples

Review the platform hooks documentation

Look at the UI component library documentation

Test your agent thoroughly before deployment

Remember: The platform handles the complexity, you focus on the value-add business logic specific to your agent.

 