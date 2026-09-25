Strive AI:

- this project when clicked open up a story. I want that story to talk on my perspective & contribution to that project rather than the project itself
- today it's like we have done A, B & impact. Ideally it should be like I played this major role, here are my design engineer contributions, critical decisions I took/took along with teammates & failures, lessons learnt from them. 
- it should be more like a presentation rather than a blog (less text, more pointers/numbers)

Then at last there should be a card kind of bigger thumbnail to the blog to read more on technical details on the project

So the context on my contributions are as follows,

- None of our team mates are from AI background. I've not build UI for AI before, so it's learning for all building UI for AI platform
- I kind of made sure the foundations are structured right - primitive components, AI elements, screens/layouts defined. These forms the foundation for our block concept
- I was the only frontend engineer, we had no specific designer at that point. So it was me as a design engineer - understanding the usecases, product/user research, prototyping, gathering feedbacks, iterating & shipping to prod 
- There was a tradeoff between building things ourselves vs using available solutions for certain parts like streaming, AI elements etc. I kind of took the bet to own things ourselves considering chat is gonna be our core & flexibility is gonna be our moat when it comes to interfaces. Felt like we can quickly iterate without any dependencies & at the same time evolve with things that only matter/personalised to our problems rather than bloating with a ready made bundle 

Some design knocks / pointers which shaped our platform UX over time - bets I took as a design engineer

Slot/Canvas experience 

- We do support a rich canvas experience as response in chat. These can accommodate rich surfaces like artifacts, editor, pre-build agent interfaces etc. 
- so initially we were rendering this inline with the chat response. 
- However there were some usability issues which was hurting my taste a lot. 
- Then I re-designed the slots to open as right panel. This was mostly inspired from claude. 
- There was a discussion like it's a claude copy, how is ours gonna be different? But, I kind of stressed it like this is gonna be the standard & claude has defined it first. I felt like if this solves the usability issues we do have then this is the right way to present. 
- Issues we had - our slots can present rich pre-build agent interfaces - say a long table of entries, a complete dashboard app etc. These won't probably fit in the viewport when rendered inline. User has to scroll & can't essentially consume at 1 glance. On the other hand right panel slots stay sticky only the content within the panel scrolls & user is inline with corresponding chat section in parallel. Work against the canvas without any hassle.
- Also the canvas is resizable & has a full screen view for the user to focus on intended artifact 

<--- illustration here ---> Use the attached screenshots as reference & come up with the illustration showing old vs new UI, what was the issue in old

AI elements registry

I kind of have a rich design system & component registry for our platform. We named it as,

@strivelabs/ui-core – implies foundational components.
@strivelabs/ui-blocks - packages the common reusable blocks

As part of these, there are also special components for AI - our AI elements

There was need for certain UI & interactions for our usecases, so I was supposed to come up with new variants for those, few such which I'd pin are

Attaching screenshots
- overflowing tabs
- tabbed charts with pointers - dots, lines, areas, combined markers
- editable list
- stacked suggestions
- AI sections editor

Functional challenges
- there is a parser which sits between backend response blocks & client's renderer. This parser was custom rolled out. I took inspirations from langdiff progressive UI for LLM(https://github.com/globalaiplatform/langdiff) aspects (open source), enhanced it with few of our platform specifics & rolled it out 
- the contracts in itself was a good challenge. Our components are of different nature - interactive, non-interactive, stateful, etc. Powering all these under a consistent contract system was in itself a great challenge. It involved lots of colloboration between client & server modules. We do have a separate package where contracts, prompt registry & zod schemas are maintained which will be consumed by both client & server.


Read the story here [blog link] to understand what other options were considered & why we took the bet