import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const agaveDir = path.join(root, 'public/assets/agave');

function toDataUri(filename, mime = 'image/jpeg') {
  const buf = fs.readFileSync(path.join(agaveDir, filename));
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const marbleUri = toDataUri('marble.jpg');
const purpose1Uri = toDataUri('purpose-1.jpg');
const purpose2Uri = toDataUri('purpose-2.jpg');
const draLysanneUri = toDataUri('dra-lysanne.jpg');
const drHenriqueUri = toDataUri('dr-henrique.jpg');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0a0d0b">
<title>Agavê Saúde e Performance | Rio Claro</title>
<meta name="description" content="Clínica multidisciplinar em Rio Claro. Cardiologia, emagrecimento, nutrição, performance e estética avançada com cuidado individualizado.">
<meta property="og:title" content="Agavê Saúde e Performance | Rio Claro">
<meta property="og:description" content="Uma nova forma de viver a sua melhor versão. Medicina, nutrição, performance e estética em Rio Claro.">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;500&family=Jost:wght@300;400&display=swap" rel="stylesheet">
<style>
:root{color-scheme:dark;--bg:#0a0d0b;--bg2:#101812;--ink:#ece5d4;--mute:#a9b3a6;--gold:#c2a15f;--green:#2fb84f;--sage:#7f9c8b;--line:rgba(194,161,95,.28);
--serif:"Cormorant Garamond",Georgia,serif;--sans:"Jost",system-ui,sans-serif;
--marble:url("${marbleUri}");
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
html{scroll-behavior:smooth;scroll-padding-top:env(safe-area-inset-top,0px);overflow-x:clip;max-width:100%}
*,*::before,*::after{box-sizing:inherit}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-weight:300;line-height:1.7;font-size:17px;overflow-x:clip;max-width:100%}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--gold);outline-offset:4px}
nav{position:fixed;top:0;left:0;right:0;z-index:10;display:flex;justify-content:space-between;align-items:center;padding:calc(18px + env(safe-area-inset-top,0px)) 5vw 18px;background:linear-gradient(var(--bg) 70%,rgba(10,13,11,0))}
.logo{font-family:var(--serif);font-size:1.5rem;letter-spacing:.12em}
nav a.cta{font-size:.85rem;letter-spacing:.14em;border:1px solid var(--gold);padding:10px 22px;transition:.4s}
nav a.cta:hover{background:var(--gold);color:var(--bg)}
.hero{min-height:100svh;display:grid;place-items:center;text-align:center;padding:120px 6vw 80px;position:relative;overflow:hidden;
background:radial-gradient(520px circle at var(--x,50%) var(--y,40%),rgba(47,184,79,.18),transparent 60%),radial-gradient(900px at 50% 120%,#0f3a1c,transparent)}
.hero h1{font-family:var(--serif);font-weight:300;font-size:clamp(3rem,10vw,8rem);line-height:.95;margin:0;letter-spacing:.02em}
.hero h1 span{display:block;background:linear-gradient(100deg,var(--ink) 40%,var(--gold) 50%,var(--ink) 60%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sheen 4.5s ease-out 1s 1 both}
@keyframes sheen{from{background-position:100% 0}to{background-position:0 0}}
.hero p{max-width:34ch;margin:32px auto;color:var(--mute);font-size:1.15rem}
.btn{display:inline-block;border:1px solid var(--gold);padding:15px 38px;letter-spacing:.12em;font-size:.9rem;transition:.4s}
.btn:hover{background:var(--gold);color:var(--bg)}
section{padding:clamp(80px,12vw,160px) 6vw}
.wrap{max-width:1100px;margin:0 auto}
h2{font-family:var(--serif);font-weight:300;font-size:clamp(2rem,5vw,3.6rem);line-height:1.1;margin:0 0 28px}
.about{display:grid;gap:48px;grid-template-columns:1fr;text-align:center}
.about p{color:var(--mute);max-width:52ch;margin:0 auto 18px}
.team{background:var(--bg2)}
.docs{display:grid;gap:56px;grid-template-columns:1fr}
.vid{position:relative;aspect-ratio:4/4.4;background:linear-gradient(160deg,#0f3a1c,#070a08);border:1px solid var(--line);overflow:hidden;display:grid;place-items:center}
.docs h3{font-family:var(--serif);font-weight:500;font-size:2rem;margin:20px 0 2px}
.docs p{margin:0;color:var(--mute)}
.final{text-align:center}
.final h2{max-width:16ch;margin:0 auto 36px}
footer{padding:40px 6vw;text-align:center;color:var(--mute);font-size:.85rem;border-top:1px solid var(--line)}
.reveal{opacity:0;transform:translateY(28px);transition:opacity 1.2s ease,transform 1.2s ease}
.reveal.in{opacity:1;transform:none}
@media(min-width:860px){.docs{grid-template-columns:1fr 1fr}.docs>article:nth-child(2){margin-top:90px}}
@media(prefers-reduced-motion:reduce){.ring,.led,.scene .v,.par img,.track,.prog,.spin,.spin2 i,.hv,.gcard,.base{animation:none}.frame{clip-path:none;transition:none}.hero h1 span{animation:none;color:var(--ink);background:none}.reveal{opacity:1;transform:none;transition:none}html{scroll-behavior:auto}}
.led{height:2px;background:linear-gradient(90deg,transparent,var(--green),var(--gold),var(--green),transparent);box-shadow:0 0 14px var(--green),0 0 44px rgba(47,184,79,.6);animation:ledpulse 3s ease-in-out infinite}
@keyframes ledpulse{50%{opacity:.55}}
.btn:hover,nav a.cta:hover{box-shadow:0 0 22px rgba(194,161,95,.6)}
.tilt{transform-style:preserve-3d;transition:transform .25s ease;will-change:transform}
#dust{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:5}
.hero>div{position:relative;z-index:1}
.prog{position:fixed;top:0;left:0;height:3px;width:0;z-index:20;background:linear-gradient(90deg,var(--green),var(--gold));box-shadow:0 0 12px var(--green)}
.pair{display:grid;gap:32px;margin-top:48px}
.frame{position:relative;overflow:hidden;aspect-ratio:4/5;border:1px solid var(--line);clip-path:inset(0 0 100% 0);transition:clip-path 1.8s cubic-bezier(.77,0,.18,1)}
.frame.in{clip-path:inset(0)}
.par{position:absolute;inset:-10% 0;will-change:transform}
.par img{width:100%;height:100%;object-fit:cover;display:block;animation:kb 24s ease-in-out infinite alternate}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.09)}}
.frame::after,.vid::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 40%,rgba(255,255,255,.16) 50%,transparent 60%);transform:translateX(-130%);transition:transform 1.2s}
.frame:hover::after,.vid:hover::after{transform:translateX(130%)}
.vid img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(var(--z,1));transition:transform .2s linear}
.vid:hover img{transform:scale(calc(var(--z,1)*1.05))}
.marq{overflow:hidden;border-block:1px solid var(--line);padding:22px 0;background:var(--bg2)}
.track{display:flex;width:max-content;animation:marq 38s linear infinite}
.track span{font-family:var(--serif);font-size:clamp(1.6rem,4vw,2.6rem);font-weight:300;padding:0 28px;white-space:nowrap}
.track span::after{content:"";display:inline-block;width:7px;height:7px;margin-left:56px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 10px var(--gold);vertical-align:middle}
@keyframes marq{to{transform:translateX(-50%)}}
@media(min-width:860px){.pair{grid-template-columns:1fr 1fr;gap:56px}.pair .frame:nth-child(2){margin-top:120px}}
#intro{position:fixed;inset:0;z-index:100;animation:gone 0s 9.6s forwards}
@keyframes gone{to{visibility:hidden;pointer-events:none}}
#intro .h{position:absolute;inset:0;will-change:transform;background:radial-gradient(ellipse at center,transparent 25%,rgba(0,0,0,.72)),var(--marble) center/cover,#040605}
#intro .h::after{content:"";position:absolute;top:0;bottom:0;left:0;width:40%;background:linear-gradient(115deg,transparent,rgba(255,255,255,.09),transparent);transform:translateX(-120%);animation:shine 6s ease-in-out infinite;will-change:transform}
@keyframes shine{to{transform:translateX(300%)}}
#intro .hl{clip-path:polygon(0 0,50% 0,53% 12%,48% 25%,54% 38%,47% 52%,53% 66%,48% 80%,52% 92%,50% 100%,0 100%);animation:sl 2.4s cubic-bezier(.7,0,.2,1) 7s forwards}
#intro .hr{clip-path:polygon(50% 0,100% 0,100% 100%,50% 100%,52% 92%,48% 80%,53% 66%,47% 52%,54% 38%,48% 25%,53% 12%);animation:sr 2.4s cubic-bezier(.7,0,.2,1) 7s forwards}
@keyframes sl{to{transform:translateX(-105%)}}@keyframes sr{to{transform:translateX(105%)}}
#intro .fr{position:absolute;inset:22px;border:1px solid rgba(194,161,95,.4);z-index:2;pointer-events:none;animation:fadeo 1.2s 6.8s forwards}
#intro .ck{position:absolute;inset:0;width:100%;height:100%;z-index:2;overflow:visible}
#intro .ck polyline{fill:none;stroke:var(--gold);stroke-width:2;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.2s ease-in 6.4s forwards,fadeo .8s 7.8s forwards}
#intro .ck polyline.gl{stroke:var(--green);stroke-width:9;opacity:.3}
#intro .il{position:absolute;inset:0;z-index:3;display:grid;place-items:center;align-content:center;will-change:transform;animation:zoom 1.9s cubic-bezier(.6,0,.3,1) 7s forwards}
@keyframes zoom{to{transform:scale(4);opacity:0}}
#intro .pl{position:absolute;left:0;width:100%;top:50%;height:140px;margin-top:-70px}
#intro .pl path{fill:none;stroke:var(--green);stroke-width:2.5;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 2.2s ease-out .5s forwards,fadeo .9s 2.9s forwards}
#intro .pl path.gl{stroke-width:10;opacity:.22}
#intro .vl{width:min(150px,34vw)}
#intro .vl path{fill:var(--green);fill-opacity:0;fill-rule:evenodd;stroke:var(--green);stroke-width:2;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 2s ease-in-out 2.8s forwards,fillin 1.6s ease 4.6s forwards}
#intro .it{font-family:var(--serif);font-size:clamp(2rem,7vw,3.6rem);color:var(--gold);margin-top:18px;opacity:0;letter-spacing:.28em;transform:scale(1.25);text-shadow:0 0 18px rgba(194,161,95,.6);animation:tin 2s ease-out 4.4s forwards}
#intro .is{font-size:.72rem;letter-spacing:.3em;color:var(--mute);opacity:0;animation:tin 1.6s ease-out 5.6s forwards}
@keyframes tin{to{opacity:1;transform:none}}
@keyframes draw{to{stroke-dashoffset:0}}@keyframes fadeo{to{opacity:0}}@keyframes fillin{to{fill-opacity:.95}}
#skip{position:absolute;z-index:4;bottom:calc(36px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);background:none;border:1px solid var(--line);color:var(--mute);padding:8px 22px;font:inherit;font-size:.8rem;letter-spacing:.16em;cursor:pointer}
.tw{min-height:2.9em}.cur{display:inline-block;width:2px;height:1.1em;margin-left:4px;background:var(--green);box-shadow:0 0 10px var(--green);vertical-align:text-bottom;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
@media(prefers-reduced-motion:reduce){#intro{display:none}.cur{animation:none}}
.links{display:none;gap:32px;font-size:.78rem;letter-spacing:.14em}.links a{opacity:.8;transition:.3s}.links a:hover{opacity:1;color:var(--gold)}
.hero::before{content:"";position:absolute;inset:0;background:radial-gradient(700px 420px at 78% 72%,rgba(194,161,95,.15),transparent 70%);pointer-events:none}
.hgrid{display:grid;gap:30px;align-items:center;width:100%;max-width:1250px;margin:0 auto;text-align:left}
.hvis{order:-1;width:100%}
.hero h1.big{font-size:clamp(2.5rem,6vw,5rem);line-height:1.05;letter-spacing:0}
.hero h1.big em{font-style:normal;color:var(--gold);text-shadow:0 0 30px rgba(194,161,95,.4)}
.hero .htext p{margin:26px 0 34px;max-width:36ch}
.orbwrap{perspective:1100px}
.orbbox{--k:1;position:relative;width:calc(400px*var(--k));height:calc(400px*var(--k));margin:0 auto;transform-style:preserve-3d;transform:rotateY(var(--ry,0deg)) rotateX(var(--rx,0deg));transition:transform .5s}
.orb{position:absolute;top:0;left:0;width:400px;height:400px;transform-origin:0 0;transform:scale(var(--k));transform-style:preserve-3d}
.core{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(194,161,95,.35);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.22),rgba(47,184,79,.28) 32%,rgba(4,26,12,.55) 68%,rgba(47,184,79,.38));box-shadow:inset 0 0 60px rgba(47,184,79,.5),0 0 90px rgba(47,184,79,.35)}
.spin{position:absolute;inset:0;transform-style:preserve-3d;animation:orb 26s linear infinite}
@keyframes orb{from{transform:rotateX(-18deg) rotateY(0)}to{transform:rotateX(-18deg) rotateY(360deg)}}
.spin i,.spin2 i{position:absolute;inset:0;border-radius:50%;border:2px solid var(--green);box-shadow:0 0 12px var(--green),inset 0 0 12px rgba(47,184,79,.4)}
.spin .m1{transform:rotateY(45deg);border-color:var(--gold);box-shadow:0 0 12px var(--gold),inset 0 0 12px rgba(194,161,95,.35)}
.spin .m2{transform:rotateY(90deg)}
.spin .m3{transform:rotateY(135deg);border-color:var(--gold);box-shadow:0 0 12px var(--gold),inset 0 0 12px rgba(194,161,95,.35)}
.spin .eq{transform:rotateX(90deg);border-color:var(--gold);box-shadow:0 0 14px var(--gold)}
.spin .la{transform:rotateX(90deg) translateZ(100px) scale(.866);border-width:1px}
.spin .lb{transform:rotateX(90deg) translateZ(-100px) scale(.866);border-width:1px}
.spin2{position:absolute;inset:-10%;transform:rotateX(70deg) rotateY(-16deg);transform-style:preserve-3d}
.spin2 i{border:1.5px solid var(--gold);box-shadow:0 0 14px var(--gold);animation:rz 9s linear infinite}
.spin2 i+i{inset:7%;border-color:var(--green);box-shadow:0 0 14px var(--green);animation-duration:13s;animation-direction:reverse}
.spin2 i::after{content:"";position:absolute;top:-5px;left:50%;width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 14px 4px var(--gold)}
@keyframes rz{to{transform:rotateZ(360deg)}}
.hv{position:absolute;inset:0;display:flex;justify-content:center;align-items:center;font-family:var(--serif);font-size:64px;letter-spacing:.06em;color:var(--green);text-shadow:0 0 12px var(--green),0 0 40px rgba(47,184,79,.7);animation:flicker 5s infinite;transform:translateZ(1px)}
.hv .g{color:var(--gold);text-shadow:0 0 12px var(--gold),0 0 40px rgba(194,161,95,.7)}
@keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.55}94%{opacity:1}96%{opacity:.7}97%{opacity:1}}
.base{width:min(380px,80%);height:56px;margin:-6px auto 0;border-radius:50%;border:1px solid var(--line);background:radial-gradient(ellipse,rgba(47,184,79,.5),rgba(194,161,95,.15) 50%,transparent 72%);animation:ledpulse 4s ease-in-out infinite}
.words{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 28px;margin:30px 0 0;padding:0;list-style:none;font-size:.82rem;letter-spacing:.2em;color:var(--mute)}
.spec .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:20px;margin-top:56px}
.gcard{position:relative;padding:34px 20px 30px;text-align:center;border:1px solid var(--line);border-radius:6px;background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.012));backdrop-filter:blur(6px);animation:cglow 5s ease-in-out infinite;cursor:pointer;transition:border-color .35s ease,transform .25s ease}
.gcard:hover{border-color:var(--gold)}
.gcard:nth-child(2){animation-delay:1s}.gcard:nth-child(3){animation-delay:2s}.gcard:nth-child(4){animation-delay:3s}.gcard:nth-child(5){animation-delay:4s}
@keyframes cglow{50%{box-shadow:0 0 32px rgba(194,161,95,.22)}}
.gcard svg{width:64px;height:64px;margin:0 auto 18px;display:block;fill:none;stroke:var(--gold);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 6px rgba(194,161,95,.6))}
.gcard svg *{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 2.4s ease .3s}
.cards.in .gcard svg *{stroke-dashoffset:0}
.gcard h3{font-family:var(--serif);font-weight:500;font-size:1.45rem;margin:0 0 8px}
.gcard p{margin:0;color:var(--mute);font-size:.92rem;line-height:1.55}
.plinth{width:min(760px,92%);height:50px;margin:56px auto 0;border-radius:50%;border:1px solid var(--line);background:radial-gradient(ellipse,rgba(47,184,79,.35),transparent 70%);box-shadow:0 0 40px rgba(47,184,79,.22)}
@media(max-width:520px){.orbbox{--k:.78}}@media(max-width:380px){.orbbox{--k:.68}}
@media(min-width:860px){.links{display:flex}.spec .gcard:nth-child(even){margin-top:30px}}
@media(min-width:960px){.hgrid{grid-template-columns:1.05fr 1fr}.hvis{order:0}}
html.intro .spin,html.intro .spin2 i,html.intro .hv,html.intro .gcard,html.intro .base{animation-play-state:paused}
.gl .orb{display:none}.orbbox.gl{transform:none!important}
.hvis{transform:translateY(calc(var(--sp,0)*90px)) scale(calc(1 - var(--sp,0)*.3));opacity:calc(1 - var(--sp,0)*.95);will-change:transform,opacity}
.htext{transform:translateY(calc(var(--sp,0)*-70px));opacity:calc(1 - var(--sp,0)*1.2);will-change:transform,opacity}
.sstory{position:relative;height:420vh}
.sstage{position:sticky;top:0;height:100svh;display:grid;place-items:center;text-align:center;overflow:hidden}
.sglow{position:absolute;inset:0;background:radial-gradient(600px circle at 50% 50%,rgba(47,184,79,.14),transparent 70%);pointer-events:none}
.sp{position:absolute;left:6vw;right:6vw;font-family:var(--serif);font-weight:300;font-size:clamp(2.4rem,9vw,7.5rem);line-height:1.05;opacity:0;will-change:transform,opacity}
.sp em{font-style:normal;color:var(--gold);text-shadow:0 0 40px rgba(194,161,95,.45)}
.sdots{position:absolute;bottom:calc(8vh + env(safe-area-inset-bottom,0px));display:flex;gap:14px}
.sdots i{width:34px;height:2px;background:rgba(194,161,95,.25);transition:.5s}
.sdots i.on{background:var(--gold);box-shadow:0 0 12px var(--gold)}
button.btn{background:none;color:var(--ink);font:inherit;font-size:.9rem;letter-spacing:.12em;cursor:pointer}
.final .btn{margin:6px}
.wa{position:fixed;right:calc(18px + env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:30}
.wafab{position:relative;width:60px;height:60px;border-radius:50%;border:1px solid var(--gold);background:radial-gradient(circle at 35% 30%,#2a2415,#0a0d0b);color:var(--gold);display:grid;place-items:center;cursor:pointer;box-shadow:0 0 22px rgba(194,161,95,.35)}
.wafab::before{content:"";position:absolute;inset:-1px;border-radius:50%;border:1px solid var(--gold);animation:wap 2.4s ease-out infinite}
@keyframes wap{from{transform:scale(1);opacity:.7}to{transform:scale(1.7);opacity:0}}
.wafab svg{width:28px;height:28px}
.wapanel{position:absolute;right:0;bottom:76px;width:min(320px,calc(100vw - 36px));padding:24px;border:1px solid var(--line);border-radius:8px;background:rgba(10,13,11,.9);backdrop-filter:blur(14px);box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 40px rgba(47,184,79,.12);opacity:0;visibility:hidden;transform:translateY(14px) scale(.97);transition:.4s}
.wa.open .wapanel{opacity:1;visibility:visible;transform:none}
.wapanel h3{font-family:var(--serif);font-weight:500;font-size:1.5rem;margin:0 0 4px}
.wapanel p{margin:0 0 8px;color:var(--mute);font-size:.9rem;line-height:1.5}
.wapanel label{display:block;font-size:.8rem;color:var(--mute);margin:12px 0 6px}
.wapanel input,.wapanel select{width:100%;padding:12px;background:rgba(255,255,255,.04);border:1px solid var(--line);color:var(--ink);font:inherit;font-size:.95rem;border-radius:4px}
.wapanel select option{background:#0f1411}
.wapanel .btn{width:100%;margin-top:18px;text-align:center;padding:13px}
.wanote{margin-top:12px;font-size:.82rem;color:var(--gold)}
.wax{position:absolute;top:8px;right:12px;background:none;border:0;color:var(--mute);font-size:1.5rem;cursor:pointer}
@media(prefers-reduced-motion:reduce){.sstory{height:auto}.sstage{position:static;height:auto;display:block;padding:80px 6vw}.sp{position:static!important;opacity:1!important;transform:none!important;margin:0 0 40px}.sdots{display:none}.wafab::before{animation:none}.hvis,.htext{transform:none!important;opacity:1!important}}
#isnd{position:absolute;z-index:4;top:calc(24px + env(safe-area-inset-top,0px));right:24px;background:none;border:1px solid var(--line);color:var(--gold);padding:8px 18px;font:inherit;font-size:.78rem;letter-spacing:.16em;cursor:pointer}
#isnd:disabled{color:var(--mute);cursor:default}
.snd{position:fixed;left:calc(18px + env(safe-area-inset-left,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:30;width:46px;height:46px;border-radius:50%;border:1px solid var(--line);background:rgba(10,13,11,.7);backdrop-filter:blur(8px);color:var(--mute);display:grid;place-items:center;cursor:pointer;transition:.4s}
.snd svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.snd .w{display:none}.snd.on .w{display:block}.snd .x{display:block}.snd.on .x{display:none}
.snd.on{color:var(--gold);border-color:var(--gold);box-shadow:0 0 16px rgba(194,161,95,.35)}
.fix .par{inset:0;transform:none!important}
.fix .par img{animation:none}
.fcopy small{display:block;letter-spacing:.3em;font-size:.78rem;color:var(--gold);margin-bottom:12px}
.fcopy h2{margin-bottom:14px}
.fcopy p{margin:0;color:var(--mute);max-width:34ch}
.fcard{min-width:0;width:100%;max-width:100%;padding:28px;border:1px solid var(--line);border-radius:8px;background:rgba(10,13,11,.66);backdrop-filter:blur(14px);box-shadow:0 20px 60px rgba(0,0,0,.45),0 0 40px rgba(47,184,79,.1)}
.fcard dl{margin:0}.fcard dt{font-size:.72rem;letter-spacing:.28em;color:var(--gold);margin:0 0 4px}
.fcard dd{margin:0 0 18px}
.fcard .btns{display:flex;flex-wrap:wrap;gap:10px;width:100%}
.fcard .btn{padding:12px 20px;font-size:.82rem;text-align:center;flex:1 1 auto}
.loc{position:relative;overflow:hidden;background:linear-gradient(rgba(4,6,5,.42),rgba(4,6,5,.42)),radial-gradient(ellipse at center,transparent 25%,rgba(0,0,0,.7)),var(--marble) center/cover,#040605}
.loc::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,var(--bg),transparent 16%,transparent 84%,var(--bg))}
.n729{position:absolute;left:50%;top:50%;z-index:0;margin:0;font-family:var(--sans);font-weight:300;font-size:clamp(9rem,42vw,30rem);line-height:1;letter-spacing:.04em;color:transparent;-webkit-text-stroke:1px rgba(194,161,95,.5);white-space:nowrap;pointer-events:none;user-select:none;animation:nfloat 10s ease-in-out infinite}
@keyframes nfloat{from{transform:translate(-50%,-50%)}to{transform:translate(-50%,-47%)}}
.lin{position:relative;z-index:1;max-width:1100px;width:100%;margin:0 auto;padding:110px 6vw;display:grid;grid-template-columns:minmax(0,1fr);gap:36px;align-items:center}
.lleft{display:grid;grid-template-columns:minmax(0,1fr);gap:28px;min-width:0;width:100%}
.fmap{min-width:0;width:100%;max-width:100%;padding:14px;border:1px solid var(--line);border-radius:8px;background:rgba(5,8,6,.7);backdrop-filter:blur(10px);box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 40px rgba(194,161,95,.1)}
.fmap svg{display:block;width:100%;height:auto;border-radius:4px}
.fmap small{display:block;margin-top:8px;color:var(--mute);font-size:.72rem;letter-spacing:.12em;text-align:center}
.fmap path.l{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 2.6s ease}
.fmap.in path.l{stroke-dashoffset:0}
.fmap text{font-family:var(--sans);fill:#c2a15f;font-size:11px;letter-spacing:.12em}
.pulse{transform-box:fill-box;transform-origin:center;animation:ping 2.2s ease-out infinite}
@keyframes ping{from{transform:scale(1);opacity:.8}to{transform:scale(3.2);opacity:0}}
@media(min-width:860px){.lin{grid-template-columns:minmax(0,1fr) minmax(0,1fr);padding:130px 6vw}}
@media(prefers-reduced-motion:reduce){.fmap path.l{stroke-dashoffset:0;transition:none}.pulse,.n729{animation:none}}
.fcard dd .sub{display:block;color:var(--mute);font-size:.88rem;margin-top:2px}
.hours{list-style:none;margin:0;padding:0;font-size:.88rem;width:100%}
.hours li{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 12px;padding:7px 0;border-bottom:1px solid rgba(194,161,95,.14);color:var(--mute)}
.hours li:last-child{border:0}.hours li.today{color:var(--gold)}
.ostat{display:inline-block;margin-left:8px;letter-spacing:.04em;font-size:.74rem;color:var(--mute)}
.ostat::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;background:#777}
.ostat.on::before{background:var(--green);box-shadow:0 0 8px var(--green)}
.mvv .mv{display:grid;gap:24px;margin-top:40px}
.mvv .box{padding:34px 28px;border:1px solid var(--line);border-radius:8px;background:linear-gradient(160deg,rgba(255,255,255,.06),rgba(255,255,255,.01))}
.mvv .box small{display:block;letter-spacing:.3em;font-size:.76rem;color:var(--gold);margin-bottom:14px}
.mvv .box p{margin:0;font-family:var(--serif);font-weight:300;font-size:clamp(1.4rem,3.2vw,2rem);line-height:1.35}
.vals{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin-top:24px;background:var(--line);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.vals div{background:var(--bg);padding:28px 22px}
.vals div:last-child{grid-column:1/-1}
.vals b{display:block;font-family:var(--sans);font-weight:300;font-size:2.2rem;line-height:1;margin-bottom:12px;color:transparent;-webkit-text-stroke:1px var(--gold)}
.vals h3{font-family:var(--serif);font-weight:500;font-size:1.35rem;margin:0 0 6px}
.vals p{margin:0;color:var(--mute);font-size:.9rem;line-height:1.55}
@media(min-width:860px){.mvv .mv{grid-template-columns:1fr 1fr}.vals{grid-template-columns:repeat(5,1fr)}.vals div:last-child{grid-column:auto}}
.doc-card{position:relative;display:flex;flex-direction:column;min-width:0;width:100%}
.doc-card .vid::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(10,13,11,.98) 0%,rgba(10,13,11,.72) 8%,transparent 20%,transparent 65%,rgba(10,13,11,.85) 100%)}
.doc-meta{position:relative;z-index:2;margin:-54px 12px 0;padding:20px 22px;border:1px solid var(--line);border-radius:8px;background:rgba(10,13,11,.88);backdrop-filter:blur(14px);box-shadow:0 18px 48px rgba(0,0,0,.55)}
.doc-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:8px 14px;margin-bottom:8px}
.doc-head h3{font-family:var(--serif);font-weight:500;font-size:clamp(1.55rem,2.5vw,2.05rem);margin:0;color:var(--ink)}
.doc-crm{font-family:var(--sans);font-size:.72rem;letter-spacing:.16em;color:var(--gold);padding:4px 10px;border:1px solid rgba(194,161,95,.48);background:rgba(194,161,95,.1)}
.docs p.doc-spec{margin:0 0 10px;color:var(--gold);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase}
.docs p.doc-bio{margin:0 0 18px;color:var(--mute);font-size:.92rem;line-height:1.55}
.doc-cta{padding:11px 18px;font-size:.78rem;letter-spacing:.12em;width:100%;text-align:center}
.reviews{position:relative;background:radial-gradient(900px 420px at 50% 0%,rgba(47,184,79,.08),transparent 70%),var(--bg);border-top:1px solid rgba(194,161,95,.16)}
.rev-header{text-align:center;max-width:640px;margin:0 auto 48px}
.rev-badge{display:inline-flex;align-items:center;gap:10px;padding:6px 16px;margin-bottom:18px;border:1px solid rgba(194,161,95,.4);border-radius:4px;background:rgba(194,161,95,.07);font-size:.72rem;letter-spacing:.18em;color:var(--gold)}
.rev-stars-inline{color:var(--gold);letter-spacing:2px;font-size:.82rem}
.rev-sub{margin:0;color:var(--mute);font-size:1rem}
.rev-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:22px}
@media(min-width:680px){.rev-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1024px){.rev-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.rev-card{display:flex;flex-direction:column;justify-content:space-between;padding:28px 24px;border:1px solid var(--line);border-radius:8px;background:linear-gradient(160deg,rgba(255,255,255,.045),rgba(16,24,18,.55));backdrop-filter:blur(8px);cursor:pointer;transition:border-color .35s ease,transform .3s ease,box-shadow .35s ease}
.rev-card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.45),0 0 28px rgba(194,161,95,.14)}
.rev-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:14px}
.rev-stars{color:var(--gold);letter-spacing:3px;font-size:.9rem;text-shadow:0 0 10px rgba(194,161,95,.45)}
.rev-tag{font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);padding:3px 8px;border:1px solid rgba(194,161,95,.24);background:rgba(255,255,255,.02)}
.rev-title{font-family:var(--serif);font-weight:500;font-size:1.35rem;line-height:1.2;margin:0 0 10px;color:var(--ink)}
.rev-quote{margin:0 0 20px;color:var(--mute);font-size:.92rem;line-height:1.6;font-style:normal}
.rev-footer{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:6px 12px;padding-top:14px;border-top:1px solid rgba(194,161,95,.16)}
.rev-author{font-family:var(--serif);font-weight:500;font-size:1.1rem;color:var(--gold);letter-spacing:.03em}
.rev-cat{font-size:.74rem;letter-spacing:.08em;color:var(--mute)}
.footer-crm{margin-top:8px;font-size:.76rem;letter-spacing:.08em;color:rgba(169,179,166,.78)}
</style>
<script>try{if(sessionStorage.getItem("agv"))document.documentElement.classList.add("seen")}catch(e){}</script>
<style>html.seen #intro{display:none}</style>
</head>
<body>
<div class="prog"></div>
<canvas id="dust" aria-hidden="true"></canvas>
<div id="intro" aria-hidden="true">
  <div class="h hl"></div><div class="h hr"></div>
  <div class="fr"></div>
  <svg class="ck" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polyline class="gl" pathLength="1" points="50,0 53,12 48,25 54,38 47,52 53,66 48,80 52,92 50,100"/>
    <polyline pathLength="1" points="50,0 53,12 48,25 54,38 47,52 53,66 48,80 52,92 50,100"/>
  </svg>
  <div class="il">
    <svg class="pl" viewBox="0 0 600 120" preserveAspectRatio="none">
      <path class="gl" pathLength="1" d="M0 60H210L230 42L245 78L262 14L278 106L294 35L308 60H600"/>
      <path pathLength="1" d="M0 60H210L230 42L245 78L262 14L278 106L294 35L308 60H600"/>
    </svg>
    <svg class="vl" viewBox="0 0 120 130">
      <path pathLength="1" d="M8 10L60 120L112 10H92L60 78L28 10ZM46 10L60 40L74 10Z"/>
    </svg>
    <div class="it">AGAVÊ</div>
    <div class="is">SAÚDE E PERFORMANCE</div>
  </div>
  <button id="isnd" type="button">♪ ATIVAR SOM</button>
  <button id="skip" type="button">ENTRAR</button>
