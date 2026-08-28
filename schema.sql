{
  "name": "practiceroom-api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "db:local": "wrangler d1 execute practiceroom --local --file=./schema.sql",
    "db:remote": "wrangler d1 execute practiceroom --remote --file=./schema.sql"
  },
  "devDependencies": { "wrangler": "^3.90.0" }
}
