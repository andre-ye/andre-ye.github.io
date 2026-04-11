---
layout: latex_embed
title: philosophy writings
doc_title: Philosophy
permalink: /work/philosophy/
nav: false
parent: work
nav_order: 3
---

<style>
.paper-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.paper-list li {
  margin-bottom: 1.35rem;
  padding-bottom: 1.1rem;
  border-bottom: 1px solid var(--global-divider-color);
  line-height: 1.6;
}

.paper-list li:last-child { border-bottom: none; }

.paper-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.paper-title a {
  color: var(--global-text-color);
  text-decoration: none;
}

.paper-title a:hover { text-decoration: underline; }

.paper-authors { font-size: 0.88rem; margin-bottom: 0.2rem; }
.paper-venue { font-size: 0.85rem; font-style: italic; color: var(--global-text-color-light); }
.paper-award { font-size: 0.82rem; margin-top: 0.25rem; }

.paper-links {
  font-size: 0.85rem;
  margin-top: 0.4rem;
}

.paper-links a {
  margin-right: 0.85rem;
  color: var(--global-text-color);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    fetch('/assets/json/philosophy_papers.json')
        .then(response => response.json())
        .then(papers => {
            const container = document.getElementById('philosophy-papers-list');
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
        .catch(error => console.error('Error loading philosophy papers:', error));
});
</script>

<ul class="paper-list" id="philosophy-papers-list"></ul>
