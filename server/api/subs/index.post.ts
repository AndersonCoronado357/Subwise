import { createSub } from '../../utils/data'
import { requireUser } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const b = await readBody(event)
  return { sub: await createSub(user.id, b || {}) }
})
