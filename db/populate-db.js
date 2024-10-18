const { basename } = require("path");
const { argv, exit } = require("process");
const { Client } = require("pg");

if (argv.length !== 3) {
  const runtime = basename(argv[0]);
  const filename = basename(argv[1]);
  console.log(
    `Usage: ${runtime} ${filename} <postgresql://user:pass@host:port/db>`
  );
  exit(1);
}

const dbUrl = argv[2];

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const populateTableQuery = {
  text: `
    INSERT INTO messages (sender, message) 
    VALUES ($1, $2), ($3, $4), ($5, $6);
  `,
  values: [
    "Superman",
    "Hello world!",
    "Batman",
    "Hi there!",
    "Robin",
    "Yo, What's up!",
  ],
};

async function main() {
  try {
    const dbClient = new Client({ connectionString: dbUrl });
    console.log("Connecting...");
    await dbClient.connect();
    console.log("Seeding...");
    await dbClient.query(createTableQuery);
    await dbClient.query(populateTableQuery);
    console.log("Disconnecting...");
    await dbClient.end();
    console.log("Done.");
  } catch (error) {
    console.log(error);
    exit(2);
  }
}

main();
