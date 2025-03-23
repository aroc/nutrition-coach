import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon';

export default class UsersController {

  async delete_account({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail();

    if (!user) {
      response.status(404).send("User not found");
      return;
    }

    user.deletedAt = DateTime.now();
    user.email = user.email ? user.email.replace('@', '_deleted@') : null;
    user.appleUserId = user.appleUserId ? user.appleUserId + '_deleted' : null;
    await user.save();

    return user;
  }
  
}
