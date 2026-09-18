(() => {
  const language = SiteLocale.language;
  const cn = {
    title:'万年历与吉日查询',intro:'查看农历、节气与传统黄历，再结合当地时间安排婚礼、搬家或开业。',scenes:'按事项查找 2027 年吉日',
    wedding:'结婚吉日',moving:'搬家吉日',opening:'开业吉日',
    weddingDesc:'查看宜嫁娶的日期，并核对双方生肖与当地婚礼安排。',movingDesc:'比较移徙、入宅参考日期与当地搬家条件。',openingDesc:'寻找宜开市日期，并结合当地营业准备。',
    holidays:'显示中国大陆节假日与调休',today:'今天',timezone:'我的时区',note:'“休/班”仅指中国大陆法定假期与调休；黄历时辰按中国标准时间作民俗参考。',footer:'农历和黄历信息用于文化参考。择日还应考虑当地时间、家庭习俗和实际安排。',language:'语言 / Language'
  };
  const en = {
    title:'Chinese calendar & auspicious dates',intro:'Explore the lunar calendar, solar terms and traditional almanac, then plan with your local time and family customs.',scenes:'Find 2027 dates by occasion',
    wedding:'Wedding dates',moving:'Moving dates',opening:'Grand opening dates',
    weddingDesc:'Compare marriage dates with your family’s zodiac and local plans.',movingDesc:'Find moving and moving-in references alongside practical logistics.',openingDesc:'Find opening dates and prepare for your local business schedule.',
    holidays:'Show mainland China holidays and make-up workdays',today:'Today',timezone:'My time zone',note:'Holiday/workday badges refer only to mainland China. Hour guidance uses China Standard Time as a cultural reference.',footer:'Lunar and almanac information is a cultural reference. Confirm local time, family customs and practical plans.',language:'Language'
  };
  const values = language === 'en' ? en : language === 'zh-Hant' ? Object.fromEntries(Object.entries(cn).map(([k,v])=>[k,SiteLocale.traditional(v)])) : cn;
  document.title = values.title + ' | Auspicious';
  document.querySelector('meta[name="description"]').content = values.intro;
  for(const [id,key] of [['home-title','title'],['home-intro','intro'],['scenes-title','scenes'],['holiday-text','holidays'],['today-text','today'],['timezone-label','timezone'],['calendar-note','note'],['footer-text','footer']])document.getElementById(id).textContent=values[key];
  for(const scene of ['wedding','moving','opening']){document.getElementById(scene+'-title').textContent=values[scene];document.getElementById(scene+'-desc').textContent=values[scene+'Desc'];}
})();
