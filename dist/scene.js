(() => {
  const scene = document.body.dataset.scene;
  const loc = SiteLocale;
  const en = loc.language === 'en';
  const zh = value => loc.language === 'zh-Hant' ? loc.traditional(value) : value;
  const copy = {
    wedding: {
      title:'2027 年结婚吉日',english:'Auspicious Wedding Dates 2027',term:'嫁娶',
      intro:'按传统黄历“宜嫁娶、忌项不含嫁娶”列出 2027 年参考日期。可按月份、周末和生肖相冲筛选。',
      note:'结婚择日通常还会考虑双方生辰、家庭习俗，以及当地场地、亲友和民政登记安排。这里的日期是一般民俗参考。',
      guide:'先选双方方便的月份，核对当地周末和场地，再检查双方生肖是否与当天相冲。黄历上的“宜嫁娶”并不等于适合每一对新人。',
      faq:[['这些日期适合所有新人吗？','不适合。此列表仅按通用黄历宜忌筛选，没有使用双方出生时间做个人合婚。'],['海外婚礼要按哪个时区？','列表按所选公历日期展示中国传统黄历条目。仪式时辰和跨日安排应按当地时间再确认。'],['为什么某天与别的网站不同？','黄历版本、择日流派与用词可能不同。本页明确以 lunar-javascript 1.7.7 的每日宜忌为依据。']]
    },
    moving: {
      title:'2027 年搬家吉日',english:'Auspicious Moving Dates 2027',term:'移徙／入宅',
      intro:'按传统黄历“宜移徙或入宅，忌项不含两者”列出 2027 年参考日期。搬运与正式入宅可根据实际情况分别安排。',
      note:'海外搬家还受租约、钥匙交接、物业电梯预约、货运和当地假期影响。黄历只是规划时的一项参考。',
      guide:'“移徙”常用于搬迁，“入宅”常用于正式进入新居。可先锁定当地可搬运的日期，再确认家庭成员生肖和黄历相冲。',
      faq:[['搬家与入宅是同一件事吗？','在部分习俗中可以分开：先搬运物品，再选一天正式入宅。应以家人的实际安排为准。'],['周末一定更合适吗？','周末通常方便请假和预约搬家公司，但仍需看当地租约、物业和搬运服务。'],['这个列表考虑搬家方向吗？','没有。本页只按通用每日宜忌筛选，未加入住宅朝向、家庭成员八字等个人条件。']]
    },
    opening: {
      title:'2027 年开业吉日',english:'Auspicious Grand Opening Dates 2027',term:'开市／开业',
      intro:'按传统黄历“宜开市或开业，忌项不含两者”列出 2027 年参考日期。可结合当地营业许可与客流安排开张。',
      note:'开业前还应确认当地许可、营业时间、员工排班、供应链和宣传准备。黄历日期不能代替这些实际条件。',
      guide:'“开市”是传统黄历常见用语。先选当地适合营业和邀请客户的日期，再查看黄历宜忌与经营者的个人习俗。',
      faq:[['开市与线上业务上线一样吗？','可把上线作为业务开始的象征日期，但实际发布时间应优先考虑系统准备、客户所在时区和支持团队。'],['开业日一定要在周末吗？','不一定。请按目标客户的当地作息、商圈客流和员工安排选择。'],['这个列表保证生意兴隆吗？','不能保证。它是基于传统黄历的文化参考，经营结果还取决于产品、服务和市场。']]
    }
  }[scene];
  const english = {
    wedding:{intro:'Dates marked suitable for marriage in the traditional almanac, excluding days that list marriage as unsuitable. Filter by month, weekend and zodiac clash.',note:'Also consider both partners, family customs, venue availability and local marriage registration.',guide:'Start with a month that works for both families, then check your local weekend, venue and each partner’s zodiac. A general calendar cannot personalize a wedding date.',faq:[['Are these dates right for every couple?','No. The list uses general almanac entries, without either partner’s birth time.'],['Which time zone should I use overseas?','Use the date as a cultural reference and confirm ceremony times in your local time zone.'],['Why do sites list different dates?','Almanac editions and selection methods vary. This page uses the daily suitable/avoid entries in lunar-javascript 1.7.7.']]},
    moving:{intro:'Dates marked suitable for moving or moving into a home, excluding dates marked unsuitable for either. Moving belongings and entering the home may be separate events.',note:'Check lease terms, key handover, building access, movers and local holidays before choosing.',guide:'Choose a practical local moving day first. Then compare the general almanac entry and any zodiac clash relevant to your household.',faq:[['Are moving and moving in the same?','Some families treat moving belongings and entering a new home as separate steps.'],['Is a weekend always better?','It can be easier to arrange, but check local services and building rules.'],['Does the list consider home direction?','No. It uses general daily almanac entries without a home layout or personal birth details.']]},
    opening:{intro:'Dates marked suitable for opening a business in the traditional almanac, excluding dates marked unsuitable for opening.',note:'Also check local permits, opening hours, staff, suppliers and promotion readiness.',guide:'Choose a day that suits your customers and team locally, then compare the general almanac reference and family traditions.',faq:[['Does this apply to an online launch?','It can be a symbolic start date; operational readiness and customer time zones should lead.'],['Must an opening be on a weekend?','No. Consider local traffic and staffing.'],['Does a date guarantee business success?','No. This is a cultural reference, not a business forecast.']]}
  }[scene];
  const data = SCENE_DATA[scene];
  const monthSelect = document.querySelector('#month');
  const zodiacSelect = document.querySelector('#zodiac');
  const months = en ? ['January','February','March','April','May','June','July','August','September','October','November','December'] : Array.from({length:12},(_,i)=>`${i+1}月`);
  monthSelect.add(new Option(en?'All months':zh('全部月份'),'all'));
  months.forEach((name,i)=>monthSelect.add(new Option(name,String(i+1))));
  const zodiac = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  zodiacSelect.add(new Option(en?'Any':zh('不限'),'any'));
  zodiac.forEach(name=>zodiacSelect.add(new Option(en?({鼠:'Rat',牛:'Ox',虎:'Tiger',兔:'Rabbit',龙:'Dragon',蛇:'Snake',马:'Horse',羊:'Goat',猴:'Monkey',鸡:'Rooster',狗:'Dog',猪:'Pig'}[name]):zh(name),name)));
  const t = (cn,englishText) => en ? englishText : zh(cn);
  document.title = (en ? copy.english : zh(copy.title)) + ' | Auspicious';
  document.querySelector('meta[name="description"]').content = en ? english.intro : zh(copy.intro);
  document.querySelector('.header-links a').textContent = t('万年历','Calendar');
  document.querySelector('#scene-title').textContent = en ? copy.english : zh(copy.title);
  document.querySelector('#scene-intro').textContent = en ? english.intro : zh(copy.intro);
  document.querySelector('#scene-note').textContent = en ? english.note : zh(copy.note);
  document.querySelector('#scene-guide').textContent = en ? english.guide : zh(copy.guide);
  document.querySelector('#note-title').textContent = t('择日前先核对实际安排','Plan the practical details first');
  document.querySelector('#month-label').textContent = t('月份','Month');
  document.querySelector('#zodiac-label').textContent = t('避开我的生肖相冲','Avoid my zodiac clash');
  document.querySelector('#weekend-label').textContent = t('只看周六、周日','Saturday and Sunday only');
  document.querySelector('#results-title').textContent = en ? copy.english : zh(copy.title);
  document.querySelector('#guide-title').textContent = t('如何使用这些日期','How to use these dates');
  document.querySelector('#faq-title').textContent = t('常见问题','FAQ');
  document.querySelector('#faq').innerHTML = (en?english.faq:copy.faq).map(([q,a])=>`<details><summary>${en?q:zh(q)}</summary><p>${en?a:zh(a)}</p></details>`).join('');
  document.querySelector('#source-note').textContent = t('数据方法：使用 lunar-javascript 1.7.7 的每日宜忌，筛出对应事项为“宜”、且不在“忌”中的日期。生肖相冲为通用参考，未使用个人八字。','Method: dates use daily suitable/avoid entries from lunar-javascript 1.7.7. Zodiac clash is a general reference; birth charts are not included.');
  document.querySelector('#related-title').textContent = t('查看其他场景','Other date guides');
  document.querySelectorAll('[data-scene-link]').forEach(a=>a.textContent=en?({wedding:'Wedding dates',moving:'Moving dates',opening:'Grand opening dates'}[a.dataset.sceneLink]):zh(({wedding:'结婚吉日',moving:'搬家吉日',opening:'开业吉日'}[a.dataset.sceneLink])));
  const saved = new Set(JSON.parse(localStorage.getItem('auspicious-saved-v2')||'[]'));
  let savedOnly = false;
  const grid = document.querySelector('#grid');
  function render(){
    const zodiac = zodiacSelect.value;
    const month = monthSelect.value;
    const weekend = document.querySelector('#weekends').checked;
    const filtered=data.filter(row=>(month==='all'||row.month===Number(month))&&(!weekend||row.week===0||row.week===6)&&(zodiac==='any'||row.clash!==zodiac)&&(!savedOnly||saved.has(scene+':'+row.date)));
    document.querySelector('#count').textContent=t(`共 ${filtered.length} 天，全年 ${data.length} 天`,`Showing ${filtered.length} of ${data.length} dates`);
    grid.innerHTML=filtered.length?filtered.map(row=>{const id=scene+':'+row.date;const isSaved=saved.has(id);return `<article class="date-card"><div class="date">${en?months[row.month-1]+' '+row.day+', 2027':`2027年${row.month}月${row.day}日`}</div><div class="meta">${en?['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][row.week]:'周'+'日一二三四五六'[row.week]} · ${t('农历','Lunar')} ${zh(row.lunar)}</div><div class="reason">${t('黄历宜','Almanac: suitable for')} ${zh(row.yi)} · ${t('冲','Clash')} ${en?zodiacSelect.querySelector(`option[value="${row.clash}"]`)?.textContent:zh(row.clash)}</div><div class="actions"><a href="/huangli?date=${row.date}">${t('查看黄历详情','View almanac details')}</a><button type="button" class="save" data-id="${id}" aria-pressed="${isSaved}">${isSaved?t('♥ 已收藏','♥ Saved'):t('♡ 收藏','♡ Save')}</button></div></article>`}).join(''):`<div class="empty">${t('没有符合筛选条件的日期，请调整月份或生肖。','No dates match these filters. Try another month or zodiac.')}</div>`;
    document.querySelector('#saved').textContent=t(`收藏 ${saved.size}`,`Saved ${saved.size}`);
  }
  grid.addEventListener('click',e=>{const button=e.target.closest('.save');if(!button)return;const id=button.dataset.id;saved.has(id)?saved.delete(id):saved.add(id);localStorage.setItem('auspicious-saved-v2',JSON.stringify([...saved]));render()});
  document.querySelector('#saved').addEventListener('click',()=>{savedOnly=!savedOnly;document.querySelector('#saved').setAttribute('aria-pressed',savedOnly);render()});
  [monthSelect,zodiacSelect,document.querySelector('#weekends')].forEach(el=>el.addEventListener('change',render));
  render();
})();
