import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import ChatMessage from '#models/chat_message'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import aiChatMessageSchema from '#lib/ai_chat_message_schema'
import { systemPrompt } from '#lib/ai_system_prompt'
import { AI_ASSISTANT_USER_ID } from '#constants/index'

export default class ChatMessagesController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    // get the last 10 messages between this user and the assistant
    const mostRecentMessages = await ChatMessage.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where((query) => {
        query
          .where((subquery) => {
            subquery.where('author_id', user.id).where('recipient_id', AI_ASSISTANT_USER_ID)
          })
          .orWhere((subquery) => {
            subquery.where('author_id', AI_ASSISTANT_USER_ID).where('recipient_id', user.id)
          })
      })
      .orderBy('created_at', 'desc')
      .limit(40)

    return mostRecentMessages
  }

  async store({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const message = request.input('message', '')
    if (message.length > 500) {
      return response.status(400).json({
        error: 'Message must be 500 characters or less',
      })
    }

    await ChatMessage.create({
      authorId: user.id,
      recipientId: AI_ASSISTANT_USER_ID,
      message,
    })

    // get the last 10 messages between this user and the assistant
    const mostRecentMessages = await ChatMessage.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where((query) => {
        query
          .where((subquery) => {
            subquery.where('author_id', user.id).where('recipient_id', AI_ASSISTANT_USER_ID)
          })
          .orWhere((subquery) => {
            subquery.where('author_id', AI_ASSISTANT_USER_ID).where('recipient_id', user.id)
          })
      })
      .orderBy('created_at', 'desc')
      .limit(10)

    // Now create a well formatted string of the last 10 messages
    // with user: message, and assistant: message, and the dates

    const formattedMessages = mostRecentMessages
      .map((message) => {
        return `${message.authorId === user.id ? 'user' : 'assistant'}: ${message.message} (${message.createdAt.toFormat('yyyy-MM-dd HH:mm:ss')})`
      })
      .join('\n')

    // Now use that message and the last 5 messages in the context to make a request to the AI
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: aiChatMessageSchema,
      prompt: systemPrompt + formattedMessages,
    })

    // Save the response to the database
    await ChatMessage.create({
      authorId: AI_ASSISTANT_USER_ID,
      recipientId: user.id,
      message: object.message,
      messageAction: object.action ?? null,
    })

    return object
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
