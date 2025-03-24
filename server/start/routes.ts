/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/health', async () => {
  return 'smooth noise online'
})

// Auth
router.post('/auth/login', '#controllers/auth_controller.login')
router.post('/auth/signup', '#controllers/auth_controller.signup')
router.post('/auth/logout', '#controllers/auth_controller.logout').use(
  middleware.auth({
    guards: ['api'],
  })
)
router.post('/auth/apple-login-callback', '#controllers/auth_controller.appleLoginCallback')
router.post(
  '/auth/apple-subscription-notification-callback',
  '#controllers/auth_controller.appleSubscriptionNotificationCallback'
)
router.post('/auth/verify-apple-login', '#controllers/auth_controller.verifyAppleLogin')

// User
router.delete('/users/delete_account', '#controllers/users_controller.delete_account').use(
  middleware.auth({
    guards: ['api'],
  })
)

// User goals
router.post('/user_goals', '#controllers/user_goals_controller.store').use(
  middleware.auth({
    guards: ['api'],
  })
)
router.patch('/user_goals/:id', '#controllers/user_goals_controller.update').use(
  middleware.auth({
    guards: ['api'],
  })
)
router.get('/user_goals', '#controllers/user_goals_controller.index').use(
  middleware.auth({
    guards: ['api'],
  })
)

// Logged food items
router.post('/logged_food_items', '#controllers/logged_food_items_controller.store').use(
  middleware.auth({
    guards: ['api'],
  })
)
router.patch('/logged_food_items/:id', '#controllers/logged_food_items_controller.update').use(
  middleware.auth({
    guards: ['api'],
  })
)
router.get('/logged_food_items', '#controllers/logged_food_items_controller.index').use(
  middleware.auth({
    guards: ['api'],
  })
)
router.delete('/logged_food_items/:id', '#controllers/logged_food_items_controller.delete').use(
  middleware.auth({
    guards: ['api'],
  })
)

// Chat messages
router.post('/chat_messages', '#controllers/chat_messages_controller.store').use(
  middleware.auth({
    guards: ['api'],
  })
)
router.get('/chat_messages', '#controllers/chat_messages_controller.index').use(
  middleware.auth({
    guards: ['api'],
  })
)
