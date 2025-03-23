import { DateTime } from 'luxon'
import { BaseModel, column, scope } from '@adonisjs/lucid/orm'

export default class UserGoal extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare description: string

  @column()
  declare calories: number

  @column()
  declare protein_grams: number

  @column()
  declare fat_grams: number

  @column()
  declare fat_saturated_grams: number

  @column()
  declare fat_monounsaturated_grams: number

  @column()
  declare fat_polyunsaturated_grams: number

  @column()
  declare carbs_grams: number

  @column()
  declare carbs_fiber_grams: number

  @column()
  declare carbs_sugar_grams: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  static notDeleted = scope((query) => {
    query.whereNull('deleted_at')
  })
}
