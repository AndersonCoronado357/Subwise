import { addMethod } from '../../utils/data'
import { requireUser } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const b = await readBody(event)
  await addMethod(user.id, String(b?.label ?? ''))
  return { ok: true }
})
