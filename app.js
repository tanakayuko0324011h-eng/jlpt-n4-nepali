let words=[], deck=[], index=0, showingBack=false, reviewMode=false;
const STORAGE_KEY="jlpt-n4-nepal-progress-v1";
let progress={known:[],unknown:[]};
const $=id=>document.getElementById(id);
try{progress=JSON.parse(localStorage.getItem(STORAGE_KEY))||progress}catch(e){}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(progress))}
function shuffleArray(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function current(){return deck[index]}
function render(){
 if(!deck.length){$("frontWord").textContent="復習する単語はありません";$("hint").textContent="";$("back").style.display="none";$("frontWord").style.display="block";$("counter").textContent="0語";return}
 const w=current(); $("counter").textContent=`${index+1} / ${deck.length}`;
 $("knownCount").textContent=`覚えた：${progress.known.length}語`;
 $("bar").style.width=`${progress.known.length/words.length*100}%`;
 $("frontWord").textContent=w.word;$("backWord").textContent=w.word;
 $("reading").textContent=w.reading;$("english").textContent=w.english;$("nepali").textContent=w.nepali;
 flip(false);
}
function flip(back){showingBack=back;$("frontWord").style.display=back?"none":"block";$("back").style.display=back?"block":"none";$("hint").textContent=back?"タップすると漢字だけに戻ります":"タップすると読み方と意味が見られます"}
function move(delta){if(!deck.length)return;index=(index+delta+deck.length)%deck.length;render()}
function mark(kind){
 if(!deck.length)return;const id=current().no;
 progress.known=progress.known.filter(x=>x!==id);progress.unknown=progress.unknown.filter(x=>x!==id);
 progress[kind].push(id);save();$("message").textContent=kind==="known"?"「覚えた」に記録しました":"復習リストに記録しました";
 $("knownCount").textContent=`覚えた：${progress.known.length}語`;move(1);
}
$("card").addEventListener("click",()=>flip(!showingBack));
$("card").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();flip(!showingBack)}});
$("prev").onclick=()=>move(-1);$("next").onclick=()=>move(1);
$("known").onclick=()=>mark("known");$("notKnown").onclick=()=>mark("unknown");
$("shuffle").onclick=()=>{deck=shuffleArray(deck);index=0;render();$("message").textContent="順番をランダムにしました"};
$("review").onclick=()=>{deck=shuffleArray(words.filter(w=>!progress.known.includes(w.no)));index=0;reviewMode=true;render();$("message").textContent=`未習得の${deck.length}語を表示します`};
$("all").onclick=()=>{deck=[...words];index=0;reviewMode=false;render();$("message").textContent="全300語に戻りました"};
fetch("data.json").then(r=>{if(!r.ok)throw Error("data");return r.json()}).then(data=>{words=data;deck=[...words];render()}).catch(()=>{$("frontWord").textContent="データを読み込めません。オンラインで一度開いてください。"});
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
