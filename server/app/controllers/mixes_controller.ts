import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Mix from '#models/chat_message'

const addVolumeToAudioFilesInMixes = (mixes: Array<Mix>) => {
  // Transform the data to explicitly include pivot values
  const transformedMixes = mixes.map((mix) => {
    const transformedAudioFiles = mix.audioFiles.map((file) => {
      return {
        ...file.serialize(), // Serialize the file model
        volume: file.$extras.pivot_volume, // Include the pivot column
      }
    })

    return {
      ...mix.serialize(), // Serialize the mix model
      audioFiles: transformedAudioFiles, // Attach transformed audio files
    }
  })

  return transformedMixes
}

export default class MixesController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const mixes = await Mix.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('user_id', user.id)
      .preload('audioFiles', (query) => {
        query.pivotColumns(['volume']) // Include volume from pivot/join table
      })

    const transformedMixes = addVolumeToAudioFilesInMixes(mixes)

    return transformedMixes
  }

  async store({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const mix = await Mix.create({
      userId: user.id,
      name:
        request.input('name') ??
        `Your special mix ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
    })

    if (request.input('audioFiles')) {
      await mix.related('audioFiles').attach(request.input('audioFiles'))
    }

    // Load the relationships before returning
    await mix.load('audioFiles')

    return mix
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const id = request.params().id
    const mix = await Mix.findOrFail(id)

    if (!mix || mix.userId !== user.id) {
      response.status(404).send('Audio file not found')
      return
    }

    const requestMix = request.input('mix')

    if (requestMix.name) {
      mix.name = requestMix.name
    }

    if (requestMix.audioFiles) {
      if (typeof requestMix.audioFiles[0] !== 'string') {
        // Convert array format to object format required by sync
        const audioFilesMap = requestMix.audioFiles.reduce(
          (acc: Record<string, { volume: number }>, file: Record<string, any>) => {
            const { id, volume } = file
            acc[id] = { volume }
            return acc
          },
          {}
        )
        await mix.related('audioFiles').sync(audioFilesMap)
      } else {
        await mix.related('audioFiles').sync(requestMix.audioFiles)
      }
    }

    await mix.save()

    const updatedMix = await Mix.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('user_id', user.id)
      .where('id', id)
      .preload('audioFiles', (query) => {
        query.pivotColumns(['volume']) // Include volume from pivot/join table
      })

    const transformedMixes = addVolumeToAudioFilesInMixes(updatedMix)

    return transformedMixes
  }

  async delete({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const id = params.id

    if (!id) {
      response.status(400).send('id is required')
      return
    }

    const mix = await Mix.findOrFail(id)

    if (!mix || mix.userId !== user.id) {
      response.status(404).send('Audio file not found')
      return
    }

    mix.deletedAt = DateTime.now()
    await mix.save()

    return mix
  }
}
