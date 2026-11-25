// Membersihkan data uji sebelum menjalankan Postman collection.
// Menghapus semua notes, refresh token, dan user bawaan test
// (user_a, user_b, testing) agar assertion "notes length === 1"
// pada folder Authorizations tidak terpengaruh data run sebelumnya.
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool();

await pool.query('DELETE FROM notes');
await pool.query('DELETE FROM authentications');
await pool.query("DELETE FROM users WHERE username IN ('user_a', 'user_b', 'testing')");

console.log('Data uji berhasil dibersihkan.');

await pool.end();
