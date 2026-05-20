import dotenv from 'dotenv';

// Load .env first — static imports below are hoisted, so app loads via dynamic import.
dotenv.config();

const { validateEnv } = await import('./config/env.js');
const { connectDB } = await import('./config/db.js');
const { default: app } = await import('./app.js');

validateEnv();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
