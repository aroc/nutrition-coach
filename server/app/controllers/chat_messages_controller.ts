import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import ChatMessage from '#models/chat_message'

export default class ChatMessagesController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const messages = await ChatMessage.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('user_id', user.id)

    return messages
  }

  async store({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const message = await ChatMessage.create({
      userId: user.id,
      message: request.input('message'),
    })

    return message
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const id = request.params().id
    const message = await ChatMessage.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('id', id)
      .firstOrFail()

    if (message.userId !== user.id) {
      response.status(404).send('Message not found')
      return
    }

    message.merge({
      message: request.input('message'),
    })

    await message.save()
    return message
  }

  async delete({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const id = params.id

    if (!id) {
      response.status(400).send('id is required')
      return
    }

    const message = await ChatMessage.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('id', id)
      .firstOrFail()

    if (message.userId !== user.id) {
      response.status(404).send('Message not found')
      return
    }

    message.deletedAt = DateTime.now()
    await message.save()

    return message
  }
}
