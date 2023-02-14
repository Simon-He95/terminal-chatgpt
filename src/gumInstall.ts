import { jsShell } from 'lazy-js-utils'
export async function gumInstall() {
  const hasGum = jsShell('gum -v', 'pipe').result.startsWith('gum version')
  if (!hasGum) await jsShell('brew install gum', true) // install gum
}
