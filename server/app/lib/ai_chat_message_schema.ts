import { z } from 'zod'

const schema = z.object({
  message: z.string(),
  actions: z.array(z.string()),
})

export default schema
