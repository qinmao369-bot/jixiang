(() => {
  const lang = SiteLocale.language;
  const en = lang === 'en';
  const tr = value => lang === 'zh-Hant' ? SiteLocale.traditional(value) : value;
  const t = (cn, english) => en ? english : tr(cn);
  const pad = n => String(n).padStart(2, '0');
  const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function parse(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const [y,m,d] = value.split('-').map(Number);
    const result = new Date(y,m-1,d);
    return result.getFullYear() === y && result.getMonth() === m-1 && result.getDate() === d ? result : null;
  }
  let date = parse(new URLSearchParams(location.search).get('date')) || parse('2026-09-18');
  const moonFor = d => Solar.fromYmd(d.getFullYear(),d.getMonth()+1,d.getDate()).getLunar();
  const list = values => tr(values.length ? values.join(' · ') : '无');
  const cells = document.querySelectorAll('.table .cell');
  const dateInput = document.querySelector('#detail-date');
  const hourList = document.querySelector('#hour-list');
  const fields = [
    ['五行','Five elements',m=>m.getDayNaYin()],
    ['冲煞','Zodiac clash',m=>'冲'+m.getDayChongDesc()+'，煞'+m.getDaySha()],
    ['值神','Day deity',m=>m.getDayTianShen()+' · '+m.getDayTianShenLuck()],
    ['吉神宜趋','Favorable influences',m=>list(m.getDayJiShen())],
    ['凶神宜忌','Unfavorable influences',m=>list(m.getDayXiongSha())],
    ['彭祖百忌','Traditional taboos',m=>m.getPengZuGan()+' · '+m.getPengZuZhi()]
  ];
  function render() {
    const moon = moonFor(date);
    const dayText = moon.getMonthInChinese()+'月'+moon.getDayInChinese();
    document.title = en ? `Chinese almanac for ${key(date)} | Auspicious` : tr(`${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日黄历 | ${dayText}`);
    document.querySelector('meta[name="description"]').content = en ? `Traditional Chinese almanac for ${key(date)}: lunar date, suitable activities, zodiac clash and hour guidance.` : tr(`查看${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日黄历：农历${dayText}、宜忌、冲煞和时辰。`);
    dateInput.value = key(date);
    document.querySelector('.title').textContent = tr(dayText);
    document.querySelector('.sub').textContent = en ? `${moon.getYearInGanZhi()} year · ${moon.getMonthInGanZhi()} month · ${moon.getDayInGanZhi()} day · ${date.toLocaleDateString('en-US',{weekday:'long'})}` : tr(`${moon.getYearInGanZhi()}年　${moon.getMonthInGanZhi()}月　${moon.getDayInGanZhi()}日　【属${moon.getYearShengXiao()}】　周${'日一二三四五六'[date.getDay()]}`);
    document.querySelector('.actions > div:first-child').innerHTML = `<div class="action-line"><span class="pill yi">${t('宜','Suitable')}</span>${list(moon.getDayYi())}</div><div class="action-line"><span class="pill ji">${t('忌','Avoid')}</span>${list(moon.getDayJi())}</div>`;
    fields.forEach(([cn,english,get],i)=>cells[i].innerHTML=`<b>${t(cn,english)}</b>${tr(get(moon))}`);
    document.querySelector('#extra-almanac').innerHTML = `<div><b>${t('建除十二神','Day officer')}</b>${tr(moon.getZhiXing()+'日')}</div><div><b>${t('今日胎神','Fetal deity')}</b>${tr(moon.getDayPositionTai())}</div><div><b>${t('二十八星宿','Lunar mansion')}</b>${tr(moon.getXiu()+'宿 · '+moon.getXiuLuck())}</div>`;
    hourList.innerHTML = moon.getTimes().map(hour=>`<article class="hour"><span class="round">${tr(hour.getZhi())}</span><div><strong>${tr(hour.getGanZhi())}${t('时',' hour')}　${hour.getMinHm()}–${hour.getMaxHm()}</strong>　${tr('冲'+hour.getChongDesc()+'，煞'+hour.getSha())}　<span class="pill ${hour.getTianShenLuck()==='吉'?'yi':'ji'}">${tr(hour.getTianShenLuck())}</span><small>${tr('喜神'+hour.getPositionXiDesc()+' · 财神'+hour.getPositionCaiDesc()+' · 福神'+hour.getPositionFuDesc())}</small><small>${t('宜','Suitable')} ${list(hour.getYi())}</small><small>${t('忌','Avoid')} ${list(hour.getJi())}</small></div></article>`).join('');
    document.querySelector('.back').href='/?date='+key(date);
    history.replaceState(null,'','?date='+key(date));
  }
  document.querySelector('.back').textContent=t('‹ 返回万年历','‹ Back to calendar');
  document.querySelector('#detail-date-label').textContent=t('公历日期','Gregorian date');
  document.querySelector('#lucky-open').textContent=t('吉日查询','Find dates');
  document.querySelector('#lucky-search h2').textContent=t('吉日查询','Find auspicious dates');
  document.querySelector('#lucky-search label').firstChild.textContent=t('选择事项 ','Choose activity ');
  document.querySelector('#lucky-run').textContent=t('查询未来90天','Search next 90 days');
  document.querySelector('#hours-title').textContent=t('全天时辰吉凶','Hour guidance');
  document.querySelector('#detail-note').textContent=t('日期按所选公历日显示；时辰按中国标准时间（UTC+8）的传统时段作民俗参考。海外仪式时间需结合当地时区。','Dates follow the selected Gregorian day. Hour guidance uses China Standard Time (UTC+8) as a cultural reference; confirm local time for overseas events.');
  document.querySelectorAll('.nav button').forEach((button,i)=>{button.setAttribute('aria-label',t(i?'后一天':'前一天',i?'Next day':'Previous day'));button.addEventListener('click',()=>{date=new Date(date.getFullYear(),date.getMonth(),date.getDate()+(i?1:-1));render()})});
  dateInput.addEventListener('change',()=>{const next=parse(dateInput.value);if(next){date=next;render()}});
  const activities={'结婚':['嫁娶'],'搬家':['移徙'],'搬新房':['入宅'],'开业':['开市','开业'],'出行':['出行'],'动土':['动土'],'安葬':['安葬'],'祭祀':['祭祀'],'签订合同':['立券','交易'],'祈福':['祈福']};
  const activity=document.querySelector('#lucky-activity');
  Object.keys(activities).forEach(item=>activity.add(new Option(en?SiteLocale.text(item):tr(item),item)));
  const search=document.querySelector('#lucky-search');
  document.querySelector('#lucky-open').addEventListener('click',()=>{search.hidden=!search.hidden;if(!search.hidden)search.scrollIntoView({behavior:'smooth',block:'nearest'})});
  document.querySelector('#lucky-run').addEventListener('click',()=>{
    const terms=activities[activity.value],results=[];
    for(let i=0;i<90;i++){
      const candidate=new Date(date.getFullYear(),date.getMonth(),date.getDate()+i);
      const moon=moonFor(candidate);
      if(terms.some(term=>moon.getDayYi().includes(term))&&!terms.some(term=>moon.getDayJi().includes(term)))results.push(`<button type="button" data-date="${key(candidate)}">${en?key(candidate):tr((candidate.getMonth()+1)+'月'+candidate.getDate()+'日　周'+'日一二三四五六'[candidate.getDay()])}　${t('农历','Lunar')} ${tr(moon.getMonthInChinese()+'月'+moon.getDayInChinese())}</button>`);
      if(results.length===15)break;
    }
    document.querySelector('#lucky-results').innerHTML=results.length?results.join(''):`<p>${t('未来90天暂无匹配日期，请更换事项。','No matching dates in the next 90 days. Try another activity.')}</p>`;
  });
  document.querySelector('#lucky-results').addEventListener('click',event=>{const next=parse(event.target.dataset.date);if(next){date=next;render();window.scrollTo({top:0,behavior:'smooth'})}});
  render();
})();
