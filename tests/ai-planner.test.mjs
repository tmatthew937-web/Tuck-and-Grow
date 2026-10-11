import test from 'node:test';
import assert from 'node:assert/strict';
import {proposePlan,validatePlan,providerFailure} from '../lib/ai-planner.ts';
import {DEFAULT_RULES} from '../lib/budget.ts';

const ready={status:'ready',reserve:20,business:60,personal:40,message:'Reserve 20% first, then split the rest 60/40.'};
const response=value=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(value)}]}]}));

test('suggestion previews exact cents while preserving names, goals, and saved version',()=>{
  const current=structuredClone(DEFAULT_RULES),before=structuredClone(current);
  const plan=validatePlan(ready,current);
  assert.deepEqual(plan.preview,{tax:2000,business:4800,personal:3200});
  assert.deepEqual(plan.rules.names,current.names);assert.deepEqual(plan.rules.goals,current.goals);
  assert.equal(plan.baseVersion,current.version);assert.deepEqual(current,before);
  assert.equal(validatePlan({...ready,reserve:100},current).preview.personal,0);
});

test('conflicting, fractional and out-of-range percentages cannot become a saved proposal',()=>{
  for(const patch of [{personal:30},{reserve:20.5},{business:101,personal:-1},{reserve:null}])assert.throws(()=>validatePlan({...ready,...patch},DEFAULT_RULES));
  const clarified=validatePlan({status:'needs_clarification',reserve:null,business:null,personal:null,message:'Are these shares of the remainder?'},DEFAULT_RULES);
  assert.equal(clarified.status,'needs_clarification');assert.equal(clarified.rules,undefined);
});

test('unconfigured or invalid requests never call a provider',async()=>{
  let calls=0;const send=async()=>{calls++;return response(ready);};
  await assert.rejects(proposePlan('Split equally',DEFAULT_RULES,undefined,undefined,send),e=>e.status===503);
  await assert.rejects(proposePlan('x'.repeat(1201),DEFAULT_RULES,'test-key',undefined,send),e=>e.status===400);
  assert.equal(calls,0);
});

test('Responses request uses server key and constrained data, never transaction history',async()=>{
  const plan=await proposePlan('Reserve 20% then split the rest 60/40',DEFAULT_RULES,'mock-key','gpt-5.4-mini',async(url,options)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');
    assert.equal(options.headers.Authorization,'Bearer mock-key');
    const body=JSON.parse(options.body);assert.equal(body.store,false);assert.equal(body.text.format.strict,true);
    assert.deepEqual(Object.keys(JSON.parse(body.input)).sort(),['request','saved_percentages']);
    assert.ok(!options.body.includes('mock-key'));return response(ready);
  });
  assert.equal(plan.status,'ready');
});

test('provider refusals and incomplete outputs never return ready; raw errors stay private',async()=>{
  const send=data=>async()=>new Response(JSON.stringify(data));
  const refusal=await proposePlan('x',DEFAULT_RULES,'test-key',undefined,send({status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'private provider text'}]}]}));
  assert.equal(refusal.status,'unsupported');assert.equal(refusal.rules,undefined);
  await assert.rejects(proposePlan('x',DEFAULT_RULES,'test-key',undefined,send({status:'incomplete',output:[]})));
  await assert.rejects(proposePlan('x',DEFAULT_RULES,'test-key',undefined,async()=>new Response('sensitive provider error',{status:401})),e=>e.status===503&&!e.message.includes('sensitive'));
});

test('credit, spend and rate limits have distinct instructions; sensitive provider text stays private',()=>{
  const credit=providerFailure(429,{error:{code:'credit_balance_exhausted',message:'private provider details'}});
  assert.equal(credit.providerCategory,'credits');assert.match(credit.message,/credit balance is empty/);assert.ok(!credit.message.includes('private'));
  const project=providerFailure(429,{error:{code:'project_spend_limit_exceeded',type:'insufficient_quota'}});
  assert.equal(project.providerCategory,'project_limit');
  const legacy=providerFailure(429,{error:{code:'insufficient_quota'}});assert.equal(legacy.providerCategory,'quota');
  const rate=providerFailure(429,{error:{code:'rate_limit_exceeded'}},'45');assert.match(rate.message,/Wait 45 seconds/);assert.ok(!rate.message.includes('credits'));
  const unknown=providerFailure(429,null);assert.equal(unknown.providerCategory,'unknown_limit');
});
