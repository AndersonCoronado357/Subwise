import { removeCategory } from '../../utils/data'
import { requireUser } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const ok = await removeCategory(user.id, getRouterParam(event, 'id')!)
  return { ok }
})
