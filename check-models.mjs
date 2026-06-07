import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkModels() {
  const req = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
  const res = await req.json();
  if (res.error) {
    console.error("API Error:", res.error);
    return;
  }
  const embedModels = res.models.filter(m => m.name.includes('embed')).map(m => m.name);
  console.log("Доступні моделі embedding:", embedModels);
}

checkModels();
