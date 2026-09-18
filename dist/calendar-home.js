(() => {
  const calendar = document.querySelector('.calendar-module');
  const grid = calendar.querySelector('.cal-grid');
  const summary = calendar.querySelector('.cal-info');
  const year = calendar.querySelector('#cal-year');
  const month = calendar.querySelector('#cal-month');
  const holidays = calendar.querySelector('#cal-holidays');
  const today = new Date();
  const dateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  let selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let visible = new Date(selected.getFullYear(), selected.getMonth(), 1);
  const lunar = date => Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate()).getLunar();
  const holiday = date => HolidayUtil.getHoliday(dateKey(date));
  const label = (date, moon) => moon.getJieQi() || (moon.getFestivals()[0]) || moon.getOtherFestivals()[0] || (moon.getDayInChinese() === '初一' ? moon.getMonthInChinese() + '月' : moon.getDayInChinese());
  const week = '日一二三四五六';
  for (let y = 1900; y <= 2100; y++) year.add(new Option(y + '年', y));
  for (let m = 1; m <= 12; m++) month.add(new Option(m + '月', m));
  function select(date) {
    selected = date;
    grid.querySelectorAll('.cal-day').forEach(node => node.classList.toggle('selected', node.dataset.date === dateKey(date)));
    const moon = lunar(date);
    const event = label(date, moon);
    const status = holiday(date);
    const statusText = status ? (status.isWork() ? '补班' : status.getName() + '假期') : '';
    const title = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日　周${week[date.getDay()]}`;
    summary.href = '/huangli/?date=' + dateKey(date);
    summary.innerHTML = `<div class="cal-summary-title"><span>${title}</span><span>查看黄历详情 ›</span></div><div class="cal-summary-body"><div class="cal-lunar"><strong>${moon.getMonthInChinese()}月${moon.getDayInChinese()}</strong><small>${moon.getYearInGanZhi()}年 · ${moon.getYearShengXiao()}${event ? ' · ' + event : ''}${statusText ? ' · ' + statusText : ''}</small></div><div class="cal-yi-ji"><div><b class="yi">宜</b>${moon.getDayYi().slice(0, 8).join(' · ')}</div><div><b class="ji">忌</b>${moon.getDayJi().slice(0, 8).join(' · ')}</div></div></div>`;
  }
  function render() {
    const y = visible.getFullYear();
    const m = visible.getMonth();
    year.value = y;
    month.value = m + 1;
    grid.replaceChildren();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    const count = Math.ceil((offset + new Date(y, m + 1, 0).getDate()) / 7) * 7;
    for (let i = 0; i < count; i++) {
      const date = new Date(y, m, i - offset + 1);
      const moon = lunar(date);
      const status = holidays.checked ? holiday(date) : null;
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-day';
      if (date.getMonth() !== m) cell.classList.add('muted');
      if (i % 7 > 4) cell.classList.add('red');
      if (status && !status.isWork()) cell.classList.add('holiday');
      cell.dataset.date = dateKey(date);
      cell.setAttribute('aria-label', `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日，农历${moon.getMonthInChinese()}月${moon.getDayInChinese()}`);
      const mark = status ? `<em class="cal-badge ${status.isWork() ? 'work' : ''}">${status.isWork() ? '班' : '休'}</em>` : '';
      const isToday = dateKey(date) === dateKey(today) ? '<em class="cal-badge today-badge">今</em>' : mark;
      cell.innerHTML = `<span>${date.getDate()}</span><small>${label(date, moon)}</small>${isToday}`;
      cell.addEventListener('click', () => {
        if (date.getMonth() !== visible.getMonth() || date.getFullYear() !== visible.getFullYear()) {
          visible = new Date(date.getFullYear(), date.getMonth(), 1);
          render();
        }
        select(date);
      });
      grid.append(cell);
    }
    select(selected);
  }
  function setMonth(y, m) {
    visible = new Date(y, m, 1);
    selected = new Date(visible.getFullYear(), visible.getMonth(), 1);
    render();
  }
  calendar.querySelector('#cal-prev').addEventListener('click', () => setMonth(visible.getFullYear(), visible.getMonth() - 1));
  calendar.querySelector('#cal-next').addEventListener('click', () => setMonth(visible.getFullYear(), visible.getMonth() + 1));
  calendar.querySelector('#cal-today').addEventListener('click', () => { visible = new Date(today.getFullYear(), today.getMonth(), 1); selected = new Date(today.getFullYear(), today.getMonth(), today.getDate()); render(); });
  year.addEventListener('change', () => setMonth(Number(year.value), visible.getMonth()));
  month.addEventListener('change', () => setMonth(visible.getFullYear(), Number(month.value) - 1));
  holidays.addEventListener('change', render);
  const fromDetail = new URLSearchParams(location.search).get('date');
  if (/^\d{4}-\d{2}-\d{2}$/.test(fromDetail || '')) {
    const [y, m, d] = fromDetail.split('-').map(Number);
    const parsed = new Date(y, m - 1, d);
    if (parsed.getFullYear() === y && parsed.getMonth() === m - 1 && parsed.getDate() === d) {
      selected = parsed;
      visible = new Date(y, m - 1, 1);
    }
  }
  render();
})();
