#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const sections={v:12,f:10,p:8,r:9,w:6};
const required=['Guide p1','Guide p2','AB p14','AB p15','AB p22','AB p23','AB p24','AB p25','AB p26','AB p27'];
const seen=new Map();
let total=0;
for(const id of ['a','b','c']){
  const filename=path.join(root,'aboud','midterm-form-'+id+'.js');
  const script=fs.readFileSync(filename,'utf8');
  const match=script.match(/\.push\(([\s\S]*)\);\s*$/);
  assert.ok(match,'Missing JSON question payload for form '+id);
  const form=JSON.parse(match[1]);
  assert.equal(form.id,id);
  assert.equal(form.questions.length,45,'45 MCQs required in '+id);
  const tally=Object.fromEntries(Object.keys(sections).map(s=>[s,0]));
  const sources=new Set();
  for(const [index,q] of form.questions.entries()){
    const key=q.prompt.toLowerCase().replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
    assert.ok(key.length>10,'Too short question '+id+':'+index);
    assert.ok(!seen.has(key),'Repeated question stem: '+key+' in '+seen.get(key)+' and '+id+':'+index);
    seen.set(key,id+':'+index);
    assert.ok(q.section in tally,'Unsupported category '+id+':'+index);
    tally[q.section]++;
    assert.ok(Array.isArray(q.choices)&&q.choices.length===4,'Four options required '+id+':'+index);
    assert.equal(new Set(q.choices.map(c=>c.toLowerCase().trim())).size,4,'Distinct options required '+id+':'+index);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,'Invalid answer '+id+':'+index);
    assert.ok(typeof q.explanation==='string'&&q.explanation.length>12,'Missing explanation '+id+':'+index);
    assert.ok(required.includes(q.source),'Unsupported source '+id+':'+index);
    sources.add(q.source);
  }
  assert.deepEqual(tally,sections,'Uneven coverage for model '+id);
  for(const source of required)assert.ok(sources.has(source),id+' does not cover '+source);
  total+=form.questions.length;
  console.log('✓ Agent '+id.toUpperCase()+': 45 distinct, validated questions · all ten required page references.');
}
assert.equal(total,135);
const page=fs.readFileSync(path.join(root,'aboud','midterm-triple-challenge.html'),'utf8');
for(const name of ['midterm-form-a.js','midterm-form-b.js','midterm-form-c.js','midterm-challenge-app.js'])assert.ok(page.includes(name),'HTML is missing '+name);
const hub=fs.readFileSync(path.join(root,'aboud','index.html'),'utf8');
assert.ok(hub.includes('href="midterm-triple-challenge.html"'),'Missing Aboud landing page link');
console.log('✓ Three-way editorial checks and page integration passed: '+total+' questions.');
