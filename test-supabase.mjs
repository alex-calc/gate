import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })

async function testMatch() {
  const query = "Чому двигун Edinger просто гуде, але вал не крутиться?";
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text: query }] },
    taskType: 'RETRIEVAL_QUERY'
  })
  
  let embedding = result.embedding.values;
  if (embedding.length > 768) {
    embedding = embedding.slice(0, 768);
    const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v*v, 0));
    embedding = embedding.map((v) => v / norm);
  }

  console.log("Calling match_gate_knowledge...");
  const { data, error } = await supabase.rpc('match_gate_knowledge', {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 5,
  });

  if (error) {
    console.error("RPC Error:", error);
  } else {
    console.log("RPC Data:", data);
  }
}

testMatch();
