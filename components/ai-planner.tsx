'use client';
import {useEffect,useRef,useState} from 'react';
import {Sparkles,LoaderCircle,Check} from 'lucide-react';
import {BUCKETS,money,type Rules} from '@/lib/budget';
import type {PlanResult} from '@/lib/ai-planner';

export default function AIPlanner({savedRules,configured,onSaved}:{savedRules:Rules;configured:boolean;onSaved:()=>Promise<unknown>}){
  const[prompt,setPrompt]=useState(''),[result,setResult]=useState<PlanResult|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState<'suggest'|'save'|null>(null);
  const requestRef=useRef<AbortController|null>(null);
  const generation=useRef(0);
  useEffect(()=>{generation.current++;requestRef.current?.abort();setResult(null);setError('');setBusy(null);},[savedRules.version]);
  useEffect(()=>()=>{generation.current++;requestRef.current?.abort();},[]);

  async function suggest(event:React.FormEvent){
    event.preventDefault();const run=++generation.current;setBusy('suggest');setResult(null);setError('');
    const controller=new AbortController();requestRef.current=controller;
    try{
      const response=await fetch('/api/ai/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt}),signal:controller.signal});
      const data:any=await response.json();if(!response.ok)throw new Error(data.error||'Please try again.');
      if(generation.current===run)setResult(data);
    }catch(e:any){if(generation.current===run&&e.name!=='AbortError')setError(e.message||'Please try again.');}
    finally{if(generation.current===run)setBusy(null);}
  }

  async function save(){
    if(result?.status!=='ready')return;setBusy('save');setError('');
    try{
      const response=await fetch('/api/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'rules',rules:result.rules,baseVersion:result.baseVersion})});
      const data:any=await response.json();if(!response.ok)throw new Error(data.error||'Could not save the plan.');
      setResult(null);await onSaved();
    }catch(e:any){setError(e.message||'Could not save the plan.');}
    finally{setBusy(null);}
  }

  return <section className="panel planner" aria-labelledby="planner-title">
    <div className="section-head"><div><span className="pill violet"><Sparkles size={15}/> AI MONEY PLANNER</span><h2 id="planner-title">Tell us how to tuck it away</h2><p className="muted">Describe your split. Review it before saving.</p></div></div>
    {!configured&&<p className="planner-notice" role="status">Choose Connect OpenAI in Your connections below to activate suggestions. Manual rules work while you connect.</p>}
    <form onSubmit={suggest}>
      <label className="field" htmlFor="budget-plan">Your plan<textarea id="budget-plan" rows={3} maxLength={1200} value={prompt} disabled={Boolean(busy)} onChange={e=>{setPrompt(e.target.value);setResult(null);setError('');}} placeholder="Reserve 20% for taxes first, then put 60% of the rest into my business and 40% into personal." required/></label>
      <div className="planner-examples"><button type="button" disabled={Boolean(busy)} onClick={()=>{setPrompt('Keep my saved tax reserve, then split the remainder equally between business and personal.');setResult(null);setError('');}}>Split the rest equally</button><button type="button" disabled={Boolean(busy)} onClick={()=>{setPrompt('Keep my saved tax reserve, then put 70% of the remainder into business and 30% into personal.');setResult(null);setError('');}}>Grow my business</button></div>
      <p className="small muted planner-context">Based on your saved rules: {savedRules.reserve}% tax reserve, then {savedRules.business}% business and {100-savedRules.business}% personal. Your description and these percentages are sent to OpenAI when you ask for a suggestion.</p>
      <button className="button primary" disabled={!configured||Boolean(busy)||!prompt.trim()} type="submit">{busy==='suggest'?<LoaderCircle size={17} className="spin"/>:<Sparkles size={17}/>} {busy==='suggest'?'Working on your plan…':'Suggest my split'}</button>
    </form>
    {error&&<p className="planner-error" role="alert">{error}</p>}
    {result&&<div className="planner-result" aria-live="polite">
      <h3>{result.status==='ready'?'Review your suggested split':result.status==='needs_clarification'?'One detail to clear up':'Let’s adjust the request'}</h3><p>{result.message}</p>
      {result.status==='ready'&&<><div className="rule-summary"><span><strong>{result.rules.reserve}%</strong>tax reserve first</span><span><strong>{result.rules.business}%</strong>business from the rest</span><span><strong>{100-result.rules.business}%</strong>personal from the rest</span></div><h3>If $100 arrives after fees…</h3><div className="split-preview">{BUCKETS.map(k=><div key={k}><span>{result.rules.names[k]}</span><strong>{money(result.preview[k])}</strong></div>)}</div><p className="small muted">No separately collected sales tax in this example. Saving changes future payments and replaces any unsaved edits below. Your saved bucket names, goals, and earlier allocations stay as they are.</p><div className="planner-actions"><button className="button primary" type="button" disabled={Boolean(busy)} onClick={()=>void save()}>{busy==='save'?<LoaderCircle className="spin" size={17}/>:<Check size={17}/>}Save this plan</button><button className="button secondary" type="button" disabled={Boolean(busy)} onClick={()=>setResult(null)}>Discard suggestion</button></div></>}
    </div>}
    <p className="small muted planner-footnote">Choose your own tax reserve percentage. The planner does not calculate taxes owed or move money.</p>
  </section>;
}
