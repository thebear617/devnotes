function isElement(node, tagName) {
  return node?.type === 'element' && (!tagName || node.tagName === tagName);
}

function hasProperty(node, property) {
  return isElement(node) && Object.prototype.hasOwnProperty.call(node.properties || {}, property);
}

function decodeFootnoteId(href) {
  const match = /^#user-content-fn-(.+)$/.exec(href || '');
  return match ? decodeURIComponent(match[1]) : null;
}

function isBackref(node) {
  return isElement(node, 'a') && hasProperty(node, 'dataFootnoteBackref');
}

function findFootnoteSection(tree) {
  let section;

  function visit(node) {
    if (section || !node?.children) return;
    if (isElement(node, 'section') && hasProperty(node, 'dataFootnotes')) {
      section = node;
      return;
    }
    node.children.forEach(visit);
  }

  visit(tree);
  return section;
}

function collectDefinitions(section) {
  const definitions = new Map();
  const list = section?.children?.find(child => isElement(child, 'ol'));

  list?.children?.forEach(item => {
    if (!isElement(item, 'li')) return;

    const encodedId = String(item.properties?.id || '').replace(/^user-content-fn-/, '');
    if (!encodedId) return;

    const id = decodeURIComponent(encodedId);
    definitions.set(id, item.children.filter(child => !isBackref(child)));
  });

  return definitions;
}

function isFootnoteReference(node) {
  return isElement(node, 'sup') && node.children?.some(child => (
    isElement(child, 'a') && hasProperty(child, 'dataFootnoteRef')
  ));
}

function getReferenceId(node) {
  const reference = node.children.find(child => isElement(child, 'a') && hasProperty(child, 'dataFootnoteRef'));
  return decodeFootnoteId(reference?.properties?.href);
}

function getReferenceLabel(node, file) {
  const reference = node.children.find(child => isElement(child, 'a') && hasProperty(child, 'dataFootnoteRef'));
  const preservedLabel = reference?.properties?.dataFootnoteLabel;
  if (typeof preservedLabel === 'string' && preservedLabel) return preservedLabel;

  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;
  if (!Number.isInteger(start) || !Number.isInteger(end) || !file?.value) return null;

  const source = String(file.value).slice(start, end);
  return source.startsWith('[^') && source.endsWith(']')
    ? source.slice(2, -1)
    : null;
}

function replaceReferences(parent, definitions, file) {
  if (!Array.isArray(parent.children)) return;

  parent.children = parent.children.flatMap(child => {
    if (isFootnoteReference(child)) {
      const id = getReferenceId(child);
      if (!id || !definitions.has(id)) return child;
      const label = getReferenceLabel(child, file) || id;

      return {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['article-popover-trigger'],
          dataArticlePopoverTrigger: id,
          role: 'button',
          tabIndex: 0,
          ariaExpanded: 'false',
        },
        children: [{ type: 'text', value: label }],
      };
    }

    if (isElement(child)) replaceReferences(child, definitions, file);
    return child;
  });
}

function createTemplates(tree, definitions) {
  definitions.forEach((children, id) => {
    tree.children.push({
      type: 'element',
      tagName: 'template',
      properties: {
        className: ['article-popover-template'],
        dataArticlePopoverContent: id,
      },
      children,
    });
  });
}

export default function rehypePopover() {
  return (tree, file) => {
    const section = findFootnoteSection(tree);
    if (!section) return;

    const definitions = collectDefinitions(section);
    if (!definitions.size) return;

    replaceReferences(tree, definitions, file);
    tree.children = tree.children.filter(child => child !== section);
    createTemplates(tree, definitions);
  };
}
