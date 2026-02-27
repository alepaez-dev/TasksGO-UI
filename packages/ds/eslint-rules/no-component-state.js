/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow useState and useReducer in design system component files',
    },
    messages: {
      noUseState:
        'useState is not allowed in component files. Components must be stateless. Move state to a hook in src/hooks/ or to the consuming app.',
      noUseReducer:
        'useReducer is not allowed in component files. Components must be stateless. Move state to a hook in src/hooks/ or to the consuming app.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    const isComponentFile =
      filename.includes('/src/components/') &&
      !filename.endsWith('.stories.tsx') &&
      !filename.endsWith('.stories.ts') &&
      !filename.endsWith('.test.tsx') &&
      !filename.endsWith('.test.ts');

    if (!isComponentFile) return {};

    return {
      CallExpression(node) {
        if (node.callee.type !== 'Identifier') return;

        if (node.callee.name === 'useState') {
          context.report({ node, messageId: 'noUseState' });
        }

        if (node.callee.name === 'useReducer') {
          context.report({ node, messageId: 'noUseReducer' });
        }
      },

      ImportSpecifier(node) {
        const name = node.imported.name;
        if (name === 'useState') {
          context.report({ node, messageId: 'noUseState' });
        }
        if (name === 'useReducer') {
          context.report({ node, messageId: 'noUseReducer' });
        }
      },
    };
  },
};

export default rule;
