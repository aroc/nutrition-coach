import { defineConfig } from '@adonisjs/cors'
import Env from '#start/env'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  origin: () => {
    if (Env.get('NODE_ENV') === 'development') {
      return true // Allow any origin in development
    }
    
    // For production, you can specify allowed origins or use a more restrictive setting
    // return ['capacitor://localhost']
    return true;
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
