import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LoggedFoodItem from '#models/logged_food_item'

export default class LoggedFoodItemsController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const loggedFoodItems = await LoggedFoodItem.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('user_id', user.id)

    return loggedFoodItems
  }

  async store({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const loggedFoodItem = await LoggedFoodItem.create({
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

    return loggedFoodItem
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const id = request.params().id
    const loggedFoodItem = await LoggedFoodItem.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('id', id)
      .firstOrFail()

    if (loggedFoodItem.userId !== user.id) {
      response.status(404).send('Logged food item not found')
      return
    }

    loggedFoodItem.merge(
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

    await loggedFoodItem.save()
    return loggedFoodItem
  }

  async delete({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const id = params.id

    if (!id) {
      response.status(400).send('id is required')
      return
    }

    const loggedFoodItem = await LoggedFoodItem.query()
      .withScopes((scopes) => scopes.notDeleted())
      .where('id', id)
      .firstOrFail()

    if (loggedFoodItem.userId !== user.id) {
      response.status(404).send('Logged food item not found')
      return
    }

    loggedFoodItem.deletedAt = DateTime.now()
    await loggedFoodItem.save()

    return loggedFoodItem
  }
}
