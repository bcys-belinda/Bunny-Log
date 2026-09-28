exports.up = async function up(knex) {
  await knex.schema.alterTable('food_entries', (table) => {
    table.text('quantity_unit').notNullable().defaultTo('kg');
  });
};

exports.down = async function down(knex) {
  await knex.schema.alterTable('food_entries', (table) => {
    table.dropColumn('quantity_unit');
  });
};
