import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('logged_food_items', (table) => {
      table.uuid('id').primary().notNullable().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('user_id')
      table.string('description').nullable()
      table.integer('calories').nullable()
      table.integer('protein_grams').nullable()
      table.integer('fat_grams').nullable()
      table.integer('fat_saturated_grams').nullable()
      table.integer('fat_monounsaturated_grams').nullable()
      table.integer('fat_polyunsaturated_grams').nullable()
      table.integer('carbs_grams').nullable()
      table.integer('carbs_fiber_grams').nullable()
      table.integer('carbs_sugar_grams').nullable()
      table.enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })

    this.schema.createTable('user_goals', (table) => {
      table.uuid('id').primary().notNullable().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('user_id')
      table.string('description').nullable()
      table.integer('calories').nullable()
      table.integer('protein_grams').nullable()
      table.integer('fat_grams').nullable()
      table.integer('fat_saturated_grams').nullable()
      table.integer('fat_monounsaturated_grams').nullable()
      table.integer('fat_polyunsaturated_grams').nullable()
      table.integer('carbs_grams').nullable()
      table.integer('carbs_fiber_grams').nullable()
      table.integer('carbs_sugar_grams').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })

    this.schema.createTable('chat_messages', (table) => {
      table.uuid('id').primary().notNullable().defaultTo(this.raw('uuid_generate_v4()'))

      table.uuid('author_id').nullable()
      table.uuid('recipient_id').nullable()
      table.string('message')
      table.jsonb('message_action')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable('logged_food_items')
    this.schema.dropTable('user_goals')
    this.schema.dropTable('chat_messages')
  }
}
