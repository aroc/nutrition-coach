import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import UserGoal from '#models/user_goal'

export default class UserGoalsController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const userGoals = await UserGoal.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('user_id', user.id)

    return userGoals
  }

  async store({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const userGoal = await UserGoal.create({
      userId: user.id,
      ...request.only([
        'description',
        'calories',
        'protein_grams',
        'fat_grams',
        'fat_grams_saturated',
        'fat_monounsaturated',
        'fat_polyunsaturated',
        'carbs',
        'carbs_fiber',
        'carbs_sugar',
      ]),
    })

    return userGoal
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const id = request.params().id
    const userGoal = await UserGoal.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('id', id)
      .firstOrFail()

    if (userGoal.userId !== user.id) {
      response.status(404).send('User goal not found')
      return
    }

    userGoal.merge(
      request.only([
        'description',
        'calories',
        'protein_grams',
        'fat_grams',
        'fat_grams_saturated',
        'fat_monounsaturated',
        'fat_polyunsaturated',
        'carbs',
        'carbs_fiber',
        'carbs_sugar',
      ])
    )

    await userGoal.save()
    return userGoal
  }

  async delete({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const id = params.id

    if (!id) {
      response.status(400).send('id is required')
      return
    }

    const userGoal = await UserGoal.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('id', id)
      .firstOrFail()

    if (userGoal.userId !== user.id) {
      response.status(404).send('User goal not found')
      return
    }

    userGoal.deletedAt = DateTime.now()
    await userGoal.save()

    return userGoal
  }
}
