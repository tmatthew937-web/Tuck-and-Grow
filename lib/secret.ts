async function encryptionKey(hex:string){
  if(typeof hex!=='string'||!/^[a-f0-9]{64}$/.test(hex))throw new Error('Secure connection storage is not ready yet.');
  return crypto.subtle.importKey('raw',new Uint8Array(hex.match(/.{2}/g)!.map(h=>parseInt(h,16))),{name:'AES-GCM'},false,['encrypt','decrypt']);
}
export async function sealSecret(value:string,hex:string,audience:string){
  const nonce=crypto.getRandomValues(new Uint8Array(12));
  const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce,additionalData:new TextEncoder().encode(audience)},await encryptionKey(hex),new TextEncoder().encode(value));
  const bytes=new Uint8Array(12+encrypted.byteLength);bytes.set(nonce);bytes.set(new Uint8Array(encrypted),12);
  return btoa(String.fromCharCode(...bytes));
}
export async function openSecret(packed:string,hex:string,audience:string){
  const bytes=Uint8Array.from(atob(packed),v=>v.charCodeAt(0));
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(0,12),additionalData:new TextEncoder().encode(audience)},await encryptionKey(hex),bytes.slice(12));
  return new TextDecoder().decode(plain);
}
