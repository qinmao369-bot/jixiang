(() => {
  const allowed = ['zh-Hans', 'zh-Hant', 'en'];
  const params = new URLSearchParams(location.search);
  const requested = params.get('lang');
  const stored = localStorage.getItem('auspicious-language');
  const language = allowed.includes(requested) ? requested : (allowed.includes(stored) ? stored : 'zh-Hans');
  const toTraditional = OpenCC.Converter({from:'cn',to:'tw'});
  const english = {
    '万年历':'Calendar','黄历详情':'Almanac details','今天':'Today','选择年份':'Select year','选择月份':'Select month','上个月':'Previous month','下个月':'Next month','显示中国大陆节假日与调休':'Show mainland China holidays and make-up workdays','中国大陆假期':'Mainland China holiday','补班':'Make-up workday','休':'Holiday','班':'Workday','查看黄历详情':'View almanac details','宜':'Suitable','忌':'Avoid','农历':'Lunar','周':'Weekday','当地今天':'Today locally','本地时区':'Local time zone','北京时区':'Beijing time','婚礼吉日':'Wedding dates','搬家吉日':'Moving dates','开业吉日':'Grand opening dates','全部月份':'All months','仅周末':'Weekends only','避开生肖相冲':'Avoid zodiac clash','我的生肖':'My zodiac','不限':'Any','已收藏':'Saved','收藏':'Save','查看日期':'View date','日期':'Date','冲':'Clash','筛选结果':'Results','吉日查询':'Find auspicious dates','选择事项':'Choose an activity','查询未来90天':'Search next 90 days','前一天':'Previous day','后一天':'Next day','返回万年历':'Back to calendar','时辰吉凶':'Hour guidance','五行':'Five elements','冲煞':'Zodiac clash','值神':'Day deity','吉神宜趋':'Favorable influences','凶神宜忌':'Unfavorable influences','彭祖百忌':'Traditional taboos','建除十二神':'Day officer','今日胎神':'Fetal deity','二十八星宿':'Lunar mansion','结婚':'Wedding','搬家':'Moving','搬新房':'Moving in','开业':'Opening','出行':'Travel','动土':'Construction','安葬':'Burial','祭祀':'Ritual','签订合同':'Signing contracts','祈福':'Prayer','子':'Rat','丑':'Ox','寅':'Tiger','卯':'Rabbit','辰':'Dragon','巳':'Snake','午':'Horse','未':'Goat','申':'Monkey','酉':'Rooster','戌':'Dog','亥':'Pig'
  };
  function text(value) { return language === 'zh-Hant' ? toTraditional(value) : language === 'en' ? (english[value] || value) : value; }
  function set(next) { if (!allowed.includes(next)) return; localStorage.setItem('auspicious-language', next); location.reload(); }
  function mount() {
    const selector = document.querySelector('#site-language');
    if (selector) { selector.value = language; selector.addEventListener('change', () => set(selector.value)); }
    document.documentElement.lang = language === 'zh-Hans' ? 'zh-CN' : language === 'zh-Hant' ? 'zh-Hant' : 'en';
  }
  window.SiteLocale = {language,text,set,mount,traditional:toTraditional};
  document.addEventListener('DOMContentLoaded', mount);
})();
