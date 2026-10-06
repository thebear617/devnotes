// Footnote definitions live inside <template> nodes. Astro still exposes
// their headings in `render(...).headings`, so remove those links from the
// visible TOC before binding active-heading behavior.
const visibleHeadingIds = new Set(
  [...document.querySelectorAll<HTMLElement>('.article-body h1[id], .article-body h2[id], .article-body h3[id], .blog-article-body h1[id], .blog-article-body h2[id], .blog-article-body h3[id], .tl-detail-body h1[id], .tl-detail-body h2[id], .tl-detail-body h3[id]')]
    .map((heading) => heading.id),
);
document.querySelectorAll<HTMLAnchorElement>('.article-toc-link, .blog-toc-link').forEach((link) => {
  if (!visibleHeadingIds.has(link.dataset.headingId || '')) link.remove();
});
document.querySelectorAll<HTMLElement>('.article-toc-group, .blog-toc-group').forEach((group) => {
  if (!group.querySelector('.article-toc-link, .blog-toc-link')) group.remove();
});

const tocToggle = document.getElementById('articleTocToggle') ?? document.getElementById('blogTocToggle');
const tocColumn = document.querySelector<HTMLElement>('.article-toc-column, .blog-toc-column');
const tocDetails = tocColumn?.querySelector<HTMLDetailsElement>('.article-toc, .blog-toc');
const mobileQuery = window.matchMedia('(max-width: 720px)');

function syncFloatingToc() {
  tocToggle?.classList.toggle('is-floating', Boolean(mobileQuery.matches && window.scrollY > 8));
}

function syncTocToggle() {
  const open = Boolean(mobileQuery.matches && tocColumn?.classList.contains('is-mobile-open'));
  tocToggle?.setAttribute('aria-expanded', String(open));
  tocToggle?.setAttribute('aria-label', open ? '关闭文章目录' : '打开文章目录');
  tocToggle?.classList.toggle('is-open', open);
}

function closeMobileToc() {
  tocColumn?.classList.remove('is-mobile-open');
  syncTocToggle();
}

tocToggle?.addEventListener('click', () => {
  if (!mobileQuery.matches || !tocColumn) return;
  const open = tocColumn.classList.toggle('is-mobile-open');
  if (open && tocDetails) tocDetails.open = true;
  syncTocToggle();
});

document.addEventListener('click', (event) => {
  if (!tocColumn?.classList.contains('is-mobile-open')) return;
  const target = event.target as Node;
  if (tocColumn.contains(target) || tocToggle?.contains(target)) return;
  closeMobileToc();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileToc();
});

tocColumn?.querySelectorAll<HTMLAnchorElement>('.article-toc-link, .blog-toc-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (mobileQuery.matches) closeMobileToc();
  });
});

const tocLinks = [...document.querySelectorAll<HTMLAnchorElement>('.article-toc-link, .blog-toc-link')];
const articleHeadings = [...document.querySelectorAll<HTMLElement>('.article-body h1[id], .article-body h2[id], .article-body h3[id], .blog-article-body h1[id], .blog-article-body h2[id], .blog-article-body h3[id], .tl-detail-body h1[id], .tl-detail-body h2[id], .tl-detail-body h3[id]')];
const tocGroups = [...document.querySelectorAll<HTMLElement>('.article-toc-group, .blog-toc-group')];
const headingGroups = new Map<string, HTMLElement>();
tocGroups.forEach((group) => group.querySelectorAll<HTMLElement>('.article-toc-link').forEach((link) => {
  if (link.dataset.headingId) headingGroups.set(link.dataset.headingId, group);
}));

function syncActiveHeading() {
  if (!articleHeadings.length) return;
  let activeId = articleHeadings[0].id;
  const activeLine = 120;
  for (const heading of articleHeadings) {
    if (heading.getBoundingClientRect().top <= activeLine) activeId = heading.id;
    else break;
  }
  tocLinks.forEach((link) => link.classList.toggle('active', link.dataset.headingId === activeId));
  const activeGroup = headingGroups.get(activeId);
  tocGroups.forEach((group) => group.dataset.expanded = String(group === activeGroup));
  activeGroup?.querySelector<HTMLElement>('.article-toc-link.depth-2, .blog-toc-link.depth-2')?.classList.add('active');
}

window.addEventListener('scroll', () => {
  syncFloatingToc();
  syncActiveHeading();
}, { passive: true });

mobileQuery.addEventListener('change', () => {
  closeMobileToc();
  syncFloatingToc();
  syncTocToggle();
});

syncFloatingToc();
syncTocToggle();
syncActiveHeading();
