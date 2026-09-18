(function () {
  const params = new URLSearchParams(location.search);
  const raw = params.get('date') || '2026-09-18';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  let date = match ? new Date(+match[1], +match[2] - 1, +match[3]) : new Date(2026, 8, 18);
  if (!match || date.getFullYear() !== +match[1] || date.getMonth() !== +match[2] - 1 || date.getDate() !== +match[3]) date = new Date(2026, 8, 18);
  const pad = n => String(n).padStart(2, '0');
  const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function render() {
    const lunar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate()).getLunar();
    const title = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日黄历`;
    document.title = title + ' | ' + lunar.getMonthInChinese() + '月' + lunar.getDayInChinese();
    document.querySelector('meta[name="description"]').content = title + '，查看农历、宜忌、干支、冲煞和时辰。';
    document.querySelector('.top').textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    document.querySelector('.title').textContent = lunar.getMonthInChinese() + '月' + lunar.getDayInChinese();
    document.querySelector('.sub').textContent = `${lunar.getYearInGanZhi()}年　${lunar.getMonthInGanZhi()}月　${lunar.getDayInGanZhi()}日　【属${lunar.getYearShengXiao()}】　周${'日一二三四五六'[date.getDay()]}`;
    const action = document.querySelector('.actions > div:first-child');
    action.innerHTML = `<span class="pill yi">宜</span>${lunar.getDayYi().join('　')}<br><span class="pill ji">忌</span>${lunar.getDayJi().join('　')}`;
    const cells = document.querySelectorAll('.table .cell');
    cells[0].innerHTML = `<b>五行</b>${lunar.getDayNaYin()}`;
    cells[1].innerHTML = `<b>冲煞</b>冲${lunar.getDayChongDesc()} 煞${lunar.getDaySha()}`;
    cells[2].innerHTML = `<b>值神</b>${lunar.getDayTianShen()}`;
    cells[3].innerHTML = `<b>吉神宜趋</b>${lunar.getDayJiShen().join('　')}`;
    cells[4].innerHTML = `<b>凶神宜忌</b>${lunar.getDayXiongSha().join('　')}`;
    cells[5].innerHTML = `<b>彭祖百忌</b>${lunar.getPengZuGan()}，${lunar.getPengZuZhi()}`;
    const time = lunar.getTimes()[5];
    document.querySelector('.hour').innerHTML = `<span class="round">${time.getZhi()}</span><strong>${time.getGanZhi()}时　${time.getMinHm()} - ${time.getMaxHm()}</strong>　冲${time.getChongDesc()} 煞${time.getSha()}　<span class="pill ${time.getTianShenLuck() === '吉' ? 'yi' : 'ji'}">${time.getTianShenLuck()}</span><br>宜 ${time.getYi().join('　')}<br>忌 ${time.getJi().join('　')}`;
  }
  document.querySelectorAll('.nav span').forEach((el, i) => {
    el.setAttribute('role', 'button'); el.tabIndex = 0; el.style.cursor = 'pointer';
    const move = () => { date.setDate(date.getDate() + (i === 0 ? -1 : 1)); history.replaceState(null, '', '?date=' + key(date)); render(); };
    el.addEventListener('click', move);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') move(); });
  });
  render();
})();
