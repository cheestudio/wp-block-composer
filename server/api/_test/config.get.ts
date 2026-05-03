export default defineEventHandler(() => {
  const config = useRuntimeConfig()

  return {
    ok: true,
    claudeModel: config.claudeModel,
    claudeMaxTokens: config.claudeMaxTokens,
    bundleDir: config.bundleDir,
    bundleTtlMs: config.bundleTtlMs,
    hasApiKey: !!config.anthropicApiKey
  }
})
