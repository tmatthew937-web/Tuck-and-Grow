'use client';
import {useState} from 'react';
import {Link2,LoaderCircle} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';

export default function AIConnection({configured,onSaved}:{configured:boolean;onSaved:()=>Promise<unknown>}){
  const[open,setOpen]=useState(false),[key,setKey]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function save(e:React.FormEvent){
    e.preventDefault();setBusy(true);setError('');
    try{
      const response=await fetch('/api/ai/connection',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({apiKey:key})});
      const data:any=await response.json();if(!response.ok)throw new Error(data.error||'Could not connect OpenAI.');
      setKey('');setOpen(false);await onSaved();
    }catch(e:any){setError(e.message||'Could not connect OpenAI.');}
    finally{setBusy(false);}
  }
  return <>
    <div className="connection-row"><strong>AI money planner</strong><span className="pill">{configured?'Connected':'Not connected'}</span></div>
    <button className="button secondary" onClick={()=>{setError('');setKey('');setOpen(true);}}>{configured?'Update OpenAI connection':'Connect OpenAI'}</button>
    <p className="small muted">Use your own API key to activate the planner. OpenAI API usage is billed to your OpenAI account.</p>
    <Dialog open={open} onOpenChange={value=>{if(busy)return;setOpen(value);if(!value){setKey('');setError('');}}}>
      <DialogContent className="budget-dialog"><DialogHeader><DialogTitle>Connect your AI planner</DialogTitle><DialogDescription>Enter the OpenAI API key you created. We’ll make one small test request, then encrypt the key before saving it privately to your account.</DialogDescription></DialogHeader>
        <form onSubmit={save}><label className="field" htmlFor="openai-key">OpenAI API key<input id="openai-key" name="openai-api-key" type="password" autoComplete="new-password" autoCapitalize="none" spellCheck={false} maxLength={512} value={key} onChange={e=>setKey(e.target.value)} disabled={busy} required/></label>
          <p className="small muted">The test and future suggestions use your OpenAI API credits. Connecting does not change your budget rules. <a className="text-button" href="https://platform.openai.com/settings/organization/billing/overview" target="_blank" rel="noopener noreferrer">Check OpenAI API billing</a></p>
          {error&&<p role="alert" className="planner-error">{error}</p>}
          <button className="button primary full" disabled={busy||!key.trim()} type="submit">{busy?<LoaderCircle className="spin" size={17}/>:<Link2 size={17}/>} {busy?'Checking your connection…':'Check and connect'}</button>
        </form>
      </DialogContent>
    </Dialog>
  </>;
}
