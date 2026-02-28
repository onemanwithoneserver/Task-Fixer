import mongoose from 'mongoose';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🗑️  MongoDB Database Cleanup Tool\n');
console.log('This tool will help you:');
console.log('1. List all your databases');
console.log('2. Delete old/unwanted databases');
console.log('3. Start fresh with Task Fixer\n');

const OLD_CONNECTION = 'mongodb://localhost:27017';

async function listDatabases() {
  try {
    const conn = await mongoose.createConnection(OLD_CONNECTION).asPromise();
    const admin = conn.db.admin();
    const { databases } = await admin.listDatabases();
    
    console.log('\n📊 Your MongoDB Databases:\n');
    databases.forEach((db, index) => {
      console.log(`${index + 1}. ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    await conn.close();
    return databases;
  } catch (error) {
    console.error('\n❌ Error connecting to MongoDB:', error.message);
    console.log('\nMake sure MongoDB is running: mongod');
    process.exit(1);
  }
}

async function deleteDatabase(dbName) {
  try {
    const conn = await mongoose.createConnection(`${OLD_CONNECTION}/${dbName}`).asPromise();
    await conn.dropDatabase();
    await conn.close();
    console.log(`\n✅ Database "${dbName}" has been deleted!`);
    return true;
  } catch (error) {
    console.error(`\n❌ Error deleting database "${dbName}":`, error.message);
    return false;
  }
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  const databases = await listDatabases();
  
  if (databases.length === 0) {
    console.log('\n✨ No databases found. You have a clean slate!');
    rl.close();
    process.exit(0);
  }
  
  console.log('\n');
  const answer = await question('Do you want to delete any database? (yes/no): ');
  
  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('\n👍 No changes made. Exiting...');
    rl.close();
    process.exit(0);
  }
  
  const dbName = await question('\nEnter the database name to delete (e.g., bharat-shurka): ');
  
  const dbExists = databases.find(db => db.name.toLowerCase() === dbName.toLowerCase());
  
  if (!dbExists) {
    console.log(`\n⚠️  Database "${dbName}" not found.`);
    rl.close();
    process.exit(0);
  }
  
  const confirm = await question(`\n⚠️  Are you SURE you want to delete "${dbName}"? This cannot be undone! (yes/no): `);
  
  if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
    await deleteDatabase(dbName);
    console.log('\n✨ Database deleted successfully!');
    console.log('\nYour Task Fixer will use a fresh database: task-fixer-v2');
  } else {
    console.log('\n👍 Deletion cancelled.');
  }
  
  rl.close();
  process.exit(0);
}

main();
