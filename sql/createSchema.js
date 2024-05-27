const db = require('../lib/db');
const fs = require('fs');
const path = require('path');

/**
 * Executes all sql statements in createSchema.sql
 */
const createSchema = async () => {
  const dbClient = await db.getClient();
  const schema = fs.readFileSync(path.join(__dirname, 'createSchema.sql'));

  console.log('- LOADING SCHEMA -')
  await dbClient.exec(schema.toString());

  //const res = await dbClient.all('select *  from test');
  //console.log(res);

  dbClient.close();
};

createSchema().then(r => {
  console.log('Finished  OK');
}).catch(e => {
  console.log('Finished  KO', e);
});