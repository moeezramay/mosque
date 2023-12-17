/*import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});

export default async function excuteQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}
*/

import { sql } from "@vercel/postgres";

/*export default async function Cart({ params }) {
    const { rows } =
        await sql`SELECT * from CARTS where user_id=${params.user}`;

    return (
        <div>
            {rows.map((row) => (
                <div key={row.id}>
                    {row.id} - {row.quantity}
                </div>
            ))}
        </div>
    );
}*/

export default async function excuteQuery({ query, values }) {
  try {
    const results =
      await sql`INSERT INTO createacc(email, password, username) VALUES('dasdas', 'asfdas', 'moeez')`;
    return results;
  } catch (error) {
    return { error };
  }
}