</div>
<nav>
  <a class="logo" href="#">AGAVÊ</a>
  <div class="links">
    <a href="#clinica">A clínica</a>
    <a href="#especialidades">Especialidades</a>
    <a href="#equipe">Equipe</a>
    <a href="#avaliacoes">Avaliações</a>
    <a href="#contato">Contato</a>
  </div>
  <a class="cta" href="#contato" data-wa="">Agendar consulta</a>
</nav>

<header class="hero" id="hero">
  <div class="hgrid">
    <div class="htext">
      <h1 class="big">Uma nova forma de viver a sua <em>melhor versão.</em></h1>
      <p class="tw" aria-label="Medicina de precisão em Rio Claro"><span id="tw"></span><i class="cur"></i></p>
      <a class="btn" href="#contato" data-wa="">Agendar consulta</a>
    </div>
    <div class="hvis">
      <div class="orbwrap">
        <div class="orbbox">
          <div class="orb" aria-hidden="true">
            <div class="core"></div>
            <div class="spin">
              <i></i><i class="m1"></i><i class="m2"></i><i class="m3"></i>
              <i class="eq"></i><i class="la"></i><i class="lb"></i>
            </div>
            <div class="spin2"><i></i><i></i></div>
            <div class="hv"><span class="g">H</span>V</div>
          </div>
        </div>
      </div>
      <div class="base" aria-hidden="true"></div>
      <ul class="words" aria-label="Pilares">
        <li>CIÊNCIA</li><li>CUIDADO</li><li>PERFORMANCE</li><li>LONGEVIDADE</li>
      </ul>
    </div>
  </div>
