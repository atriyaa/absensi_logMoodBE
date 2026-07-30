import mysql from 'mysql2/promise';
import * as schema from './schema.js';
export declare const db: import("drizzle-orm/mysql2").MySql2Database<typeof schema> & {
    $client: mysql.Pool;
};
//# sourceMappingURL=index.d.ts.map