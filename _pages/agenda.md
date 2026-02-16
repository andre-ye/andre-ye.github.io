---
layout: page
title: agenda
permalink: /work/agenda/
description:
nav: false
parent: work
nav_order: 1
---

Some of the ideas I have been mulling on.
Please see <a href="https://andre-ye.org/assets/pdf/phd-sop.pdf" target="_blank" rel="noopener noreferrer" class="bubble-link">PhD SOP</a> for one aspect of my interests, and <a href="https://andre-ye.org/things-i-like/articles/" target="_blank" rel="noopener noreferrer" class="bubble-link">great articles I've been reading</a>.

---

### Rewards and Judgments on Qualitative AI Work

As AI ventures into domains like creative writing, journalism, and philosophy, I am struck by the sense that although we cannot entirely formalize the correctness of a piece of AI work, we still can judge AI work as "better" or "worse" (of course, possibly with [more complex descriptors](https://www.nytimes.com/2025/12/03/magazine/chatbot-writing-style.html){:target="_blank" rel="noopener noreferrer"}). In fact, much of the work of literary critics, philosophers, and essayists in general is to reflexively critique and develop an understanding of the normative form of the essay in their domain, to gesture at these senses of better and worse. What does this look like for AI? What is the role that humans will play in co-producing AI that writes *really well*?

---

### Qualitative Knowledge Certification

One of the most powerful uses of LLMs is to apply existing and produce new qualitative knowledge --- they are able to operate in the world of senses, vibes, liminal words. But why should we trust what knowledge these models produce? No, trust isn't the right word --- more like, what are the kinds of reasons we would want to believe in the knowledge these models produce, and what are the methods for structuring model outputs with those reasons? We can draw from the methodology of the social sciences and the humanities: what are the reasons why we would believe (or trust, or be intrigued by, or entertain, ...) what a historian, philosopher, literary theorist, etc. has to say? How can we 'certify' qualitative knowledge application and production, one of the most distinctive features of LLMs as a social technology?

---

### Machine Concept Definition and Neologism Learning

The computational abstractions which have been useful for the field of interpretability may be useful abstractions for defining concepts. Therefore, in an "interpretability as interaction" paradigm, concept definition does not only have to look like explaining something to someone, "thinking in your own head", or writing an essay, but also in *discovering the right language model internals* that capture a concept (e.g. vectors, sparse autoencoder features).

Can we represent the concepts we yearn to capture by finding the right set of sparse autoencoder features, or latent vectors, or whatever other relevant internal language model construct? What interaction tools would we need to capture our mushy and complex thoughts into these mushy and complex computational constructs?

Is there a future where I text my friend not words, nor emojis, but some cluster of sparse autoencoder features because it more dynamically captures what I mean? Maybe one where these features become neologisms in a new iteration of human language?

Is there a future where we write "constitutions" for AI not in terms of human language, but by identifying internal LM representations and mechanisms that we can control and clamp on?

Machine concept definition is about finding the right kinds of constructs and tools for better human-machine communication.

Related/inspiring work: [We Can't Understand AI Using our Existing Vocabulary](https://openreview.net/pdf?id=asQJx56NqB){:target="_blank" rel="noopener noreferrer"} (Hewitt, Geirhos, Kim 2025); [Backpack Language Models](https://arxiv.org/abs/2305.16765){:target="_blank" rel="noopener noreferrer"} (Hewitt, Thickstun, Manning, Liang 2023).

---

### Socratic Topologies

Thinking through a concept is like mapping out space --- figuring out how different areas of land, levels of elevation, features of the landscape, borders, etc. position and act in relation to each other. Humans have expressed these maps in free-form writing for centuries. Now that AI is here and ready to help, we give these maps to them in free-form writing. And to say the least, they are subpar. From an interaction standpoint, it's hard for AI to intervene in a transparent and multiscalar way. From a content standpoint, AI can be sycophantic or "miss the point".

Maybe what we need is not "better AI assistants" per se (whatever that means) but a map format which is better conducive towards concept AI tools. Imagine a basic format: every concept map consists of nodes, which have text associated with them, and directed edges, which are predefined conceptual relations (e.g., "A supports B", "A contradicts B", "unlike A, B", "A is similar to B", "A is a metaphor for B") mined from conceptual literature (history, philosophy, etc.). Below the surface, each node corresponds to a vector embedding, and as the user builds out the graph, we can get the user's sense of contradiction, support, metaphor, etc. in terms of vector differentials. We can then use these to suggest possible connections between nodes, suggest possible tensions (e.g. different senses of relations), transitive contradictions, areas to add to the network that would maximize variance, etc.

One can also imagine that many of the natural language operations studied in NLP like "summarization" which are inherently conditioned on user goals could be made much more transparent (e.g., summarization on this graph could be a principled method of edge contraction in a way specified by the user).

---

### An Ontology for Everyone

LLMs are increasingly good at annotating data according to even highly custom and complex ontologies -- schemas for taxonomizing things, their relations, their attributes, etc. Previously the people who hosted the data we cared about had control over the ontology by which we encountered it. Some ontology-building is highly interesting, e.g. [LegalDiscourse](https://aclanthology.org/2024.naacl-long.472.pdf){:target="_blank" rel="noopener noreferrer"} (Niklaus, Rüegger, Ash 2024), which builds a domain-specific taxonomy for annotating legal texts and then uses it to help journalists. But maybe we can do better. Maybe one role for a human is in figuring out what kind of ontology is useful for them to learn the things they want to learn, and to both iterate upon and implement this ontology with LLMs.

---

### Parallel Human-AI Interactions

What if your AI interrupted you? What interactions with AI were not just turn-by-turn conversations but had multiple simultaneous tracks of conversation, just like with humans (implicit cues, subtext, body language, environment information, etc.)?
