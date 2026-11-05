const $ = id => document.getElementById(id);
const KEY = 'hikaya.v1';
const ideas = [
  'شخصية تجد رسالة قديمة بخط يدها هي، لم تكتبها يومًا.',
  'قرية يختفي فيها صوت واحد كل ليلة.',
  'مقهى لا يفتح أبوابه إلا قبل الفجر، ولا يعرف أحد من صاحبه.',
  'سافر بطلك إلى مكان وعد نفسه ألا يعود إليه.',
  'جدّة تحكي القصة نفسها كل مرة، لكن بنهاية مختلفة.',
  'مفتاح صغير لا يطابق أي باب في البيت.',
  'يوم واحد يتكرر، وأنت الوحيد الذي يلاحظ.',
  'اكتب مشهد وداع دون أن تذكر كلمة وداع.'
];
let data = JSON.parse(localStorage.getItem(KEY) || 'null') || { stories: [], current: null, goal: 300 };
const save = () => localStorage.setItem(KEY, JSON.stringify(data));
const cur = () => data.stories.find(s => s.id === data.current);
const words = t => (t.trim().match(/\S+/g) || []).length;

function newStory() {
  const s = { id: Date.now(), title: '', body: '', updated: Date.now() };
  data.stories.unshift(s); data.current = s.id; save(); render(); $('title').focus();
}
function renderList() {
  $('list').replaceChildren(...data.stories.map(s => {
    const li = document.createElement('li'); if (s.id === data.current) li.className = 'on';
    const b = document.createElement('button');
    b.textContent = s.title || 'قصة بلا عنوان';
    const m = document.createElement('small'); m.textContent = words(s.body) + ' كلمة';
    b.append(m); b.onclick = () => { data.current = s.id; save(); render(); };
    li.append(b); return li;
  }));
}
function renderStats() {
  const s = cur(); if (!s) return;
  const n = words(s.body), mins = Math.max(1, Math.ceil(n / 200));
  $('stats').textContent = n + ' كلمة · ' + (n ? 'قراءتها ' + mins + ' د' : 'ابدأ بجملة');
  $('fill').style.width = Math.min(100, n / data.goal * 100) + '%';
}
function render() {
  if (!data.stories.length) return newStory();
  if (!cur()) data.current = data.stories[0].id;
  const s = cur(); $('title').value = s.title; $('body').value = s.body; $('goal').value = data.goal;
  renderList(); renderStats();
}
function edit() {
  const s = cur(); s.title = $('title').value; s.body = $('body').value; s.updated = Date.now();
  save(); renderStats(); renderList();
}
$('title').oninput = $('body').oninput = edit;
$('goal').onchange = e => { data.goal = Math.max(50, +e.target.value || 300); save(); renderStats(); };
$('new').onclick = newStory;
$('spark').onclick = () => {
  const n = $('note'); n.textContent = ideas[Math.floor(Math.random() * ideas.length)]; n.hidden = false;
};
$('focus').onclick = () => { document.body.classList.add('focus'); $('back').hidden = false; $('body').focus(); };
$('back').onclick = () => { document.body.classList.remove('focus'); $('back').hidden = true; };
$('export').onclick = () => {
  const s = cur(), blob = new Blob([(s.title ? s.title + '\n\n' : '') + s.body], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = (s.title || 'قصة') + '.txt'; a.click(); URL.revokeObjectURL(a.href);
};
$('del').onclick = () => {
  if (!confirm('تحذف هذه القصة نهائيًا؟')) return;
  data.stories = data.stories.filter(s => s.id !== data.current); data.current = null; save(); render();
};
render();
