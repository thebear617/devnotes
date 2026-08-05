function isAdjacent(previous, next) {
  return previous?.position?.end?.line + 1 === next?.position?.start?.line;
}

export default function remarkFootnoteIndent() {
  return tree => {
    if (!Array.isArray(tree.children)) return;

    for (let index = 0; index < tree.children.length - 1; index += 1) {
      const definition = tree.children[index];
      const content = tree.children[index + 1];

      if (
        definition?.type !== 'footnoteDefinition'
        || definition.children?.length
        || !content?.position
        || !isAdjacent(definition, content)
      ) {
        continue;
      }

      definition.children = [content];
      tree.children.splice(index + 1, 1);
    }
  };
}
