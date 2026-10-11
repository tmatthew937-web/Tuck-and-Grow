import {identity,json,errorResponse} from '@/lib/server';
import {saveConnection} from '@/lib/connections';
export async function POST(request:Request){try{const user=await identity(request);const p:any=await request.json();for(const k of ['clientId','clientSecret'])if(typeof p[k]!=='string'||p[k].trim().length<20||p[k].length>2000)throw new Error('Check both sandbox credentials and try again.');await saveConnection(user,{clientId:p.clientId.trim(),clientSecret:p.clientSecret.trim()});return json({saved:true});}catch(e){return errorResponse(e);}}