</header>
<div class="led"></div>

<section class="sstory" aria-label="Nossos valores">
  <div class="sstage">
    <div class="sglow"></div>
    <div class="sp">Ciência para <em>entender.</em></div>
    <div class="sp">Cuidado para <em>acolher.</em></div>
    <div class="sp">Performance para <em>evoluir.</em></div>
    <div class="sp">Vida para <em>aproveitar.</em></div>
    <div class="sdots" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  </div>
</section>

<section class="story">
  <div class="wrap">
    <h2 class="reveal">Transformar vidas é o nosso propósito</h2>
    <div class="pair">
      <div class="frame fix wipe" style="aspect-ratio:1009/1271"><div class="par"><img src="${purpose1Uri}" alt="Dr. Henrique Viviani e Dra. Lysanne Amorim, da Agavê"></div></div>
      <div class="frame fix wipe" style="aspect-ratio:1080/1321"><div class="par"><img src="${purpose2Uri}" alt="Dr. Henrique e Dra. Lysanne em reunião na clínica Agavê"></div></div>
    </div>
  </div>
</section>

<section id="clinica">
  <div class="wrap about">
    <div class="reveal">
      <h2>Sua saúde é o nosso plano</h2>
      <p>A Agavê é muito mais do que uma clínica multidisciplinar: somos uma equipe especializada em cuidar da sua saúde e bem-estar como um todo, de maneira individualizada e personalíssima.</p>
      <p>Um ambiente acolhedor e seguro, com equipe que ouve, acolhe e acompanha cada etapa.</p>
    </div>
  </div>
