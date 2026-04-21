---
layout: paper
title: Andre Ye
permalink: /
---

<div class="name-row">
  <span class="paper-hero-name">Andre Ye</span>
  <span class="name-email">andreye@mit.edu</span>
</div>

<p>I am an MIT EECS PhD student working on human-AI interaction, advised by <a href="https://mgordon.me/" target="_blank" rel="noopener noreferrer">Mitchell Gordon</a>. I want to build AI that is <button class="rip-btn" data-rip="philosophy">better at <u class="letter-u"><strong>p</strong></u>hilosophy</button>, by which I mean better at aiding thoughtful human judgement about real problems in the world (e.g., in <u class="letter-u">P</u>hilosophy, law, politics, personal life). My work is supported by the NSF GRFP and PD Soros Fellowship.</p>

<div class="rip-panel" id="rip-philosophy">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <p><strong>What am I interested in and what is my research vision?</strong></p>
      <p>I am interested in <u class="letter-u">p</u>hilosophical problems. You could also approximately call them &ldquo;open-ended&rdquo; or &ldquo;semi-structured&rdquo; problems. I take <u class="letter-u">p</u>hilosophical problems to involve systematic inquiry into foundational and/or abstract questions dealing with values and interpretations, that we make progress on with human judgement. These include questions in the discipline of <u class="letter-u">P</u>hilosophy (e.g., are moral statements truth-apt? what is the basis for knowledge?), law (e.g., how should we interpret this case?), politics (e.g., what should my views on this political issue be? what political action should I take?), therapy &amp; personal life (e.g., how should we understand death? should I have children?), and AI Alignment (e.g. how do humans supervise AI that may become vastly more intelligent than us, possibly through other AIs?). Such problems also arise in science (e.g., how might this drug which fixes one issue with a patient create other issues that adversely affect their wellness? how do we make sense of the reproducability crisis in science?) and math (there are an infinite number of true mathematical statements, but which ones are the interesting ones?).</p>
      <p>I think a key feature of <u class="letter-u">p</u>hilosophical problems is that human judgement is needed to make meaningful progress. As a thought experiment, imagine Dario&rsquo;s &ldquo;country of geniuses in a datacenter&rdquo; running for a thousand years to prove (or disprove) a bunch of mathematical conjectures. It is conceivable that they will have made genuine progress at the end of these 1000 years (although they may also prove conjectures that they propose but we don&rsquo;t think are that interesting or useful). Now imagine a &ldquo;country of geniuses in a datacenter&rdquo; running for a thousand years to discover &ldquo;philosophical truths&rdquo;. They come back to us humans and give us the list of truths they have discovered: 1. Humans actually don&rsquo;t have free will, 2. ought implies can, 3. &hellip; I think this seems a little bit ridiculous, not because these AI geniuses may not be right, but because without my human judgement &mdash; my capacity to reflect upon and endorse statements that I take myself to be responsible for &mdash; these 1000 years of &ldquo;multi-agent debate&rdquo; don&rsquo;t mean anything (to me, which is the point). (My language and thinking here is taken heavily from the philosophers Robert Brandom and Wilfred Sellars.)</p>
      <p>Okay, so human judgement is essential to making progress on these open-ended questions. So let&rsquo;s throw AI out of the window because it, in principle, lacks the capacity for this kind of judgement. No: judgement has a strong relationship with what philosopher Brian Cantwell Smith calls &ldquo;reckoning&rdquo; &mdash; a calculating prowess for uncovering patterns and reasoning out. Good judgement emerges from reflecting on the fruits of reckoning, or even doing reckoning ourselves. Great friends don&rsquo;t tell us what to think, but rather help us see other ways of reckoning that we had not reckoned with before, and which we may judge to be ways of reckoning that we want to endorse. Now ideally everyone would have access to these kinds of friends, but we don&rsquo;t, and even if we do, wouldn&rsquo;t we want more?</p>
      <p>To realize this vision, I think we need to give AI more conceptual structure. That is, we need to allow people and AI to collaborate on &ldquo;shapes of thinking&rdquo; &mdash; structures or scaffolds to set the terms and goals of inquiry into an open-ended question &mdash; and, with the iteratively developed endorsement of human judgement, realize what kinds of ideas those shapes of thinking will lead to. As AI models get better and better, they will better be able to realize the shapes of thinking that we judge to be worth pursuing.</p>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<p>I recently proposed the <button class="rip-btn" data-rip="conceptual-multiverse">&ldquo;conceptual multiverse&rdquo;</button> as a better kind of AI output for open-ended questions like in philosophy or AI alignment, in which models represent, evaluate, and improve on how different conceptual decisions condition outputs.</p>

