import {identity,rulesFor,json,errorResponse,runtime} from '@/lib/server';
import {proposePlan} from '@/lib/ai-planner';
import {aiKeyFor} from '@/lib/ai-connection';

export async function POST(request:Request){
  try{
    const user=await identity(request);
    if(Number(request.headers.get('content-length')||0)>6000)throw Object.assign(new Error('Please use a shorter description.'),{status:413});
    const input:any=await request.json();
    const current=await rulesFor(user);
    const e=runtime();
    return json(await proposePlan(input.prompt,current,(await aiKeyFor(user))||undefined,e.OPENAI_MODEL||'gpt-5.4-mini'));
  }catch(e){return errorResponse(e);}
}
