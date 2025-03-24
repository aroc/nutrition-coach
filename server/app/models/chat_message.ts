import { DateTime } from 'luxon'
import { BaseModel, column, scope } from '@adonisjs/lucid/orm'

export default class ChatMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare authorId: string

  @column()
  declare recipientId: string

  @column()
  declare message: string

  @column()
  declare messageAction: object

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
