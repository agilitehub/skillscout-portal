// Global Instructions Rule Applied!
/** Quick OpenClaw gateway diagnostics for matcher setup. */
import { config } from './config.mjs'

const token = config.openclawToken
const base = config.openclawBaseUrl

if (!token) {
  console.error('Missing OPENCLAW_GATEWAY_TOKEN (or REACT_APP_OPENCLAW_GATEWAY_TOKEN)')
  process.exit(1)
}

console.log('OpenClaw base URL:', base)
console.log('Token length:', token.length)

async function probe(path, init = {}) {
  const url = `${base}${path}`
  const res = await fetch(url, init)
  const text = await res.text()
  console.log(`\n${init.method || 'GET'} ${path} → ${res.status}`)
  console.log(text.slice(0, 500))
  return res.status
}

await probe('/models', {
  headers: { Authorization: `Bearer ${token}` }
})

await probe('/embeddings', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'x-openclaw-model': process.env.OPENCLAW_EMBEDDING_MODEL || 'openai/text-embedding-3-small'
  },
  body: JSON.stringify({ model: 'openclaw/default', input: 'diagnostic embedding test' })
})

console.log('\nIf /models is 200 but /embeddings is 500, set OPENAI_API_KEY before starting the gateway (Codex OAuth does not cover embeddings).')
