import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const OLD_URL = 'https://cdn-sportlab.sandervanooijen.dev'
const NEW_URL = 'https://cdn.sportlabgroningen.nl'

const rewrite = async (
  db: MigrateUpArgs['db'],
  from: string,
  to: string,
): Promise<void> => {
  for (const table of ['media', 'documents']) {
    for (const column of ['url', 'thumbnail_u_r_l']) {
      await db.execute(sql`
        UPDATE ${sql.identifier(table)}
        SET ${sql.identifier(column)} = REPLACE(${sql.identifier(column)}, ${from}, ${to})
        WHERE ${sql.identifier(column)} LIKE ${from + '%'};
      `)
    }
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await rewrite(db, OLD_URL, NEW_URL)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await rewrite(db, NEW_URL, OLD_URL)
}
