module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/stylelint')],
  rules: {
    'order/properties-order': [],
    'declaration-bang-space-before': null,
    'function-name-case': null,
    'plugin/declaration-block-no-ignored-properties': null,
  },
}
