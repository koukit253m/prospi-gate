(function(){

// ══════════════════════════════
//  設定
// ══════════════════════════════
const SECRET = "サッカーやろうぜ";
const PROSPI_SCHEME = "prospia://";
const PROSPI_APPSTORE = "https://apps.apple.com/jp/app/id940320341";

// 二重起動防止
if(document.getElementById('__prospi_gate__')) return;

// ══════════════════════════════
//  フォント読み込み
// ══════════════════════════════
const font = document.createElement('link');
font.rel = 'stylesheet';
font.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=Noto+Serif+JP:wght@300;700&display=swap';
document.head.appendChild(font);

// ══════════════════════════════
//  スタイル注入
// ══════════════════════════════
const style = document.createElement('style');
style.textContent = `
#__prospi_gate__ {
  position:fixed;inset:0;z-index:2147483647;
  background:#050508;
  font-family:'Noto Serif JP',serif;
  overflow:hidden;
}

/* 星空 */
#pg-canvas {
  position:absolute;inset:0;
}

/* ──── 入力画面 ──── */
#pg-input-wrap {
  position:absolute;inset:0;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:0;
  transition:opacity .7s ease;
}

.pg-star {
  font-size:72px;
  animation:pg-pulse 2.8s ease-in-out infinite;
  filter:drop-shadow(0 0 18px #c9a84c);
  margin-bottom:32px;
}

.pg-box {
  width:min(320px,88vw);
  border:1.5px solid #c9a84c;
  border-radius:4px 4px 70px 70px / 4px 4px 35px 35px;
  padding:36px 28px 32px;
  background:linear-gradient(180deg,#0d0d1e,#050508);
  box-shadow:0 0 40px rgba(201,168,76,.35),inset 0 0 30px rgba(201,168,76,.04);
  position:relative;
}

.pg-box::before {
  content:'';position:absolute;inset:7px;
  border:1px solid rgba(201,168,76,.2);
  border-radius:3px 3px 66px 66px / 3px 3px 33px 33px;
  pointer-events:none;
}

.pg-key {
  position:absolute;top:-20px;left:50%;transform:translateX(-50%);
  background:#050508;padding:0 12px;font-size:26px;line-height:1;
}

.pg-title {
  text-align:center;color:#c9a84c;
  font-family:'Cinzel Decorative',serif;
  font-size:11px;letter-spacing:.28em;
  margin-bottom:4px;
}

.pg-sub {
  text-align:center;color:rgba(201,168,76,.5);
  font-size:11px;letter-spacing:.2em;margin-bottom:26px;
}

.pg-input {
  width:100%;background:transparent;
  border:none;border-bottom:1px solid rgba(201,168,76,.4);
  color:#f0d080;font-family:'Noto Serif JP',serif;
  font-size:17px;text-align:center;
  padding:10px 0;outline:none;
  letter-spacing:.2em;caret-color:#c9a84c;
  transition:border-color .3s;
}
.pg-input:focus{border-bottom-color:#c9a84c;}
.pg-input::placeholder{color:rgba(201,168,76,.18);font-size:12px;letter-spacing:.15em;}

.pg-btn {
  width:100%;margin-top:18px;
  background:transparent;border:1px solid #c9a84c;
  color:#c9a84c;font-family:'Noto Serif JP',serif;
  font-size:12px;letter-spacing:.35em;
  padding:14px;cursor:pointer;border-radius:2px;
  -webkit-tap-highlight-color:transparent;
  transition:background .25s,color .25s;
}
.pg-btn:active{background:#c9a84c;color:#050508;}

.pg-err {
  text-align:center;color:#e74c3c;
  font-size:10px;letter-spacing:.18em;
  margin-top:12px;min-height:14px;
  opacity:0;transition:opacity .3s;
}
.pg-err.show{opacity:1;}

.pg-hint {
  margin-top:22px;
  color:rgba(201,168,76,.2);font-size:10px;
  text-align:center;letter-spacing:.2em;line-height:2;
}

/* ──── 扉アニメ画面 ──── */
#pg-door-wrap {
  position:absolute;inset:0;
  opacity:0;pointer-events:none;
  transition:opacity .5s;
}
#pg-door-wrap.active{opacity:1;pointer-events:all;}

.pg-door-l,.pg-door-r {
  position:absolute;top:0;bottom:0;width:50%;
  background:linear-gradient(135deg,#0d0d1e,#050510);
  transition:transform 1.3s cubic-bezier(.77,0,.18,1);
}
.pg-door-l{left:0;border-right:2px solid #c9a84c;}
.pg-door-r{right:0;border-left:2px solid #c9a84c;}

/* 扉の装飾ライン */
.pg-door-l::before,.pg-door-r::before {
  content:'';position:absolute;
  top:15%;bottom:15%;width:1px;
  background:linear-gradient(transparent,rgba(201,168,76,.3),transparent);
}
.pg-door-l::before{right:20px;}
.pg-door-r::before{left:20px;}

.pg-door-open .pg-door-l{transform:translateX(-100%);}
.pg-door-open .pg-door-r{transform:translateX(100%);}

/* 光の爆発 */
.pg-burst {
  position:absolute;
  left:50%;top:50%;
  width:10px;height:10px;
  margin:-5px 0 0 -5px;
  border-radius:50%;
  background:radial-gradient(circle,rgba(240,208,128,.95) 0%,rgba(201,168,76,.5) 40%,transparent 70%);
  transform:scale(0);opacity:0;
  transition:transform .9s ease,opacity .9s ease;
  pointer-events:none;
}
.pg-burst.go{transform:scale(120);opacity:1;}

/* 開幕メッセージ */
.pg-open-msg {
  position:absolute;inset:0;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  opacity:0;transition:opacity .8s ease 1.5s;
  z-index:2;gap:10px;
}
.pg-open-msg.show{opacity:1;}

.pg-open-title {
  font-family:'Cinzel Decorative',serif;
  color:#c9a84c;font-size:20px;
  letter-spacing:.15em;
  text-shadow:0 0 30px #f0d080;
  margin-bottom:4px;
}
.pg-open-sub {
  color:rgba(201,168,76,.65);
  font-size:11px;letter-spacing:.3em;
  margin-bottom:28px;
}
.pg-launch-btn {
  background:linear-gradient(135deg,#7a5c1e,#c9a84c);
  color:#050508;font-family:'Noto Serif JP',serif;
  font-weight:700;font-size:15px;
  letter-spacing:.2em;
  padding:17px 40px;border:none;border-radius:4px;
  cursor:pointer;
  box-shadow:0 0 30px rgba(201,168,76,.5);
  -webkit-tap-highlight-color:transparent;
  animation:pg-glow 2s ease-in-out infinite;
}

/* 閉じるボタン */
.pg-close {
  position:absolute;top:18px;right:20px;
  background:none;border:none;
  color:rgba(201,168,76,.35);font-size:22px;
  cursor:pointer;z-index:10;
  -webkit-tap-highlight-color:transparent;
  padding:6px;
}

/* パーティクル */
.pg-p {
  position:absolute;border-radius:50%;
  pointer-events:none;opacity:0;
}

/* キーフレーム */
@keyframes pg-pulse{
  0%,100%{transform:scale(1);filter:drop-shadow(0 0 18px #c9a84c);}
  50%{transform:scale(1.1);filter:drop-shadow(0 0 36px #f0d080);}
}
@keyframes pg-shake{
  0%,100%{transform:translateX(0);}
  20%{transform:translateX(-9px);}
  40%{transform:translateX(9px);}
  60%{transform:translateX(-6px);}
  80%{transform:translateX(6px);}
}
@keyframes pg-glow{
  0%,100%{box-shadow:0 0 20px rgba(201,168,76,.5);}
  50%{box-shadow:0 0 50px rgba(240,208,128,.8);}
}
`;
document.head.appendChild(style);

// ══════════════════════════════
//  DOM 構築
// ══════════════════════════════
const root = document.createElement('div');
root.id = '__prospi_gate__';
root.innerHTML = `
<canvas id="pg-canvas"></canvas>
<button class="pg-close" id="pg-close">✕</button>

<!-- 入力エリア -->
<div id="pg-input-wrap">
  <div class="pg-star">⭐</div>
  <div class="pg-box">
    <div class="pg-key">🗝️</div>
    <div class="pg-title">Secret Gate</div>
    <div class="pg-sub">秘密の言葉を入力せよ</div>
    <input id="pg-inp" class="pg-input" type="text"
      placeholder="呪文を唱えよ…"
      autocomplete="off" autocorrect="off" spellcheck="false"/>
    <button class="pg-btn" id="pg-submit">▶ 扉を開く</button>
    <div class="pg-err" id="pg-err">— 呪文が違う —</div>
  </div>
  <div class="pg-hint">
    この扉は選ばれし者だけが通れる<br>
    正しき言葉を知る者よ、前へ
  </div>
</div>

<!-- 扉演出エリア -->
<div id="pg-door-wrap">
  <div class="pg-door-l"></div>
  <div class="pg-door-r"></div>
  <div class="pg-burst" id="pg-burst"></div>
  <div class="pg-open-msg" id="pg-open-msg">
    <div class="pg-open-title">⚾ Gate Open</div>
    <div class="pg-open-sub">グラウンドへの扉が開いた</div>
    <button class="pg-launch-btn" id="pg-launch">プロスピAへ入る</button>
  </div>
</div>
`;
document.body.appendChild(root);

// ══════════════════════════════
//  星空
// ══════════════════════════════
const cv = document.getElementById('pg-canvas');
const cx = cv.getContext('2d');
let stars=[];

function initStars(){
  cv.width=innerWidth; cv.height=innerHeight;
  stars=Array.from({length:160},()=>({
    x:Math.random()*cv.width, y:Math.random()*cv.height,
    r:Math.random()*1.4+.3,
    speed:Math.random()*.006+.002,
    phase:Math.random()*Math.PI*2
  }));
}
function drawStars(t){
  cx.clearRect(0,0,cv.width,cv.height);
  stars.forEach(s=>{
    const a=(Math.sin(t*s.speed+s.phase)+1)/2*.75+.1;
    cx.beginPath();cx.arc(s.x,s.y,s.r,0,Math.PI*2);
    cx.fillStyle=`rgba(201,168,76,${a})`;cx.fill();
  });
  requestAnimationFrame(drawStars);
}
initStars();
requestAnimationFrame(drawStars);
window.addEventListener('resize',initStars);

// ══════════════════════════════
//  パーティクル
// ══════════════════════════════
function burst(){
  const bx=innerWidth/2, by=innerHeight/2;
  for(let i=0;i<60;i++){
    const p=document.createElement('div');
    p.className='pg-p';
    const sz=Math.random()*6+2;
    Object.assign(p.style,{
      width:sz+'px',height:sz+'px',
      left:bx+'px',top:by+'px',
      background:`hsl(${40+Math.random()*20},80%,${60+Math.random()*20}%)`
    });
    root.appendChild(p);
    const ang=Math.random()*Math.PI*2, d=Math.random()*280+80;
    p.animate([
      {opacity:1,transform:'scale(1) translate(0,0)'},
      {opacity:0,transform:`scale(.2) translate(${Math.cos(ang)*d}px,${Math.sin(ang)*d}px)`}
    ],{duration:Math.random()*1200+600,easing:'cubic-bezier(0,.9,.6,1)',fill:'forwards'})
    .onfinish=()=>p.remove();
  }
}

// ══════════════════════════════
//  パスワードチェック
// ══════════════════════════════
function check(){
  const val=document.getElementById('pg-inp').value.trim();
  const err=document.getElementById('pg-err');
  if(val===SECRET){
    err.classList.remove('show');
    openDoor();
  } else {
    err.classList.add('show');
    document.querySelector('.pg-box').animate([
      {transform:'translateX(0)'},{transform:'translateX(-9px)'},
      {transform:'translateX(9px)'},{transform:'translateX(-6px)'},
      {transform:'translateX(6px)'},{transform:'translateX(0)'}
    ],{duration:480,easing:'ease'});
    document.getElementById('pg-inp').value='';
  }
}

document.getElementById('pg-submit').addEventListener('click',check);
document.getElementById('pg-inp').addEventListener('keydown',e=>{
  if(e.key==='Enter') check();
});

// ══════════════════════════════
//  扉を開く
// ══════════════════════════════
function openDoor(){
  const inWrap=document.getElementById('pg-input-wrap');
  inWrap.style.opacity='0';
  inWrap.style.pointerEvents='none';

  setTimeout(()=>{
    const dw=document.getElementById('pg-door-wrap');
    dw.classList.add('active');

    setTimeout(()=>{
      dw.querySelector(':scope > .pg-door-l').parentElement.classList.add('pg-door-open');
      dw.classList.add('pg-door-open');

      setTimeout(()=>{
        document.getElementById('pg-burst').classList.add('go');
        burst();
        setTimeout(()=>{
          document.getElementById('pg-open-msg').classList.add('show');
        },600);
      },700);
    },200);
  },500);
}

// ══════════════════════════════
//  プロスピ起動
// ══════════════════════════════
document.getElementById('pg-launch').addEventListener('click',()=>{
  // URL scheme で直接起動を試みる
  window.location.href = PROSPI_SCHEME;
  // 1秒後にApp Storeへフォールバック
  setTimeout(()=>{ window.location.href = PROSPI_APPSTORE; }, 1000);
});

// ══════════════════════════════
//  閉じる
// ══════════════════════════════
document.getElementById('pg-close').addEventListener('click',()=>{
  root.remove();
  style.remove();
  font.remove();
});

})();
