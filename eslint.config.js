import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  ignores: ['e2e', 'test', 'examples'],
})
