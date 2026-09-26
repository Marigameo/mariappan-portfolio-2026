Strive Studio:

- Strive studio/report builder is our reporting system in strive with which one can spin up a live dashboard/report by connecting their marketing sources. 
- It's more like a lovable for marketing harness or claude artifacts that are live & personalised

How it started?

- We already had a rich gen UI chat engine & AI centered component registry. Check out Strive AI project for more details.

- Owning the component registry, having control over the design specs is one leverage. But has a maintenance overhead. UI is not limited, as model gets better -> it can generate better UI itself. 

- I still remember my CTOs words on this - we should simply let models spin up with things that are already super popular in internet & have enough context on. HTML is something agents are already super proficient on, can't make mistakes. Probably we should let agents spin up HTML reports, why not?

- So it's not like controlled output vs agent wiring up own UI. It's controlled outputs & agent spinning up UI for everything else & wherever it fits nicely. 

- Reports are one such a wonderful case where JSON schemas would not be a great fit. It involves lots of data points & schemas can get super complex very soon. On the other hand, dashboard UIs are not new. Models are already trained on millions of such dashboard UI contexts, it can easily spin up a very good 1st UI. 

How is it different from artifacts in claude?

- we're actually super early to artifacts & little more advanced as we didn't aim for static artifacts only
- The very 1st version of reports we rolled out iself was HTML documents which runs live data queries against customer data sources 
- You can create, edit & share as claude artifacts. With a bonus of data is always upto date. You vibe code your personalized marketing reports & dashboards. 

Good first version:

- Initially we spinned up a dedicted chat for teh report builder. The idea is not to bloat the main chat system prompt with the report guidelines & context
- Experiment undisturbed, built it as a pluggable version that once stable can be plugged to the core chat system

Limitation we were happy to live with for a short time:

- As this was a separate chat, the history remained separate.

Unifying with core chat system

- we already knew this is supposed to be a chat skill rather than a standalone entity atleast on the interface end.

- Report builder skill with context on how to wire up the report, what design context to use, how data parts can be wired up. Chat uses the skill to spin up the report builder when it matches the intend of report building

----

What else can be added?

- How the iframe communication happens securely via iframes in report builder
- how frontend wires up the builder with design context, other scripts 
- security aspects & experience aspects, error handling aspects taken into considerations