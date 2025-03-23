import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import env from '#start/env'
import type { AppleLoginResponse } from '#types/index'
import logger from '@adonisjs/core/services/logger'

// Email validation regex function
function isValidEmail(email: string): boolean {
  return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(email)
}

const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
  timeout: 30000
})

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  // key should be jwksClient.SigningKey type, but can't get that type to work
  client.getSigningKey(header.kid, (err: Error | null, key: any | null) => {
    if (err) return callback(err)
    if (!key) return callback(new Error('Failed to get signing key'))
    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  })
}

async function verifyAppleToken(identityToken: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      identityToken,
      getKey,
      {
        algorithms: ['RS256'],
        issuer: 'https://appleid.apple.com',
        audience: env.get('APPLE_IOS_APP_BUNDLE_ID'),
      },
      (err, payload) => {
        if (err) {
          reject(err)
          return
        }
        resolve(payload)
      }
    )
  })
}

export default class AuthController {

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password']);

    const user = await User.verifyCredentials(email, password)

    if (user.deletedAt) {
      return response.status(401).json({ error: 'Account not found' });
    }

    // give token
    const token = await User.accessTokens.create(user)

    return {
      id: user.id,
      email: user.email,
      appleUserId: user.appleUserId,
      subscription: user.subscription,
      token,
    };
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user;
    const token = auth.user?.currentAccessToken;
  
    if (user && token) {
      await User.accessTokens.delete(user, token.identifier)
      return response.ok({ message: 'Logged out successfully' })
    }
  
    return response.badRequest({ message: 'Not authenticated' })
  }

  async signup({ request, response }: HttpContext) {
    const { email, password } = request.body();

    if (await User.findBy('email', email)) {
      return response.status(400).json({ error: 'Account already exists with this email' });
    }

    if (!email || !isValidEmail(email)) {
      return response.status(400).json({ error: 'Invalid email' });
    }

    if (!password || password.length < 6) {
      return response.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const newUser = await User.create({ email, password, subscription: 'free' });

    const token = await User.accessTokens.create(newUser)

    return {
      id: newUser.id,
      email: newUser.email,
      subscription: newUser.subscription,
      token,
    };
  }

  async appleLoginCallback({ request }: HttpContext) {
    const queryParams = request.qs();
    const bodyParams = request.body();

    logger.info(`Sign-in with Apple callback, query params:', ${JSON.stringify(queryParams)}, body params: ${JSON.stringify(bodyParams)}`);
  }

  async verifyAppleLogin({ request, response }: HttpContext) {
    try {
      const body = request.body() as AppleLoginResponse
      // logger.info(`Verify Apple login params: ${JSON.stringify(body)}`);

      if (!body?.identityToken) {
        return response.status(400).json({ 
          error: 'Missing identity token' 
        });
      }

      // Verify the token
      const payload = await verifyAppleToken(body.identityToken);
      
      // The payload contains verified information from Apple
      const { email, sub: appleUserId, email_verified } = payload as any;
      
      // Verify that the user ID matches
      if (appleUserId !== body.user) {
        return response.status(401).json({ 
          error: 'User ID mismatch' 
        })
      }

      // Find or create user
      const user = await User.firstOrCreate(
        { appleUserId },
        {
          appleUserId,
          email,
          appleEmailVerified: email_verified != null ? Boolean(email_verified) : null,
          firstName: body.givenName,
          lastName: body.familyName,
          subscription: 'free'
        }
      )

      // Generate API token
      const token = await User.accessTokens.create(user)

      return {
        id: user.id,
        email: user.email,
        appleUserId: user.appleUserId,
        subscription: user.subscription,
        token,
      }
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Apple auth error: ${JSON.stringify(error.message)}`);
      }
      return response.status(401).json({ 
        error: 'Invalid authentication token'
      })
    }
  }

  async appleSubscriptionNotificationCallback({ request }: HttpContext) {
    const body = request.body();
    logger.info(`Apple subscription notification callback, body: ${JSON.stringify(body)}`);
  }
}
