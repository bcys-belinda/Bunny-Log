exports.up = async function up(knex) {
  await knex.schema.alterTable('rabbits', (table) => {
    table.binary('profile_image_data');
    table.text('profile_content_type');
  });
};

exports.down = async function down(knex) {
  await knex.schema.alterTable('rabbits', (table) => {
    table.dropColumn('profile_content_type');
    table.dropColumn('profile_image_data');
  });
};
