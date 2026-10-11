import {db,runtime} from './server';
import {sealSecret,openSecret} from './secret';

export async function saveAIKey(user:string,apiKey:string){
  const encrypted=await sealSecret(apiKey,runtime().CONNECTION_ENCRYPTION_KEY,'openai:'+user);
  await db().prepare('INSERT INTO ai_connections(user_id,encrypted,updated) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET encrypted=excluded.encrypted,updated=excluded.updated').bind(user,encrypted,new Date().toISOString()).run();
}
export async function aiKeyFor(user:string):Promise<string|null>{
  const row=await db().prepare('SELECT encrypted FROM ai_connections WHERE user_id=?').bind(user).first<any>();
  if(!row)return null;
  return openSecret(row.encrypted,runtime().CONNECTION_ENCRYPTION_KEY,'openai:'+user);
}
