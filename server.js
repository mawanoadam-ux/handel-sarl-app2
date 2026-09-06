import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const app=express(); app.use(express.json({limit:'1mb'})); app.use(express.static('public'));
const port=process.env.PORT||3000;
const admin=process.env.ADMIN_EMAIL||'handelsa77@gmail.com';
function ref(){return 'HS-'+Math.floor(100000+Math.random()*900000)}
function esc(s=''){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function transporter(){if(!process.env.SMTP_HOST)return null; return nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:String(process.env.SMTP_SECURE)==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}})}
let waIndex=0;
async function sendWhatsApp(text){
 if(!process.env.WHATSAPP_TOKEN||!process.env.WHATSAPP_PHONE_NUMBER_ID||!process.env.WHATSAPP_RECIPIENT) return {sent:false,reason:'not_configured'};
 const recipients=process.env.WHATSAPP_RECIPIENT.split(',').map(x=>x.trim()).filter(Boolean);
 if(!recipients.length) return {sent:false,reason:'not_configured'};
 const recipient=recipients[waIndex++ % recipients.length];
 const r=await fetch(`https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,{method:'POST',headers:{Authorization:`Bearer ${process.env.WHATSAPP_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to:recipient,type:'text',text:{body:text}})});
 return {sent:r.ok,status:r.status};
}
app.post('/api/requests',async(req,res)=>{
 const d=req.body||{}; const reference=ref(); const receivedAt=new Date().toISOString();
 const text=`NOUVELLE DEMANDE HANDEL SARL\nRéférence: ${reference}\nService: ${d.service||'-'}\nClient: ${d.name||'-'}\nTéléphone: ${d.phone||'-'}\nEmail: ${d.email||'-'}\nVille/Zone: ${d.location||'-'}\nBudget: ${d.budget||'-'}\nDélai souhaité: ${d.responseTime || d.responseDelay||'-'}\nDescription: ${d.description||'-'}`;
 let emailSent=false, whatsappSent=false;
 try{const t=transporter(); if(t){await t.sendMail({from:process.env.FROM_EMAIL||admin,to:admin,replyTo:d.email||undefined,subject:`[${reference}] Nouvelle demande — ${d.service||'Handel Sarl'}`,text,html:`<h2>Nouvelle demande Handel Sarl</h2><p><b>Référence:</b> ${esc(reference)}</p><p><b>Service:</b> ${esc(d.service)}</p><p><b>Client:</b> ${esc(d.name)}</p><p><b>Téléphone:</b> ${esc(d.phone)}</p><p><b>Email:</b> ${esc(d.email)}</p><p><b>Zone:</b> ${esc(d.location)}</p><p><b>Budget:</b> ${esc(d.budget)}</p><p><b>Délai:</b> ${esc(d.responseTime || d.responseDelay)}</p><p><b>Description:</b><br>${esc(d.description).replace(/\n/g,'<br>')}</p>`});emailSent=true;}}
 catch(e){console.error('Email error',e.message)}
 try{const w=await sendWhatsApp(text); whatsappSent=w.sent;}catch(e){console.error('WhatsApp error',e.message)}
 res.json({ok:true,reference,receivedAt,emailSent,whatsappSent,serverConfigured:!!transporter()});
});
app.get('/api/health',(req,res)=>res.json({ok:true,emailConfigured:!!transporter(),whatsappConfigured:!!(process.env.WHATSAPP_TOKEN&&process.env.WHATSAPP_PHONE_NUMBER_ID&&process.env.WHATSAPP_RECIPIENT)}));
app.get(/.*/,(req,res)=>res.sendFile(process.cwd()+'/public/index.html'));
app.listen(port,()=>console.log(`Handel Sarl V2 running on http://localhost:${port}`));
