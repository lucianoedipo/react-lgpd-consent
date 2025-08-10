export function loadScript(
  id: string,
  src: string,
  attrs: Record<string, string> = {},
) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.src = src
  s.async = true
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  document.body.appendChild(s)
}
