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

router.post('/auth/login', '#controllers/auth_controller.login')
router.post('/auth/signup', '#controllers/auth_controller.signup')
router.post('/auth/logout', '#controllers/auth_controller.logout').use(middleware.auth({
  guards: ['api']
}));
router.post('/auth/apple-login-callback', '#controllers/auth_controller.appleLoginCallback')
router.post('/auth/apple-subscription-notification-callback', '#controllers/auth_controller.appleSubscriptionNotificationCallback')
router.post('/auth/verify-apple-login', '#controllers/auth_controller.verifyAppleLogin')


router.get('/audio_files', '#controllers/audio_files_controller.index').use(middleware.auth({
  guards: ['api']
}))
router.post('/audio_files', '#controllers/audio_files_controller.store').use(middleware.auth({
  guards: ['api']
}))
router.patch('/audio_files', '#controllers/audio_files_controller.update').use(middleware.auth({
  guards: ['api']
}))
router.delete('/audio_files/:id', '#controllers/audio_files_controller.delete').use(middleware.auth({
  guards: ['api']
}))

router.get('/mixes', '#controllers/mixes_controller.index').use(middleware.auth({
  guards: ['api']
}))
router.post('/mixes', '#controllers/mixes_controller.store').use(middleware.auth({
  guards: ['api']
}))
router.patch('/mixes/:id', '#controllers/mixes_controller.update').use(middleware.auth({
  guards: ['api']
}))
router.delete('/mixes/:id', '#controllers/mixes_controller.delete').use(middleware.auth({
  guards: ['api']
}))

router.delete('/users/delete_account', '#controllers/users_controller.delete_account').use(middleware.auth({
  guards: ['api']
}))