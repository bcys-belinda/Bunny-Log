exports.up = async function up(knex) {
  await knex.schema.alterTable('memories', (table) => {
    table.binary('image_data');
    table.text('content_type');
  });
};

exports.down = async function down(knex) {
  await knex.schema.alterTable('memories', (table) => {
    table.dropColumn('content_type');
    table.dropColumn('image_data');
  });
};