</section>

<section class="mvv" id="valores">
  <div class="wrap">
    <h2 class="reveal">Missão, visão e valores</h2>
    <div class="mv reveal">
      <div class="box">
        <small>MISSÃO</small>
        <p>Cuidar da saúde e do bem-estar de cada pessoa como um todo, de maneira individualizada e personalíssima, com ciência, acolhimento e acompanhamento próximo.</p>
      </div>
      <div class="box">
        <small>VISÃO</small>
        <p>Ser a referência em saúde, performance e longevidade na região, transformando vidas por meio da medicina de precisão e do cuidado individualizado.</p>
      </div>
    </div>
    <div class="vals reveal">
      <div><b>01</b><h3>Ciência</h3><p>Decisões baseadas em evidência e em exames.</p></div>
      <div><b>02</b><h3>Cuidado</h3><p>Escuta, acolhimento e acompanhamento em cada etapa.</p></div>
      <div><b>03</b><h3>Individualização</h3><p>Cada paciente é único e recebe um plano feito para ele.</p></div>
      <div><b>04</b><h3>Performance</h3><p>Metas claras e evolução que dá para medir.</p></div>
      <div><b>05</b><h3>Longevidade</h3><p>Saúde para viver bem hoje e nos próximos anos.</p></div>
    </div>
  </div>
