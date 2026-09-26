import { db } from '../src/server/db';

console.log('Testing authentications in db:');

const testCases = [
  { email: 'admin@codenova.co', pass: 'Codenova@22' },
  { email: 'admin@codenova.co', pass: 'CodeNova2026!Admin' },
  { email: 'admin@codenova.tech', pass: 'CodeNova2026!Admin' },
  { email: 'admin@codenova.tech', pass: 'Codenova@22' },
  { email: 'admin@codenova.io', pass: 'CodeNova2026!Admin' },
  { email: 'admin@codenova.io', pass: 'Codenova@22' },
  { email: 'codenovaworks@gmail.com', pass: 'CodeNova2026!Admin' },
];

for (const tc of testCases) {
  const pUser = db.authenticatePortalUser(tc.email, tc.pass);
  const lUser = db.verifyAdmin(tc.email, tc.pass);
  console.log(`Email: "${tc.email}" | Pass: "${tc.pass}" -> portal: ${!!pUser}, legacy: ${!!lUser}`);
}
