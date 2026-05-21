import dotenv from 'dotenv';

dotenv.config();

const { validateEnv } = await import('./config/env.js');
const { connectDB } = await import('./config/db.js');
const { default: app } = await import('./app.js');

validateEnv();

const PORT = process.env.PORT || 5000;

await connectDB();

const { ensureSampleProblems } = await import('./utils/ensureSeed.js');
await ensureSampleProblems();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
