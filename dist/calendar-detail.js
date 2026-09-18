(() => {
  const params = new URLSearchParams(location.search);
  const today = new Date();
  const pad = n => String(n).padStart(2, '0');
  const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function parse(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const [y, m, d] = value.split('-').map(Number);
    const result = new Date(y, m - 1, d);
    return result.getFullYear() === y && result.getMonth() === m - 1 && result.getDate() === d ? result : null;
  }
  let date = parse(params.get('date')) || parse('2026-09-18');
  const moonFor = d => Solar.fromYmd(d.getFullYear(), d.getMonth() + 1, d.getDate()).getLunar();
  const cells = document.querySelectorAll('.table .cell');
  const hourList = document.querySelector('#hour-list');
  const dateInput = document.querySelector('#detail-date');
  const list = items => items.length ? items.join(' · ') : '无';
  function render() {
    const moon = moonFor(date);
    const title = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日黄历`;
    const dayText = moon.getMonthInChinese() + '月' + moon.getDayInChinese();
    document.title = title + ' | ' + dayText;
    document.querySelector('meta[name="description"]').content = `${title}：农历${dayText}，查看宜忌、冲煞、吉神、凶神和十二时辰。`;
    dateInput.value = key(date);
    document.querySelector('.title').textContent = dayText;
    document.querySelector('.sub').textContent = `${moon.getYearInGanZhi()}年　${moon.getMonthInGanZhi()}月　${moon.getDayInGanZhi()}日　【属${moon.getYearShengXiao()}】　周${'日一二三四五六'[date.getDay()]}`;
    document.querySelector('.actions > div:first-child').innerHTML = `<div class="action-line"><span class="pill yi">宜</span>${list(moon.getDayYi())}</div><div class="action-line"><span class="pill ji">忌</span>${list(moon.getDayJi())}</div>`;
    cells[0].innerHTML = `<b>五行</b>${moon.getDayNaYin()}`;
    cells[1].innerHTML = `<b>冲煞</b>冲${moon.getDayChongDesc()}，煞${moon.getDaySha()}`;
    cells[2].innerHTML = `<b>值神</b>${moon.getDayTianShen()} · ${moon.getDayTianShenLuck()}`;
    cells[3].innerHTML = `<b>吉神宜趋</b>${list(moon.getDayJiShen())}`;
    cells[4].innerHTML = `<b>凶神宜忌</b>${list(moon.getDayXiongSha())}`;
    cells[5].innerHTML = `<b>彭祖百忌</b>${moon.getPengZuGan()} · ${moon.getPengZuZhi()}`;
    document.querySelector('#extra-almanac').innerHTML = `<div><b>建除十二神</b>${moon.getZhiXing()}日</div><div><b>今日胎神</b>${moon.getDayPositionTai()}</div><div><b>二十八星宿</b>${moon.getXiu()}宿 · ${moon.getXiuLuck()}</div>`;
    hourList.innerHTML = moon.getTimes().map(time => `<article class="hour"><span class="round">${time.getZhi()}</span><div><strong>${time.getGanZhi()}时　${time.getMinHm()}–${time.getMaxHm()}</strong>　冲${time.getChongDesc()}，煞${time.getSha()}　<span class="pill ${time.getTianShenLuck() === '吉' ? 'yi' : 'ji'}">${time.getTianShenLuck()}</span><small>喜神${time.getPositionXiDesc()} · 财神${time.getPositionCaiDesc()} · 福神${time.getPositionFuDesc()}</small><small>宜 ${list(time.getYi())}</small><small>忌 ${list(time.getJi())}</small></div></article>`).join('');
    document.querySelector('.back').href = '/?date=' + key(date);
    history.replaceState(null, '', '?date=' + key(date));
  }
  document.querySelectorAll('.nav button').forEach((button, i) => button.addEventListener('click', () => { date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (i === 0 ? -1 : 1)); render(); }));
  dateInput.addEventListener('change', () => { const next = parse(dateInput.value); if (next) { date = next; render(); } });
  const activities = {'结婚':['嫁娶'],'搬家':['移徙'],'搬新房':['入宅'],'开业':['开市','开业'],'出行':['出行'],'动土':['动土'],'安葬':['安葬'],'祭祀':['祭祀'],'签订合同':['立券','交易'],'祈福':['祈福']};
  const search = document.querySelector('#lucky-search');
  const activity = document.querySelector('#lucky-activity');
  Object.keys(activities).forEach(item => activity.add(new Option(item, item)));
  document.querySelector('#lucky-open').addEventListener('click', () => { search.hidden = !search.hidden; if (!search.hidden) search.scrollIntoView({behavior: 'smooth', block: 'nearest'}); });
  document.querySelector('#lucky-run').addEventListener('click', () => {
    const term = activity.value;
    const results = [];
    for (let i = 0; i < 90; i++) {
      const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
      const moon = moonFor(candidate);
      if (activities[term].some(word => moon.getDayYi().includes(word)) && !activities[term].some(word => moon.getDayJi().includes(word))) results.push(`<button type="button" data-date="${key(candidate)}">${candidate.getMonth() + 1}月${candidate.getDate()}日　周${'日一二三四五六'[candidate.getDay()]}　农历${moon.getMonthInChinese()}月${moon.getDayInChinese()}</button>`);
      if (results.length === 15) break;
    }
    document.querySelector('#lucky-results').innerHTML = results.length ? results.join('') : '<p>未来90天暂无匹配日期，请更换事项。</p>';
  });
  document.querySelector('#lucky-results').addEventListener('click', e => { const next = parse(e.target.dataset.date); if (next) { date = next; render(); window.scrollTo({top:0,behavior:'smooth'}); } });
  render();
})();
