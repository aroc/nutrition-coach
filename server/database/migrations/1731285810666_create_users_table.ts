import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    // Enable uuid-ossp
    await this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    // Create table
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('email', 254).nullable().unique()
      table.string('password').nullable()

      table.string('first_name').nullable()
      table.string('last_name').nullable()

      table.string('apple_user_id').unique().nullable()
      table.boolean('apple_email_verified').defaultTo(false)

      table.string('subscription').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
