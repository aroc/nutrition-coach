import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logged_food_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('meal_type')
    })
  }
}
