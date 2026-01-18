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
  color: var(--global-text-color-light);
  margin-bottom: 0.25rem;
}

.paper-venue {
  font-size: 0.85rem;
  color: var(--global-text-color-light);
  font-style: italic;
}

.paper-award {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.paper-links {
  font-size: 0.85rem;
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
                if (paper.paper_link) linksHtml += `<a href="${paper.paper_link}" target="_blank">paper</a>`;
                if (paper.slides_link) linksHtml += `<a href="${paper.slides_link}" target="_blank">slides</a>`;
                if (paper.poster_link) linksHtml += `<a href="${paper.poster_link}" target="_blank">poster</a>`;
                if (paper.presentation_link) linksHtml += `<a href="${paper.presentation_link}" target="_blank">presentation</a>`;

                let awardHtml = paper.award ? `<div class="paper-award">${paper.award}</div>` : '';

                li.innerHTML = `
                    <div class="paper-title"><a href="${paper.paper_link || '#'}" target="_blank">${paper.title}</a></div>
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

<div class="section-header">Other Writing</div>

<a href="https://ryanboldi.github.io/detour-blog-final/" target="_blank" class="bubble-link">The Detour Advantage -- A Blog</a> --- with Ryan Bahlous-Boldi
