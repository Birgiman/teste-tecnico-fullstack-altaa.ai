module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(.*?)([A-Za-z]+)(?:\((.*)\))?:\s*(.*)$/,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        // Aceita também com primeira letra maiúscula (GitMoji CLI)
        'Build',
        'Chore',
        'Ci',
        'Docs',
        'Feat',
        'Fix',
        'Perf',
        'Refactor',
        'Revert',
        'Style',
        'Test',
      ],
    ],
    'type-case': [0], // Desabilita validação de case para type
    'subject-case': [0],
    'body-max-line-length': [0], // Desabilita validação de tamanho máximo das linhas do corpo
  },
};