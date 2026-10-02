- It started in Jun, 2025
- we as a team where building agent prototypes for different usecases from our early clients & friends. 
- we already had a solid backend platform to orchestrate any workflows quick. Almost anything you can do at n8n, can be done in our platform as well
- so the idea is to rapidly build UI for any such workflow requests & demo to customers to validate on the ideas & find the product market fit
- it started with our CTOs tips to come up with one standard way of orchestrating UI for agents. Backend was build in such a robust way - agent builders can simply plug & play any components & have a DAG workflow ready quick. Same has to be done for UI was the challenge. 

Pluggable UI for agents:
- so it started like, any agent we have would have some common blocks like a config page, a page to install, a page to review & look for status, like that

- at that point, we envisioned like - this will become the DX externally as well. We might have a developer portal & anyone can build agents in our platform the same way we're building. Only the interfaces for that has to be exposed. To solidify that, we ourselves need to build more agents, improve the DX over time & then once stable can be shared externally as well

- But we didn't aim to enter into the building space as it was already super crowded at that point, we won't have a valid differentiator that could position us different from other agent builders out there - say n8n, lyndy, make, relevance AI, etc. 

- it's not that we didn't have necessary blocks. we had everything - we know that we can always power something like that if there comes a demand later, we have done that previously at Freshworks in massive scale. On the other hand we wanted to outshine the crowded agent space with highly effective, reliable agents which does the job with no slope. 

Thus, the focus was to facilitate internally the DX to build agent UI rapidly. 

Screens concept:

- you get the standard layouts, hooks & interfaces ready from a scaffold.
- builders just need to know how to invoke the backend interfaces & wire the data to the screens.
- they no need to create any new components, learn about UI concepts like padding, colors etc. No need to know anything like react router, how state management in zustand works at all. 

Route way:
- very soon the UI became too restricted.
- we started evaluating completely different trajectory of agents
- for eg: we build couple of content agents which would fit into a template. But we had some sales agent which doesn't require such a complex layout specifics/components.
- thus we were forced to orchestrate multiple ways of wiring UI. 
- so I kind of relaxed it to path based routing 
- by this time agentic coding also became far more accessible & better. Our team also internally started using agents heavily to write frontend code. They were comfortable building rough prototypes just with the primitives like design system & standard react guidelines. So at this point it was just matter of adding skills for coding agents 

Chat agent:
- from there, we realised these agents can't work in silos.
- agentic world & usecase were also moving towards a different trajectory
- now agents need to work together, tasks were not siloed. 
- so chat was emerging as natural way of accessing agentic capabilities
- we also sensed this & imediately started adapting gen UI mechanism. [link strive AI story here]
- nothing was thrown away, we still know certain complex dedicated tasks exists & demands much wider experience (say content refresh/draft writing for an example)
- this is how we landed on agent slots

From there we moved towards letting agent write it's own code. And that's were we're heading to - we aim to have users build their own apps not just reports within our platform (custom apps) to solve their challenges, automate work. Have agents working together as team  - The multiplayer agentic Marketing OS.

We're already in the final stage already & excited for what's ahead. 