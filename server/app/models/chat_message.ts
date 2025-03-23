import { DateTime } from 'luxon'
import { BaseModel, column, scope } from '@adonisjs/lucid/orm'

export default class ChatMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare message: string

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