</section>

<section class="spec" id="especialidades">
  <div class="wrap">
    <h2 class="reveal">Cuidado completo em todas as fases da sua vida</h2>
    <div class="cards reveal">
      <article class="gcard" data-wa="Cardiologia">
        <svg viewBox="0 0 64 64"><path pathLength="1" d="M32 54C10 38 8 22 18 14c6-5 12-2 14 4 2-6 8-9 14-4 10 8 8 24-14 40z"/><path pathLength="1" d="M16 32h10l4-8 6 16 4-8h8"/></svg>
        <h3>Cardiologia</h3>
        <p>Consultas e exames para cuidar do coração.</p>
      </article>
      <article class="gcard" data-wa="Emagrecimento">
        <svg viewBox="0 0 64 64"><path pathLength="1" d="M20 6C44 20 20 36 44 58"/><path pathLength="1" d="M44 6C20 20 44 36 20 58"/><path pathLength="1" d="M27 15h10M24 32h16M27 49h10"/></svg>
        <h3>Emagrecimento</h3>
        <p>Programa médico com acompanhamento individual.</p>
      </article>
      <article class="gcard" data-wa="Nutrição">
        <svg viewBox="0 0 64 64"><path pathLength="1" d="M32 54C26 40 26 26 32 12c6 14 6 28 0 42z"/><path pathLength="1" d="M32 54C20 48 16 36 22 24c4 6 8 16 10 30z"/><path pathLength="1" d="M32 54c12-6 16-18 10-30-4 6-8 16-10 30z"/><path pathLength="1" d="M10 56h44"/></svg>
        <h3>Nutrição</h3>
        <p>Plano alimentar pensado para a sua rotina.</p>
      </article>
      <article class="gcard" data-wa="Performance, personal e Pilates">
        <svg viewBox="0 0 64 64"><circle pathLength="1" cx="40" cy="11" r="5"/><path pathLength="1" d="M36 20l-8 12 8 6-4 16"/><path pathLength="1" d="M28 32l-12 4"/><path pathLength="1" d="M36 20l10 10 8 2"/><path pathLength="1" d="M36 38l12 8"/></svg>
        <h3>Performance</h3>
        <p>Personal e Pilates, orientados à sua meta.</p>
      </article>
      <article class="gcard" data-wa="Estética avançada">
        <svg viewBox="0 0 64 64"><path pathLength="1" d="M32 6l5 21 21 5-21 5-5 21-5-21-21-5 21-5z"/></svg>
        <h3>Estética avançada</h3>
        <p>Cuidado com a pele e a harmonia, com técnica e critério.</p>
      </article>
    </div>
    <div class="plinth" aria-hidden="true"></div>
  </div>
</section>

<div class="marq" aria-hidden="true"><div class="track">
  <span>Cardiologia</span><span>Emagrecimento</span><span>Protocolos injetáveis</span><span>Personal e Pilates</span><span>Nutrição</span><span>Estética avançada</span><span>Osteopatia</span><span>Psicologia</span>
  <span>Cardiologia</span><span>Emagrecimento</span><span>Protocolos injetáveis</span><span>Personal e Pilates</span><span>Nutrição</span><span>Estética avançada</span><span>Osteopatia</span><span>Psicologia</span>
</div></div>

