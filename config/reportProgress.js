const ProgressBar = require('progress')
const webpack = require('webpack')
require('colors')

const getBg = bg => (bg ? 'bg' + bg.slice(0, 1).toUpperCase() + bg.slice(1) : '')

const getContent = content => (content !== undefined ? content : ' ')

module.exports = function WebpackProgessPlugin({
  incomplete = {
    bg: 'white',
    content: ' '
  },
  complete = {
    bg: 'green',
    content: ' '
  },
  width = 25,
  clear = true,
  total = 100
} = {}) {
  const incompleteBg = getBg(incomplete.bg)
  const completeBg = getBg(complete.bg)

  const incompleteContent = getContent(incomplete.content)
  const completeContent = getContent(complete.content)

  const format = `${'build'.cyan} :bar  ${':percent'.green} ${':elapseds'.blue}`
  const bar = new ProgressBar(format, {
    total,
    width,
    clear,
    incomplete: incompleteBg ? incompleteContent[incompleteBg] : incompleteContent,
    complete: completeBg ? completeContent[completeBg] : completeContent
  })

  let hasCompiled = false

  return new webpack.ProgressPlugin(percent => {
    !hasCompiled && process.stdout.write('\n') && (hasCompiled = true)
    bar.update(percent)
  })
}