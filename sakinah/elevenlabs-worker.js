// Cloudflare Worker: ElevenLabs-only English speech for Sakinah.
// Required secret: ELEVENLABS_API_KEY (never put it in public HTML).
// Optional env var: ALLOWED_ORIGIN (defaults to the GitHub Pages origin).
const VOICE_ID = "WQhVGGVQ8EhNpBYHFE8c";
export default {
 async fetch(request, env) {
  const allowed = env.ALLOWED_ORIGIN || "https://anesthesiologist20.github.io";
  const origin = request.headers.get("Origin") || "";
  const headers = {"Access-Control-Allow-Origin": allowed,"Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin"};
  if (origin !== allowed) return new Response("Origin not allowed",{status:403});
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
  if(request.method!=="POST" || new URL(request.url).pathname!=="/tts")return new Response("Not found",{status:404,headers});
  if(!env.ELEVENLABS_API_KEY)return new Response("ElevenLabs API key is not configured",{status:503,headers});
  try {
   const {text,speed}=await request.json();
   if(typeof text!=="string" || !text.trim() || text.length>500)return new Response("Invalid text",{status:400,headers});
   const s=Math.max(0.7,Math.min(1,Number(speed)||0.8));
   const response=await fetch("https://api.elevenlabs.io/v1/text-to-speech/"+VOICE_ID,{
    method:"POST",headers:{"xi-api-key":env.ELEVENLABS_API_KEY,"Content-Type":"application/json","Accept":"audio/mpeg"},
    body:JSON.stringify({text,model_id:"eleven_multilingual_v2",voice_settings:{stability:0.55,similarity_boost:0.78,speed:s}})
   });
   if(!response.ok)return new Response("ElevenLabs error: "+response.status,{status:502,headers});
   return new Response(response.body,{status:200,headers:{...headers,"Content-Type":"audio/mpeg","Cache-Control":"private, max-age=3600"}});
  }catch(e){return new Response("Voice request failed",{status:500,headers})}
 }
};