<section class="team" id="equipe">
  <div class="wrap">
    <h2 class="reveal">Conheça quem cuida de você</h2>
    <div class="docs">
      <article class="doc-card reveal">
        <div class="vid"><img src="${draLysanneUri}" alt="Dra. Lysanne Amorim"></div>
        <div class="doc-meta">
          <div class="doc-head">
            <h3>Dra. Lysanne Amorim</h3>
            <span class="doc-crm">CRM-SP 153.382</span>
          </div>
          <p class="doc-spec">Clínica Médica · Emagrecimento · Saúde Integrativa · Diagnóstico por Imagem</p>
          <p class="doc-bio">Cuidado médico individualizado com foco em emagrecimento saudável, equilíbrio metabólico, saúde integrativa e diagnóstico preciso.</p>
          <button type="button" class="btn doc-cta" data-wa="Emagrecimento">Agendar com Dra. Lysanne</button>
        </div>
      </article>
      <article class="doc-card reveal">
        <div class="vid"><img src="${drHenriqueUri}" alt="Dr. Henrique Viviani"></div>
        <div class="doc-meta">
          <div class="doc-head">
            <h3>Dr. Henrique Viviani</h3>
            <span class="doc-crm">CRM-SP 153.340</span>
          </div>
          <p class="doc-spec">Cardiologia · Nutrologia · Medicina de Precisão e Performance</p>
          <p class="doc-bio">Avaliação cardiológica completa, nutrologia e protocolos personalizados para longevidade, saúde cardiovascular e alta performance.</p>
          <button type="button" class="btn doc-cta" data-wa="Cardiologia">Agendar com Dr. Henrique</button>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="reviews" id="avaliacoes">
  <div class="wrap">
    <div class="rev-header reveal">
      <div class="rev-badge">
        <span class="rev-stars-inline" aria-hidden="true">★★★★★</span>
        <span>4.9 · AVALIAÇÕES DE PACIENTES EM RIO CLARO</span>
      </div>
      <h2>Histórias reais de quem confia na Agavê</h2>
      <p class="rev-sub">Relatos de pacientes sobre o cuidado individualizado, a clareza científica e a estrutura da nossa clínica.</p>
    </div>
    <div class="rev-grid">
      <article class="rev-card reveal" data-wa="Cardiologia">
        <div class="rev-top"><span class="rev-stars" aria-label="5 de 5 estrelas">★★★★★</span><span class="rev-tag">Dr. Henrique Viviani</span></div>
        <h3 class="rev-title">Clareza científica e evolução real</h3>
        <blockquote class="rev-quote">“Atendimento impecável do início ao fim. O Dr. Henrique explica cada exame e protocolo com uma clareza rara, trazendo segurança e resultado real na saúde e na performance.”</blockquote>
        <div class="rev-footer"><strong class="rev-author">Marcelo T.</strong><span class="rev-cat">Cardiologia &amp; Performance</span></div>
      </article>
      <article class="rev-card reveal" data-wa="Emagrecimento">
        <div class="rev-top"><span class="rev-stars" aria-label="5 de 5 estrelas">★★★★★</span><span class="rev-tag">Dra. Lysanne Amorim</span></div>
        <h3 class="rev-title">Escuta humana e plano sob medida</h3>
        <blockquote class="rev-quote">“A Dra. Lysanne tem uma escuta humana e atenta a cada detalhe. O acompanhamento médico respeitou minha rotina e transformou minha disposição sem fórmulas prontas.”</blockquote>
        <div class="rev-footer"><strong class="rev-author">Carolina M.</strong><span class="rev-cat">Emagrecimento &amp; Saúde Integrativa</span></div>
      </article>
      <article class="rev-card reveal" data-wa="Outro assunto">
        <div class="rev-top"><span class="rev-stars" aria-label="5 de 5 estrelas">★★★★★</span><span class="rev-tag">Equipe Agavê</span></div>
        <h3 class="rev-title">Ambiente acolhedor e integrado</h3>
        <blockquote class="rev-quote">“A clínica é linda, extremamente organizada e transmite paz desde a recepção na Rua 2. Você sente que toda a equipe conversa entre si para cuidar de você por inteiro.”</blockquote>
        <div class="rev-footer"><strong class="rev-author">Fernanda R.</strong><span class="rev-cat">Cuidado Multidisciplinar</span></div>
      </article>
      <article class="rev-card reveal" data-wa="Performance, personal e Pilates">
        <div class="rev-top"><span class="rev-stars" aria-label="5 de 5 estrelas">★★★★★</span><span class="rev-tag">Dr. Henrique Viviani</span></div>
        <h3 class="rev-title">Resultados medidos em exames</h3>
        <blockquote class="rev-quote">“Procurei a Agavê para melhorar meu rendimento nos treinos e ajustar indicadores metabólicos. Evolução medida em números e muito profissionalismo em cada retorno.”</blockquote>
        <div class="rev-footer"><strong class="rev-author">Rodrigo S.</strong><span class="rev-cat">Nutrologia &amp; Medicina de Precisão</span></div>
      </article>
      <article class="rev-card reveal" data-wa="Nutrição">
        <div class="rev-top"><span class="rev-stars" aria-label="5 de 5 estrelas">★★★★★</span><span class="rev-tag">Equipe Agavê</span></div>
        <h3 class="rev-title">Constância e acompanhamento próximo</h3>
        <blockquote class="rev-quote">“Ter consulta médica, nutrição e Pilates alinhados no mesmo lugar fez toda a diferença para eu manter constância. Equipe super dedicada, atenciosa e pontual.”</blockquote>
        <div class="rev-footer"><strong class="rev-author">Patrícia L.</strong><span class="rev-cat">Nutrição, Personal &amp; Pilates</span></div>
      </article>
      <article class="rev-card reveal" data-wa="Cardiologia">
        <div class="rev-top"><span class="rev-stars" aria-label="5 de 5 estrelas">★★★★★</span><span class="rev-tag">Corpo Clínico Agavê</span></div>
        <h3 class="rev-title">Referência em saúde em Rio Claro</h3>
        <blockquote class="rev-quote">“Profissionais atualizados com o que há de mais sério na medicina. Saí da consulta entendendo exatamente cada etapa do meu plano de saúde. Recomendo de olhos fechados.”</blockquote>
        <div class="rev-footer"><strong class="rev-author">Eduardo V.</strong><span class="rev-cat">Diagnóstico &amp; Longevidade</span></div>
      </article>
    </div>
  </div>
</section>

<section class="loc" id="localizacao">
  <div class="n729" aria-hidden="true">729</div>
  <div class="lin">
    <div class="lleft">
      <div class="fcopy">
        <small>RIO CLARO, SP</small>
        <h2 class="reveal">Venha conhecer a Agavê</h2>
        <p>Um espaço pensado para receber você com cuidado, do primeiro passo à consulta.</p>
      </div>
      <div class="fcard reveal">
        <dl>
          <dt>ENDEREÇO</dt>
          <dd>Rua 2, 729 · Centro, Rio Claro, SP<span class="sub">Entre as avenidas 7 e 9 · CEP 13500-150</span></dd>
          <dt>HORÁRIO <span id="ostat" class="ostat"></span></dt>
          <dd>
            <ul class="hours">
              <li data-d="1-5"><span>Segunda a sexta</span><span>08:00–12:00 · 14:00–18:00</span></li>
              <li data-d="6"><span>Sábado</span><span>08:00–12:00</span></li>
              <li data-d="0"><span>Domingo</span><span>Fechada</span></li>
            </ul>
          </dd>
        </dl>
        <div class="btns">
          <a class="btn" href="https://www.google.com/maps/search/?api=1&query=Rua+2+729+Rio+Claro+SP" target="_blank" rel="noopener">Como chegar</a>
          <button class="btn" type="button" data-wa="">Agendar pelo WhatsApp</button>
        </div>
      </div>
    </div>
    <div class="fmap reveal">
      <svg viewBox="0 0 400 400" role="img" aria-label="Mapa ilustrativo: Rua 2, entre as avenidas 7 e 9">
        <rect width="400" height="400" fill="#070a08"/>
        <g fill="none" stroke="#c2a15f" stroke-linecap="round">
          <path class="l" pathLength="1" d="M20 80H380" stroke-width="1" opacity=".3" style="transition-delay:1s"/>
          <path class="l" pathLength="1" d="M20 140H380" stroke-width="1" opacity=".3" style="transition-delay:1s"/>
          <path class="l" pathLength="1" d="M20 260H380" stroke-width="1" opacity=".3" style="transition-delay:1s"/>
          <path class="l" pathLength="1" d="M20 320H380" stroke-width="1" opacity=".3" style="transition-delay:1s"/>
          <path class="l" pathLength="1" d="M60 30V370" stroke-width="1" opacity=".3" style="transition-delay:1s"/>
          <path class="l" pathLength="1" d="M330 30V370" stroke-width="1" opacity=".3" style="transition-delay:1s"/>
          <path class="l" pathLength="1" d="M20 340C120 300 200 360 380 290" stroke-width="1" opacity=".2" style="transition-delay:1s"/>
          <path class="l" pathLength="1" d="M135 30V370" stroke-width="1" opacity=".8" style="transition-delay:1.6s"/>
          <path class="l" pathLength="1" d="M255 30V370" stroke-width="1" opacity=".8" style="transition-delay:1.6s"/>
          <path class="l" pathLength="1" d="M20 200H380" stroke-width="1" opacity="1" style="transition-delay:2.2s"/>
        </g>
        <g text-anchor="middle">
          <text x="135" y="22">AV. 7</text>
          <text x="255" y="22">AV. 9</text>
          <text x="195" y="168" font-size="12">AGAVÊ</text>
        </g>
        <text x="22" y="192">RUA 2</text>
        <path d="M195 174V190" stroke="#c2a15f" stroke-width="1" fill="none"/>
        <circle class="pulse" cx="195" cy="200" r="7" fill="none" stroke="#2fb84f" stroke-width="2"/>
        <circle cx="195" cy="200" r="11" fill="#2fb84f" opacity=".22"/>
        <circle cx="195" cy="200" r="5.5" fill="#2fb84f"/>
        <path d="M368 56l-6 14h12z" fill="#c2a15f"/>
        <text x="368" y="48" text-anchor="middle">N</text>
      </svg>
      <small>Mapa ilustrativo</small>
    </div>
  </div>
</section>

<section class="final" id="contato">
  <h2 class="reveal">Seu primeiro passo começa aqui</h2>
  <button class="btn reveal" type="button" data-wa="">Agendar pelo WhatsApp</button>
  <p class="reveal" style="color:var(--mute);margin-top:28px">Rua 2, 729, entre avenidas 7 e 9 · Rio Claro, SP</p>
</section>

<button class="snd" id="snd" type="button" aria-pressed="false" aria-label="Ativar ou desativar o som">
  <svg viewBox="0 0 24 24">
    <path d="M4 9.500h3.500L12 5.500v13l-4.500-4H4z"/>
    <path class="w" d="M15.500 9a4.500 4.500 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11"/>
    <path class="x" d="M16 9.500l5 5M21 9.500l-5 5"/>
  </svg>
</button>

