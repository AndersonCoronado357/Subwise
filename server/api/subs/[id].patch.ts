import { updateSub } from '../../utils/data'
import { requireUser } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const id = getRouterParam(event, 'id')!
  const patch = await readBody(event)
  return { sub: await updateSub(user.id, id, patch || {}) }
})
