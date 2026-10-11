import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { DEFAULT_RULES,Rules } from './budget';
export function db():D1Database{const binding=(env as any).DB;if(!binding)throw new Error('Saved budgeting data is temporarily unavailable.');return binding;}
export async function identity(request?:Request){const u=await getChatGPTUser();if(!u)throw Object.assign(new Error('Please sign in to open your budget.'),{status:401});if(request&&request.method!=='GET'){const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)throw Object.assign(new Error('Request not allowed.'),{status:403});}return u.userId;}
export async function rulesFor(user:string):Promise<Rules>{const row=await db().prepare('SELECT rules FROM preferences WHERE user_id=?').bind(user).first<any>();return row?JSON.parse(row.rules):DEFAULT_RULES;}
export async function recordsFor(user:string,mode:string){return(await db().prepare('SELECT * FROM records WHERE user_id=? AND mode=? ORDER BY created DESC,id DESC').bind(user,mode).all()).results;}
export function errorResponse(e:any){console.error('Budget request failed',e?.status??500);return Response.json({error:e?.status?e.message:e instanceof Error?e.message:'Unable to complete this request.'},{status:e?.status||400,headers:{'Cache-Control':'no-store'}});}
export const json=(body:any)=>Response.json(body,{headers:{'Cache-Control':'no-store'}});
export const runtime=()=>env as any;