<div class="wa" id="wa">
  <div class="wapanel" role="dialog" aria-label="Agendar pelo WhatsApp">
    <button class="wax" type="button" aria-label="Fechar">×</button>
    <h3>Agende sua consulta</h3>
    <p>Conte o que você procura e a equipe responde pelo WhatsApp.</p>
    <label for="wn">Seu nome</label>
    <input id="wn" autocomplete="name">
    <label for="ws">Interesse</label>
    <select id="ws">
      <option>Emagrecimento</option>
      <option>Cardiologia</option>
      <option>Nutrição</option>
      <option>Performance, personal e Pilates</option>
      <option>Estética avançada</option>
      <option>Outro assunto</option>
    </select>
    <button class="btn" type="button" id="wgo">Enviar pelo WhatsApp</button>
    <div class="wanote" id="wnote" hidden></div>
  </div>
  <button class="wafab" type="button" aria-label="Agendar pelo WhatsApp" aria-expanded="false">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">
      <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z"/>
      <path fill="currentColor" stroke="none" d="M8.6 7.6c.3 2.7 3.100 5.500 5.800 5.800l1.300-1.300a.8.8 0 0 0 0-1.100l-1.200-.9a.8.8 0 0 0-1 0l-.6.500c-.9-.4-1.600-1.200-2-2.100l.5-.6a.8.8 0 0 0 0-1l-.9-1.200a.8.8 0 0 0-1.100 0z"/>
    </svg>
  </button>
</div>

<footer>
  <div>© 2026 Agavê Saúde e Performance · Rio Claro, SP · <a href="https://www.instagram.com/agavesaude/" target="_blank" rel="noopener" style="color:var(--gold)">@agavesaude</a></div>
  <div class="footer-crm">Corpo Clínico: Dra. Lysanne Amorim (CRM-SP 153.382) · Dr. Henrique Viviani (CRM-SP 153.340)</div>
</footer>

