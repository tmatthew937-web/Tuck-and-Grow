import test from 'node:test';
import assert from 'node:assert/strict';
import {sealSecret,openSecret} from '../lib/secret.ts';

const hex='ab'.repeat(32);
test('encrypted keys round-trip only for the correct user and connection purpose',async()=>{
  const value='synthetic-test-secret';
  const encrypted=await sealSecret(value,hex,'openai:user-one');
  assert.notEqual(encrypted,value);assert.ok(!encrypted.includes(value));
  assert.equal(await openSecret(encrypted,hex,'openai:user-one'),value);
  await assert.rejects(openSecret(encrypted,hex,'openai:user-two'));
  await assert.rejects(openSecret(encrypted,hex,'paypal:user-one'));
  await assert.rejects(openSecret(encrypted,'cd'.repeat(32),'openai:user-one'));
});
test('fresh nonces prevent identical ciphertext; tampering is detected',async()=>{
  const first=await sealSecret('synthetic-secret',hex,'openai:user');
  const second=await sealSecret('synthetic-secret',hex,'openai:user');assert.notEqual(first,second);
  const bytes=Uint8Array.from(atob(first),c=>c.charCodeAt(0));bytes[15]^=1;
  await assert.rejects(openSecret(btoa(String.fromCharCode(...bytes)),hex,'openai:user'));
});