<p>I&rsquo;ve also thought about <button class="rip-btn" data-rip="help-philosophers">how language models can help Philosophers</button> and how the &ldquo;woke Gemini controversy&rdquo; could instruct us in <button class="rip-btn" data-rip="creative-practices">more critical creative practices</button>.</p>

<p>See my <button class="rip-btn" data-rip="full-work">full list of publications</button> and a <a href="/assets/pdf/ye-cv.pdf" target="_blank" rel="noopener noreferrer">pdf CV</a>.</p>

<div class="rip-panel" id="rip-conceptual-multiverse">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <div class="rip-paper-links"><a href="https://multiverse.csail.mit.edu" target="_blank" rel="noopener noreferrer">project website</a> &nbsp;·&nbsp; <a href="https://arxiv.org/abs/2604.17815" target="_blank" rel="noopener noreferrer">arXiv</a></div>
      <p>Many of the open-ended questions we bring to AI involve a cascade of decisions that spills into a landscape of possibilities &mdash; how to frame the question, what to value, what assumptions to make &mdash; but we typically receive a single result, presented as if it were the only one. We have no way to know how much hinges on decisions we never saw. In data analysis, &ldquo;multiverse analysis&rdquo; addresses this by systematically varying these choices and reporting how the result changes. We ask: what would multiverse analysis look like for the kinds of value-laden, open-ended problems people are bringing to AI?</p>
      <p>We introduce the <em>conceptual multiverse</em>: an interactive system that surfaces the conceptual decisions an AI&rsquo;s answer depends on, and the alternatives each decision opens up. Instead of taking a single answer on faith, a person can navigate a tree of branch points &mdash; transparently inspecting, intervenably changing, and checking each step against the reasoning norms of the domain. We develop a verification framework that enforces properties of good decision structures (like unambiguity and completeness) calibrated by expert-level reasoning, and we represent the multiverse concretely as a Python program that agents can build, verify, and regenerate.</p>
      <p>We calibrated and built the system in three domains &mdash; philosophy (an open-ended question), AI alignment (a sensitive user request), and poetry (a generation prompt) &mdash; and ran in-depth studies with 15 participants. Across all three, the conceptual multiverse helped participants develop a working map of the problem, surfacing thinking that uncontextualized answers would have left buried: philosophy students rewrote essays with sharper framings and reversed theses; alignment annotators moved from surface preferences to reasoning about user intent and harm; poets identified compositional patterns that clarified their taste.</p>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<div class="rip-panel" id="rip-help-philosophers">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <div class="rip-paper-item">
        <div class="rip-paper-title"><a href="https://arxiv.org/abs/2404.04516" target="_blank" rel="noopener noreferrer">Language Models as Critical Thinking Tools: A Case Study of Philosophers</a></div>
        <div class="rip-paper-authors"><strong>Andre Ye</strong>, Jared Moore, Rose Novick, Amy X. Zhang</div>
        <div class="rip-paper-venue">Conference on Language Modeling (COLM), 2024</div>
        <p style="margin-top:0.7rem;font-size:0.9rem;">Current work in language models (LMs) helps us speed up or even skip thinking by accelerating and automating cognitive work. But can LMs help us with critical thinking &mdash; thinking in deeper, more reflective ways which challenge assumptions, clarify ideas, and engineer new concepts? We treat philosophy as a case study in critical thinking, and interview 21 professional philosophers about how they engage in critical thinking and on their experiences with LMs. We find that philosophers do not find LMs to be useful because they lack a sense of selfhood (memory, beliefs, consistency) and initiative (curiosity, proactivity). We propose the selfhood-initiative model for critical thinking tools to characterize this gap. Using the model, we formulate three roles LMs could play as critical thinking tools: the Interlocutor, the Monitor, and the Respondent. We hope that our work inspires LM researchers to further develop LMs as critical thinking tools and philosophers and other &lsquo;critical thinkers&rsquo; to imagine intellectually substantive uses of LMs.</p>
        <div class="rip-paper-links"><a href="https://arxiv.org/abs/2404.04516" target="_blank" rel="noopener noreferrer">paper</a></div>
      </div>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<div class="rip-panel" id="rip-creative-practices">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <div class="rip-paper-item">
        <div class="rip-paper-title"><a href="https://arxiv.org/abs/2502.15242" target="_blank" rel="noopener noreferrer">Agonistic Image Generation: Unsettling the Hegemony of Intention</a></div>
        <div class="rip-paper-authors">Andrew Shaw*, <strong>Andre Ye*</strong>, Ranjay Krishna, Amy X. Zhang</div>
        <div class="rip-paper-venue">FAccT 2025 &nbsp;·&nbsp; <span style="color:#7a3518">🏆 UW CSE Best Senior Thesis</span></div>
        <p style="margin-top:0.7rem;font-size:0.9rem;">Current image generation paradigms prioritize actualizing user intention &mdash; &ldquo;see what you intend&rdquo; &mdash; but often neglect the sociopolitical dimensions of this process. However, it is increasingly evident that image generation is political, contributing to broader social struggles over visual meaning. This sociopolitical aspect was highlighted by the March 2024 Gemini controversy, where Gemini faced criticism for inappropriately injecting demographic diversity into user prompts. Although the developers sought to redress image generation&rsquo;s sociopolitical dimension by introducing diversity &ldquo;corrections,&rdquo; their opaque imposition of a standard for &ldquo;diversity&rdquo; ultimately proved counterproductive. In this paper, we present an alternative approach: an image generation interface designed to embrace open negotiation along the sociopolitical dimensions of image creation. Grounded in the principles of agonistic pluralism (from the Greek <em>agon</em>, meaning struggle), our interface actively engages users with competing visual interpretations of their prompts. Through a lab study with 29 participants, we evaluate our agonistic interface on its ability to facilitate reflection &mdash; engagement with other perspectives and challenging dominant assumptions &mdash; a core principle that underpins agonistic contestation. We compare it to three existing paradigms: a standard interface, a Gemini-style interface that produces &ldquo;diverse&rdquo; images, and an intention-centric interface suggesting prompt refinements. Our findings demonstrate that the agonistic interface enhances reflection across multiple measures, but also that reflection depends on users perceiving the interface as both appropriate and empowering; introducing diversity without grounding it in relevant political contexts was perceived as inauthentic. Our results suggest that diversity and user intention should not be treated as opposing values to be balanced.</p>
        <div class="rip-paper-links"><a href="https://arxiv.org/abs/2502.15242" target="_blank" rel="noopener noreferrer">paper</a></div>
      </div>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<div class="rip-panel" id="rip-full-work" data-rip-load="full-work">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <p class="loading-text" id="rip-cs-loading">Loading papers&hellip;</p>
      <div class="subsection-header">Computer Science</div>
      <ul class="paper-list" id="rip-cs-papers"></ul>
      <div class="subsection-header" style="margin-top:1.4rem;">Philosophy</div>
      <ul class="paper-list" id="rip-phil-papers"></ul>
      <p class="loading-text" id="rip-phil-loading" style="display:none">Loading papers&hellip;</p>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<p>I completed my BS in Computer Science, advised by <a href="https://homes.cs.washington.edu/~axz/" target="_blank" rel="noopener noreferrer">Amy Zhang</a> and <a href="https://ranjaykrishna.com/" target="_blank" rel="noopener noreferrer">Ranjay Krishna</a>, and my BA in Philosophy with Honors, advised by <a href="https://www.rosenovick.com/" target="_blank" rel="noopener noreferrer">Rose Novick</a>, at the University of Washington. I also minored in math and history. For my work, I was recognized as an Allen School Outstanding Senior, Philosophy Department Outstanding Graduating Senior, Dean&rsquo;s Medalist for the Social Sciences, and served as a banner carrier for the College of Arts and Sciences at the 150th UW Commencement, and <button class="rip-btn" data-rip="and-others">other recognition</button>. I was also covered by the <a href="https://www.washington.edu/uaa/undergrad-researcher-questions-the-ai-answer/" target="_blank" rel="noopener noreferrer">UW Office of Undergraduate Academic Affairs</a>.</p>

