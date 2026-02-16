---
layout: page
title: computer science papers
permalink: /work/cs/
nav: false
parent: work
nav_order: 2
---

<style>
.paper-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.paper-list li {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--global-divider-color);
}

.paper-list li:last-child {
  border-bottom: none;
}

.paper-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.paper-title a {
  color: var(--global-text-color);
  text-decoration: none;
}

.paper-title a:hover {
  color: var(--global-theme-color);
}

.paper-authors {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.paper-venue {
  font-size: 0.9rem;
  font-style: italic;
}

.paper-award {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.paper-links {
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.paper-links a {
  margin-right: 0.75rem;
  color: var(--global-theme-color);
}

.section-header {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid var(--global-theme-color);
  padding-bottom: 0.25rem;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    fetch('/assets/json/cs_papers.json')
        .then(response => response.json())
        .then(papers => {
            const container = document.getElementById('cs-papers-list');
            papers.forEach(paper => {
                const li = document.createElement('li');

                let authorText = paper.authors.map(author =>
                    author.includes('Andre Ye') ? `<strong>${author}</strong>` : author
                ).join(', ');

                let linksHtml = '';
                if (paper.paper_link) linksHtml += `<a href="${paper.paper_link}" target="_blank" rel="noopener noreferrer">paper</a>`;
                if (paper.slides_link) linksHtml += `<a href="${paper.slides_link}" target="_blank" rel="noopener noreferrer">slides</a>`;
                if (paper.poster_link) linksHtml += `<a href="${paper.poster_link}" target="_blank" rel="noopener noreferrer">poster</a>`;
                if (paper.presentation_link) linksHtml += `<a href="${paper.presentation_link}" target="_blank" rel="noopener noreferrer">presentation</a>`;

                let awardHtml = paper.award ? `<div class="paper-award">${paper.award}</div>` : '';

                li.innerHTML = `
                    <div class="paper-title"><a href="${paper.paper_link || '#'}" target="_blank" rel="noopener noreferrer">${paper.title}</a></div>
                    <div class="paper-authors">${authorText}</div>
                    <div class="paper-venue">${paper.conference_full} (${paper.conference_abbrev}) ${paper.conference_year}</div>
                    ${awardHtml}
                    <div class="paper-links">${linksHtml}</div>
                `;

                container.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading CS papers:', error));
});
</script>

<ul class="paper-list" id="cs-papers-list"></ul>

<div class="section-header">Other Writing & Projects</div>

<ul class="paper-list">
<li>
<div class="paper-title"><a href="https://ryanboldi.github.io/detour-blog-final/" target="_blank" rel="noopener noreferrer">The Detour Advantage</a></div>
<div class="paper-authors"><strong>Andre Ye</strong>, Ryan Bahlous-Boldi</div>
<div class="paper-venue">Blog</div>
<div class="paper-links"><a href="https://ryanboldi.github.io/detour-blog-final/" target="_blank" rel="noopener noreferrer">blog</a></div>
</li>

<li>
<div class="paper-title"><a href="/assets/pdf/SIGBOVIK_2023.pdf" target="_blank" rel="noopener noreferrer">AyahuascaNet: Rigorously Investigating Hallucination in Large Language Models with Hardcore Psychedelic Drugs</a></div>
<div class="paper-venue">SIGBOVIK 2023</div>
<div class="paper-links"><a href="/assets/pdf/SIGBOVIK_2023.pdf" target="_blank" rel="noopener noreferrer">paper</a><a href="/assets/pdf/AyahuascaNet.pdf" target="_blank" rel="noopener noreferrer">talk slides</a><a href="https://x.com/deepfates/status/1752052061863387374" target="_blank" rel="noopener noreferrer">viral tweet</a></div>
</li>

<li>
<div class="paper-title"><a href="/assets/pdf/Epoch_SIGBOVIK_2024.pdf" target="_blank" rel="noopener noreferrer">How does the AI community pronounce 'epoch'? A semirigorous sociolinguistic survey</a></div>
<div class="paper-venue">SIGBOVIK 2024</div>
<div class="paper-links"><a href="/assets/pdf/Epoch_SIGBOVIK_2024.pdf" target="_blank" rel="noopener noreferrer">paper</a></div>
</li>

<li>
<div class="paper-title"><a href="/assets/pdf/Table_SIGBOVIK_2024.pdf" target="_blank" rel="noopener noreferrer">ITF;)LM: Innocuous Table Formatting ;) with Language Models</a></div>
<div class="paper-venue">SIGBOVIK 2024</div>
<div class="paper-links"><a href="/assets/pdf/Table_SIGBOVIK_2024.pdf" target="_blank" rel="noopener noreferrer">paper</a></div>
</li>

<li>
<div class="paper-title"><a href="https://andre-ye.github.io/mobiod-streams/" target="_blank" rel="noopener noreferrer">Mobiod Streams</a></div>
<div class="paper-venue">Digital Art</div>
<div class="paper-links"><a href="https://andre-ye.github.io/mobiod-streams/" target="_blank" rel="noopener noreferrer">interactive art</a></div>
</li>

<li>
<div class="paper-title"><a href="/assets/pdf/podocyte_seg.pdf" target="_blank" rel="noopener noreferrer">A Novel Approach to Segment Specialized Annotations in Electron Microscopy Images of Glomerular Podocytes</a></div>
<div class="paper-authors">David Smerkous, <strong>Andre Ye</strong>, Behzad Najafian</div>
<div class="paper-venue">Najafian Lab for Kidney Pathology, UW Medicine</div>
<div class="paper-links"><a href="/assets/pdf/podocyte_seg.pdf" target="_blank" rel="noopener noreferrer">poster</a></div>
</li>

<li>
<div class="paper-title"><a href="/assets/pdf/emergent_language.pdf" target="_blank" rel="noopener noreferrer">Emergent Language: Independent AI Development of a Language-Like Syntax</a></div>
<div class="paper-authors">Alec Bunn, Amelia Johnson, <strong>Andre Ye</strong>, Yegor Kuznetzov, Eric Xia</div>
<div class="paper-venue">Interactive Intelligence Research Group, Paul G. Allen School</div>
<div class="paper-links"><a href="/assets/pdf/emergent_language.pdf" target="_blank" rel="noopener noreferrer">poster</a></div>
</li>
</ul>
