import { isFile, jsShell } from 'lazy-js-utils'
import { ChatGPTAPI } from 'chatgpt'
import pi from 'picocolors'
import { gumInstall } from './gumInstall'

let file: string
async function run() {
  gumInstall()
  let apiKey = ''
  const { result: rootpath } = jsShell('echo ~', 'pipe')
  file = `${rootpath}/.openal`

  if (isFile(file)) {
    const { result: key } = jsShell(`cat ${file}`, 'pipe')
    apiKey = key
  }

  if (!apiKey) {
    const { result: k } = jsShell(
      'gum input --password --placeholder "Enter OPENAI_API_KEY"',
      'pipe',
    )
    apiKey = k.trim()
    jsShell(`echo "${apiKey}">${file}`)
  }

  const api = new ChatGPTAPI({ apiKey })

  let { result: prompt } = await jsShell(
    'gum input --placeholder "question"',
    'pipe',
  )

  prompt = prompt.trim()
  if (!prompt)
    console.log(pi.red('question is null'))
  const { text } = await api.sendMessage(prompt, {
    onProgress: ({ text }) => {
      console.clear()
      console.log(pi.magenta(text))
    },
  })
  console.clear()
  console.log(pi.magenta(text))
  process.exit(0)
}

run().catch((err) => {
  if (err.statusCode === 401)
    jsShell(`rm -f ${file}`)

  console.error(pi.red(err))
  process.exit(1)
})
