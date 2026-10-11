import {identity,rulesFor,json,errorResponse,runtime} from '@/lib/server';
import {saveAIKey} from '@/lib/ai-connection';
import {proposePlan} from '@/lib/ai-planner';

export async function POST(request:Request){
  try{
    const user=await identity(request);
    const input:any=await request.json();
    const key=typeof input.apiKey==='string'?input.apiKey.trim():'';
    if(!/^sk-[A-Za-z0-9_-]{20,509}$/.test(key))throw new Error('Enter the complete OpenAI API key.');
    const current=await rulesFor(user);
    const check=await proposePlan('Keep my saved percentages exactly as they are.',current,key,runtime().OPENAI_MODEL||'gpt-5.4-mini');
    if(check.status!=='ready'||check.rules.reserve!==current.reserve||check.rules.business!==current.business)throw new Error('The connection test did not finish correctly. Please try again.');
    await saveAIKey(user,key);
    return json({saved:true,verified:true});
  }catch(e){return errorResponse(e);}
}