<p>I got up to other stuff in undergrad <button class="rip-btn" data-rip="too">too</button>. I greatly appreciate the interdisciplinary environment I was allowed to play in at UW.</p>

<p>I maintain a list of <button class="rip-btn" data-rip="quotes" data-rip-load="quotes">quotes</button> that stick with me in my readings. One of my favorites is this one by Deleuze: <em>&ldquo;A concept is a brick. It can be used to build a courthouse of reason. Or it can be thrown through the window.&rdquo;</em></p>

<p>I also maintain a list of <button class="rip-btn" data-rip="articles" data-rip-load="articles">articles</button> that I think are especially interesting, thought-provoking, or good reading.</p>

<p>Entirely for my intellectual edification, I like to learn enough math to understand what some <button class="rip-btn" data-rip="math">interesting mathematical theorems</button> say but not enough to know their proofs (it ruins the magic!).</p>

<p>I also maintain a <button class="rip-btn" data-rip="history">timeline</button> to unify various historical events I have an interest in. It does the service of helping us realize how complex the world is, that so much barbarity, genius, strife, and goodness happen at the same time.</p>

<p>In an effort to become a more interesting person, I am learning woodworking at the <a href="" target="_blank" rel="noopener noreferrer">MIT Hobby Shop</a> and guitar; enjoy playing piano, lifting, using my AMC Stubs membership with <a href="https://barish.me/" target="_blank" rel="noopener noreferrer">Barish Namazov</a>, and running along the Charles with <a href="https://ryanboldi.github.io/" target="_blank" rel="noopener noreferrer">Ryan Bahlous-Boldi</a>; and am currently reading <em>East of Eden</em> with <a href="https://schare.space/" target="_blank" rel="noopener noreferrer">Carmel Schare</a>, <em>A Spirit of Trust</em> with <a href="" target="_blank" rel="noopener noreferrer">Mark Pock</a>, <em>The Design of Everyday Things</em> with <a href="https://www.linkedin.com/in/kpanchap/" target="_blank" rel="noopener noreferrer">Krishna Panchapagesan</a>, and <em>Empire of AI</em> with <a href="https://www.linkedin.com/in/vivek-prakriya/" target="_blank" rel="noopener noreferrer">Vivek Prakriya</a>. Я тоже учу русский. My <a href="https://www.instagram.com/reel/DUoAaOwAJl2/" target="_blank" rel="noopener noreferrer">day in the life</a> was featured by MIT CSAIL.</p>