<script>
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,hero=document.getElementById('hero'),prog=document.querySelector('.prog');
let act=null,amg=null,aon=false,itTimers=[];
function auInit(){
  if(act)return;
  const C=window.AudioContext||window.webkitAudioContext;
  if(!C)return;
  act=new C();amg=act.createGain();amg.gain.value=.0001;amg.connect(act.destination);
  const f=act.createBiquadFilter();f.type='lowpass';f.frequency.value=260;f.connect(amg);
  [110,164.81,220].forEach((hz,i)=>{
    const o=act.createOscillator(),g=act.createGain();
    o.type=i<2?'sine':'triangle';o.frequency.value=hz;g.gain.value=i<2?.06:.025;
    o.connect(g);g.connect(f);o.start();
  });
}
function tone(hz,dur,vol,tp){
  if(!aon||!act)return;
  const t=act.currentTime,o=act.createOscillator(),g=act.createGain();
  o.type=tp||'sine';o.frequency.value=hz;
  g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(vol||.08,t+.03);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(amg);o.start(t);o.stop(t+dur+.05);
}
function setSnd(v){
  auInit();if(!act)return;
  if(act.state==='suspended')act.resume();
  aon=v;
  amg.gain.setTargetAtTime(v?.5:.0001,act.currentTime,.35);
  const b=document.getElementById('snd');
  b.classList.toggle('on',v);b.setAttribute('aria-pressed',v);
  if(v)tone(528,.7,.07,'triangle');
}
function auIntro(){
  setSnd(true);
  const b=document.getElementById('isnd');
  if(b){b.textContent='♪ SOM ATIVO';b.disabled=true}
  [[700,65,26,.16],[920,55,22,.11],[1500,65,26,.18],[1720,55,22,.12],[2300,880,18,.08],[4400,220,160,.09],[4400,330,160,.07],[4400,440,180,.07],[6400,92,45,.15]].forEach(s=>{
    itTimers.push(setTimeout(()=>tone(s[1],s[2]/100,s[3]),s[0]));
  });
}
document.getElementById('snd').onclick=()=>setSnd(!aon);
const isb=document.getElementById('isnd');if(isb)isb.onclick=auIntro;
document.addEventListener('visibilitychange',()=>{if(act&&aon)document.hidden?act.suspend():act.resume()});
hero.addEventListener('pointermove',e=>{
  const r=hero.getBoundingClientRect();
  hero.style.setProperty('--x',(e.clientX-r.left)+'px');
  hero.style.setProperty('--y',(e.clientY-r.top)+'px');
  if(!rm){
    const ow=hero.querySelector('.orbbox');
    if(ow){
      ow.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*26+'deg');
      ow.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*20+'deg');
    }
  }
});
if(!rm)document.querySelectorAll('.vid,.gcard').forEach(el=>{
  el.classList.add('tilt');
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=\`perspective(700px) rotateY(\${x*12}deg) rotateX(\${-y*12}deg)\`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});
function typeH(el){
  if(el.dataset.typed)return;el.dataset.typed=1;
  const t=el.textContent;let i=0;el.setAttribute('aria-label',t);
  (function n(){el.innerHTML=t.slice(0,i)+'<span style="opacity:0">'+t.slice(i)+'</span>';if(i++<t.length)setTimeout(n,32)})();
}
const io=new IntersectionObserver(es=>es.forEach(x=>{
  if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);if(x.target.tagName==='H2'&&!rm)typeH(x.target)}
}),{threshold:.15});
document.querySelectorAll('.reveal,.wipe,.fmap,.cards').forEach(el=>io.observe(el));

const ss=document.querySelector('.sstory'),sps=ss?ss.querySelectorAll('.sp'):[],dots=ss?ss.querySelectorAll('.sdots i'):[];
let lastAct=-1,tk=0;
function cine(){
  const h=document.documentElement.scrollHeight-innerHeight;
  prog.style.width=(h>0?scrollY/h*100:0)+'%';
  if(!rm)document.querySelectorAll('.par').forEach(p=>{
    const r=p.parentNode.getBoundingClientRect(),c=r.top+r.height/2-innerHeight/2;
    p.style.transform=\`translateY(\${c*-.07}px)\`;
  });
  const hp=Math.min(1,Math.max(0,scrollY/(hero.offsetHeight*.85)));
  hero.style.setProperty('--sp',hp);
  if(ss&&!rm){
    const r=ss.getBoundingClientRect(),n=sps.length;
    const p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-innerHeight)));
    const f=Math.min(p*n,n-.001),actIdx=Math.floor(f);
    sps.forEach((el,i)=>{
      const l=f-i;
      let o=Math.min(l*4,(1-l)*4);
      if(i===0)o=(1-l)*4;
      if(i===n-1)o=l*4;
      o=l<0||l>1?0:Math.max(0,Math.min(1,o));
      el.style.opacity=o;
      el.style.transform=\`translateY(\${(.5-l)*70}px) scale(\${.92+.08*o})\`;
    });
    dots.forEach((d,i)=>d.classList.toggle('on',i===actIdx));
    if(actIdx!==lastAct&&p>0&&p<1)tone([261.6,329.6,392,523.2][actIdx]||440,.5,.05,'triangle');
    lastAct=actIdx;
  }
  document.querySelectorAll('.wipe:not(.in),.reveal:not(.in),.fmap:not(.in),.cards:not(.in)').forEach(el=>{
    const q=el.getBoundingClientRect();
    if(q.top<innerHeight*.88&&q.bottom>0){el.classList.add('in');io.unobserve(el);if(el.tagName==='H2'&&!rm)typeH(el)}
  });
  document.querySelectorAll('.vid').forEach(v=>{
    const q=v.getBoundingClientRect(),k=Math.min(1,Math.max(0,(innerHeight-q.top)/(innerHeight+q.height)));
    v.style.setProperty('--z',(1.18-.18*Math.min(1,k*1.6)).toFixed(3));
  });
}
addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(()=>{tk=0;cine()})}},{passive:true});
addEventListener('resize',cine);cine();

const c=document.getElementById('dust');
if(c&&!rm){
  const x=c.getContext('2d');let w,h,ps=[];
  const rs=()=>{w=c.width=innerWidth;h=c.height=innerHeight};rs();addEventListener('resize',rs);
  for(let i=0;i<42;i++)ps.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.5,v:Math.random()*.35+.1,g:Math.random()>.5});
  (function lp(){
    x.clearRect(0,0,w,h);
    ps.forEach(p=>{
      p.y-=p.v;if(p.y<0){p.y=h;p.x=Math.random()*w}
      x.beginPath();x.arc(p.x,p.y,p.r,0,6.28);
      x.fillStyle=p.g?'rgba(194,161,95,.45)':'rgba(47,184,79,.45)';
      x.shadowBlur=8;x.shadowColor=p.g?'#c2a15f':'#2fb84f';x.fill();
    });
    requestAnimationFrame(lp);
  })();
}

const tw=document.getElementById('tw'),ph=['Medicina de precisão em Rio Claro.','Emagrecimento com acompanhamento médico.','Performance conduzida com ciência.','Cuidado individual, resultado real.'];
let k=0,ch=0,del=false,tws=false;
function startTw(){
  if(tws)return;tws=true;
  if(!tw)return;
  if(rm){tw.textContent=ph[0];return}
  (function tp(){
    const s=ph[k];tw.textContent=s.slice(0,ch);
    if(!del&&ch<s.length){ch++;setTimeout(tp,55)}
    else if(!del){del=true;setTimeout(tp,1900)}
    else if(ch>0){ch--;setTimeout(tp,24)}
    else{del=false;k=(k+1)%ph.length;setTimeout(tp,300)}
  })();
}
const it=document.getElementById('intro'),sk=document.getElementById('skip');
const endI=()=>{itTimers.forEach(clearTimeout);document.documentElement.classList.remove('intro');if(it)it.remove();startTw();try{sessionStorage.setItem('agv','1')}catch(e){}};
if(document.documentElement.classList.contains('seen')||rm)endI();
else{document.documentElement.classList.add('intro');if(sk)sk.onclick=endI;setTimeout(endI,9600);setTimeout(startTw,8200)}

const wa=document.getElementById('wa'),fab=wa.querySelector('.wafab'),wn=document.getElementById('wn'),ws=document.getElementById('ws'),wnote=document.getElementById('wnote');
function togWa(o,presetInterest){
  const v=o!==undefined?o:!wa.classList.contains('open');
  if(presetInterest && ws){
    ws.value=presetInterest;
  }
  wa.classList.toggle('open',v);
  fab.setAttribute('aria-expanded',v);
  if(v){setTimeout(()=>wn.focus({preventScroll:true}),50);tone(660,.25,.05,'triangle')}
}
fab.onclick=()=>togWa();
wa.querySelector('.wax').onclick=()=>togWa(false);
document.querySelectorAll('[data-wa]').forEach(b=>b.addEventListener('click',e=>{
  e.preventDefault();
  const preset=b.getAttribute('data-wa')||'';
  togWa(true,preset||undefined);
}));
addEventListener('keydown',e=>{if(e.key==='Escape')togWa(false)});
document.getElementById('wgo').onclick=()=>{
  const n=wn.value.trim(),s=ws.value;
  const msg=\`Olá! \${n?'Meu nome é '+n+'. ':''}Gostaria de agendar uma consulta e saber mais sobre: \${s}.\`;
  const url='https://wa.me/5519983236161?text='+encodeURIComponent(msg);
  if(wnote){
    wnote.hidden=false;
    wnote.innerHTML='Mensagem preparada! <a href="'+url+'" target="_blank" rel="noopener" style="text-decoration:underline">Abrir conversa no WhatsApp</a>';
  }
  window.open(url,'_blank','noopener');
};

(function(){
  const st=document.getElementById('ostat');if(!st)return;
  const hrs=[[],[ [480,720],[840,1080] ],[ [480,720],[840,1080] ],[ [480,720],[840,1080] ],[ [480,720],[840,1080] ],[ [480,720],[840,1080] ],[ [480,720] ]];
  const dn=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const fmt=m=>String(m/60|0).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
  function up(){
    const p={};new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()).forEach(x=>p[x.type]=x.value);
    const d={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[p.weekday]??new Date().getDay();
    const m=(+p.hour%24)*60+(+p.minute||0);
    document.querySelectorAll('.hours li[data-d]').forEach(li=>{
      const r=li.dataset.d.split('-').map(Number);
      li.classList.toggle('today',r.length>1?d>=r[0]&&d<=r[1]:d===r[0]);
    });
    let op=null,nx=null;
    for(const iv of hrs[d])if(m>=iv[0]&&m<iv[1])op=iv;else if(iv[0]>m&&!nx)nx=[0,iv[0]];
    for(let k=1;k<=7&&!nx&&!op;k++){const a=hrs[(d+k)%7];if(a.length)nx=[k,a[0][0]]}
    st.classList.toggle('on',!!op);
    st.textContent=op?'Aberto agora · fecha às '+fmt(op[1]):'Fechado · abre '+(nx[0]===0?'hoje':nx[0]===1?'amanhã':dn[(d+nx[0])%7])+' às '+fmt(nx[1]);
  }
  up();setInterval(up,60000);
})();
</script>
<script type="module">
const box=document.querySelector('.orbbox');
if(box&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  try{
    const T=await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    const R=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
    R.setPixelRatio(Math.min(devicePixelRatio,2));
    R.setSize(400,400,false);
    R.toneMapping=T.ACESFilmicToneMapping;
    R.toneMappingExposure=1.25;
    Object.assign(R.domElement.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none'});
    const S=new T.Scene(),C=new T.PerspectiveCamera(36,1,.1,100);
    C.position.z=6.6;
    const pm=new T.PMREMGenerator(R),es=new T.Scene();
    const el1=new T.Mesh(new T.SphereGeometry(.6),new T.MeshBasicMaterial({color:0x6eff8f}));el1.position.set(4,4,4);
    const el2=new T.Mesh(new T.SphereGeometry(.6),new T.MeshBasicMaterial({color:0xffe29a}));el2.position.set(-4,-3,3);
    es.add(el1,el2,new T.AmbientLight(0x1b4d2a,2));
    S.environment=pm.fromScene(es,.04).texture;pm.dispose();
    const G=new T.Group(),O=new T.Group();S.add(G);G.add(O);
    const mG=new T.MeshStandardMaterial({color:0xd8b76e,metalness:.95,roughness:.16,emissive:0xc2a15f,emissiveIntensity:.22});
    const mV=new T.MeshStandardMaterial({color:0x3ee060,metalness:.88,roughness:.2,emissive:0x2fb84f,emissiveIntensity:.42});
    O.add(new T.Mesh(new T.SphereGeometry(1.12,64,64),new T.MeshPhysicalMaterial({color:0x0a2e16,emissive:0x1b6e32,emissiveIntensity:.35,metalness:.1,roughness:.08,transmission:.78,thickness:1.8,ior:1.45,clearcoat:1,clearcoatRoughness:.08})));
    const rg=(r,t,m)=>{const x=new T.Mesh(new T.TorusGeometry(r,t,24,128),m);O.add(x);return x};
    for(let i=0;i<4;i++)rg(1.38,.018,i%2?mG:mV).rotation.y=i*Math.PI/4;
    rg(1.38,.022,mG).rotation.x=Math.PI/2;
    [-.68,.68].forEach(z=>{const l=rg(Math.sqrt(1.38*1.38-z*z),.012,mV);l.rotation.x=Math.PI/2;l.position.z=z});
    const o1=rg(1.62,.02,mG);o1.rotation.set(1.22,-.28,0);
    const o2=rg(1.78,.015,mV);o2.rotation.set(-1.1,.42,0);
    const dM=new T.MeshBasicMaterial({color:0xffffff}),d1=new T.Mesh(new T.SphereGeometry(.05,16,16),dM),d2=d1.clone();
    d1.position.x=1.62;o1.add(d1);d2.position.x=1.78;o2.add(d2);
    const tc=document.createElement('canvas');tc.width=tc.height=512;
    const tx=tc.getContext('2d');tx.textAlign='center';tx.textBaseline='middle';
    tx.font='300 250px "Cormorant Garamond",Georgia,serif';
    tx.shadowBlur=28;tx.shadowColor='#c2a15f';tx.fillStyle='#e8c97a';tx.fillText('H',195,268);
    tx.shadowColor='#2fb84f';tx.fillStyle='#45ea68';tx.fillText('V',325,268);
    const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(tc),transparent:true,depthTest:false}));
    sp.scale.set(1.9,1.9,1);G.add(sp);
    const p1=new T.PointLight(0x2fb84f,6,12),p2=new T.PointLight(0xc2a15f,5,12);
    p1.position.set(3,3,4);p2.position.set(-3,-2,4);
    S.add(new T.AmbientLight(0xffffff,.6),p1,p2);
    box.appendChild(R.domElement);box.classList.add('gl');
    let rx=0,ry=0,tx2=0,ty2=0,vis=true;
    hero.addEventListener('pointermove',e=>{
      const r=hero.getBoundingClientRect();
      ty2=((e.clientX-r.left)/r.width-.5)*.9;
      tx2=-((e.clientY-r.top)/r.height-.5)*.7;
    });
    new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
    const clk=new T.Clock();
    (function anim(){
      requestAnimationFrame(anim);
      if(!vis||document.hidden||document.documentElement.classList.contains('intro'))return;
      const t=clk.getElapsedTime();
      O.rotation.y=t*.24;O.rotation.x=-.3+Math.sin(t*.5)*.08;
      o1.rotation.z=t*.7;o2.rotation.z=-t*.5;
      rx+=(tx2-rx)*.06;ry+=(ty2-ry)*.06;
      G.rotation.x=rx;G.rotation.y=ry;
      R.render(S,C);
    })();
  }catch(e){}
}
</script>
</body>
</html>`;

const outPath = path.join(root, 'public/agave-saude-rioclaro.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote standalone HTML:', outPath, 'Size:', fs.statSync(outPath).size);
