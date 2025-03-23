import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import ChatMessage from '#models/chat_message'
import { generateObject } from 'ai'
import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import env from '#start/env'

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

    // Now use that message and the last 5 messages in the context to make a request to the AI
    // const userPrompt = request.input('user_prompt', '').slice(0, 500)

    // const prompt = `Return an array of all the audio files that would make sense to include in a mix to satisfy the user's prompt. Also include a volume value between 0 and 1. Unless you feel there's value to changing the volume level, just leave the volume at 1.0. The audio files are described by their user_prompt property. Use the reply property to describe your work very concisely. If you can't find a good matching file for something requested in the user's prompt, please acknowledge that and let the user know in the reply. Also add a string entry to the missing_audio_files property for any the audio file that the user requested but you couldn't find. When crafting your reply, don't use technical language, use language that would make sense for an end user to understand. The audio files you can pick from are: ${JSON.stringify(systemFiles)}. The user's prompt is: ${userPrompt}`

    // const { object } = await generateObject({
    //   model: openai('gpt-4o'),
    //   schema: z.object({
    //     audio_files: z.array(
    //       z.object({
    //         id: z.string(),
    //         file_name: z.string(),
    //         volume: z.number(),
    //       })
    //     ),
    //     reply: z.string(),
    //     missing_audio_files: z.array(z.string()),
    //   }),
    //   prompt,
    // })

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