<p>See also my <a href="phd-sop.pdf" target="_blank" rel="noopener noreferrer">PhD SOP</a>, my writing on what it means to <a href="https://gardenofideasuw.com/wp-content/uploads/2025/06/Autumn24-Volume-4-Issue-1.pdf" target="_blank" rel="noopener noreferrer">study philosophy</a> (p. 6), a <a href="/writing/files/south_of_eden.pdf" target="_blank" rel="noopener noreferrer">very short story</a>, my first published <a href="/writing/files/00144940.2022.pdf" target="_blank" rel="noopener noreferrer">research article</a> in literary analysis, my work on <a href="https://www.sigbovik.org/2023/proceedings.pdf" target="_blank" rel="noopener noreferrer">AyahuascaNet</a> (p. 27) which went <a href="https://x.com/deepfates/status/1752052061863387374" target="_blank" rel="noopener noreferrer">viral</a>, and how an (admittedly sloppy) blogpost I wrote when I was 14 led to an <a href="https://gowrishankar.info/blog/deep-learning-is-not-as-impressive-as-you-think-its-mere-interpolation/" target="_blank" rel="noopener noreferrer">ML Twitter controversy</a> involving Stephen Pinker, Yann Lecun, Francois Chollet, and others.</p>

<div class="rip-panel" id="rip-and-others">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-year">2025</div>
          <div class="timeline-content">
            <a href="https://www.washington.edu/uaa/2025/04/09/uw-undergraduate-earns-fellowship-for-graduate-study/" target="_blank" rel="noopener noreferrer">Fellow, Paul and Daisy Soros Fellowship for New Americans</a><br>
            Awardee, NSF Graduate Research Fellowship Program<br>
            Fellow, Ashar Aziz Presidential Fellowship (MIT)<br>
            Finalist, Hertz Foundation Fellowship<br>
            <a href="https://artsci.washington.edu/news/2025-06/2025-deans-medalists-energized-inspiring" target="_blank" rel="noopener noreferrer">UW College of Arts and Sciences Dean&rsquo;s Medal (Social Sciences)</a><br>
            Gonfalonier (Banner Carrier), College of Arts and Sciences, 150th UW Commencement<br>
            UW CSE Outstanding Senior<br>
            UW CSE Best Senior Thesis Award (submitted by co-author <a href="https://www.linkedin.com/in/andrew-b-shaw/" target="_blank" rel="noopener noreferrer">Andrew Shaw</a>)<br>
            UW Philosophy Department Outstanding Graduating Senior
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-year">2024</div>
          <div class="timeline-content">UW Philosophy Department Outstanding Undergraduate Scholar</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-year">2023</div>
          <div class="timeline-content">
            <a href="https://news.cs.washington.edu/2024/06/28/for-these-nationally-recognized-allen-school-undergraduates-research-impact-is-its-own-reward/" target="_blank" rel="noopener noreferrer">CRA Outstanding Undergraduate Researcher Finalist</a><br>
            Mary Gates Research Scholar<br>
            Phi Beta Kappa Scholar
          </div>
        </div>
      </div>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<div class="rip-panel" id="rip-too">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <p>I was also mentored by <a href="https://jaredmoore.org/" target="_blank" rel="noopener noreferrer">Jared Moore</a>, <a href="https://cqz.name/" target="_blank" rel="noopener noreferrer">Quan Ze (Jim) Chen</a>, <a href="https://sebastinsanty.com/" target="_blank" rel="noopener noreferrer">Sebastin Santy</a>, <a href="https://mattwallingford.github.io/" target="_blank" rel="noopener noreferrer">Matt Wallingford</a>, <a href="https://phil.washington.edu/people/carina-fourie" target="_blank" rel="noopener noreferrer">Carina Fourie</a>, and others.</p>
      <p>I wrote two books on deep learning for Apress/Springer Nature: <a href="https://link.springer.com/book/10.1007/978-1-4842-7413-2" target="_blank" rel="noopener noreferrer"><em>Modern Deep Learning Design and Applications</em></a> (solo) and <a href="https://link.springer.com/book/10.1007/978-1-4842-8692-0" target="_blank" rel="noopener noreferrer"><em>Modern Deep Learning for Tabular Data</em></a> (with Andy Wang).</p>
      <p>I was a TA for 7 quarters across intro Python programming (CSE 160), intermediate Python (CSE 163), and discrete math for CS (CSE 311). I also TA&rsquo;d English Composition and Literary Analysis at the <a href="https://robinsoncenter.uw.edu/" target="_blank" rel="noopener noreferrer">Robinson Center</a>, and Introduction to Machine Learning at <a href="https://the-cs.org/" target="_blank" rel="noopener noreferrer">The Coding School</a>.</p>
      <p>I entered university at 14 through the <a href="https://robinsoncenter.uw.edu/" target="_blank" rel="noopener noreferrer">Robinson Center Early Entrance Program</a>. My worldview was especially transformed during Transition School by <a href="https://www.linkedin.com/in/amanda-zink-346331164/" target="_blank" rel="noopener noreferrer">Amanda Zink</a> teaching English and <a href="https://smlr.rutgers.edu/about-smlr/faculty-and-staff-directory/michael-beyea-reagan" target="_blank" rel="noopener noreferrer">Michael Reagan</a> teaching History.</p>
      <p>One of my close friends who also went through the Early Entrance Program with me is <a href="https://www.linkedin.com/in/vivek-prakriya/" target="_blank" rel="noopener noreferrer">Vivek Prakriya</a>, who is the youngest city councilmember to win a contested race in a city with over 75k people (Redmond, Washington). In Summer 2025 I managed social media for his campaign &mdash; running content for his run for Redmond City Council seat no. 2.</p>
      <p>I have reviewed for CSCW, the NeurIPS Moral Psychology &amp; Moral Philosophy Workshop, and the ICML AI + HCI Workshop, and have served as a research panelist and student host at events for the Allen School and the Robinson Center.</p>
      <p>I spent summer of 2022 at Deepgram working on speech transcription models, advised by <a href="https://deepgram.com/authors/andrew-seagraves" target="_blank" rel="noopener noreferrer">Andrew Seagraves</a>.</p>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<div class="rip-panel" id="rip-quotes" data-rip-load="quotes">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <p style="font-size:0.88rem;color:#7a5a30;font-style:italic;margin-bottom:1.2rem;">An unorganized and growing archive of quotes, ideas, and works that influence or represent my thought. Order is randomized.</p>
      <div class="quotes-list" id="rip-quotes-list">
        <div class="loading-text">Loading quotes&hellip;</div>
      </div>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<div class="rip-panel" id="rip-articles" data-rip-load="articles">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <p style="font-size:0.88rem;color:#7a5a30;font-style:italic;margin-bottom:1.2rem;">Academic papers and articles that influence my research and thinking. By the way, clicking on one of the squares in the background takes you to a random article.</p>
      <div id="rip-articles-list">
        <div class="loading-text">Loading articles&hellip;</div>
      </div>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<div class="rip-panel" id="rip-math" data-rip-load="math">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <div id="rip-math-list"><div class="loading-text">Loading&hellip;</div></div>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>


<div class="rip-panel" id="rip-history" data-rip-load="history">
  <div class="rip-panel-inner">
    <div class="rip-edge rip-edge-top"></div>
    <div class="rip-panel-content">
      <div id="rip-history-list"><div class="loading-text">Loading history&hellip;</div></div>
    </div>
    <div class="rip-edge rip-edge-bottom"></div>
  </div>
</div>

<p style="font-style:italic;color:#5a3a18;text-align:center;margin-top:3rem;line-height:1.7;">&ldquo;To everything there is a season, and a time to every purpose under Heaven; a time to be born and a time to die; a time to kill and a time to heal; a time to weep and a time to laugh; a time to love and a time to hate; a time for war and a time of peace.&rdquo;<br><span style="font-style:normal;font-size:0.85rem;color:#7a5a30;">Ecclesiastes 3:1&ndash;8</span></p>

<figure id="better-ai-of-the-day" style="margin:3.5rem auto 1rem;text-align:center;max-width:560px;">
  <img id="better-ai-of-the-day-img" alt="Better Image of AI" style="display:block;width:100%;height:auto;border-radius:3px;box-shadow:0 4px 18px rgba(30,10,2,0.18);">
  <figcaption style="font-size:0.8rem;color:#7a5a30;font-style:italic;margin-top:0.7rem;line-height:1.55;text-align:center;">Taken from the <a href="https://betterimagesofai.org/" target="_blank" rel="noopener noreferrer">Better Images of AI</a> project, an excellent attempt to reimagine how AI can visually appear without falling into tropes of anthropomorphism, unembodied rationality, and immateriality.</figcaption>
</figure>

<p style="font-size:0.8rem;color:#7a5a30;font-style:italic;margin:1.2rem auto 0;max-width:560px;text-align:center;line-height:1.55;">In making this website, the brushstroke-like highlighting was inspired by <a href="https://ryanyen2.github.io/" target="_blank" rel="noopener noreferrer">Ryan Yen</a>'s website.<span class="mobile-only-note"> (By the way... this website looks cooler on desktop!)</span></p>

<style>
  .mobile-only-note { display: none; }
  @media (max-width: 740px) {
    .mobile-only-note { display: inline; }
  }
</style>
