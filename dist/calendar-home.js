(function () {
  const grid = document.querySelector('.cal-grid');
  const header = document.querySelector('.cal-head');
  const info = document.querySelector('.cal-info');
  const yearButton = header.querySelectorAll('button')[1];
  const todayButton = header.querySelectorAll('button')[2];
  const monthControl = header.querySelector('span');
  const today = new Date();
  let shown = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const pad = n => String(n).padStart(2, '0');
  const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const lunarFor = d => Solar.fromYmd(d.getFullYear(), d.getMonth() + 1, d.getDate()).getLunar();
  const desc = d => {
    const lunar = lunarFor(d);
    return lunar.getJieQi() || lunar.getFestivals()[0] || lunar.getOtherFestivals()[0] || (lunar.getDayInChinese() === '初一' ? lunar.getMonthInChinese() + '月' : lunar.getDayInChinese());
  };
  function select(d) {
    selected = d;
    grid.querySelectorAll('.cal-day').forEach(el => el.classList.toggle('selected', el.dataset.date === key(d)));
    const lunar = lunarFor(d);
    const href = '/huangli/2026-09-18?date=' + key(d);
    info.href = href;
    info.innerHTML = `<strong>${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日　${desc(d)}　查看详情 ›</strong><div><b>${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}</b>　宜 ${lunar.getDayYi().slice(0, 7).join('·')}</div><div>忌 ${lunar.getDayJi().slice(0, 7).join('·')}</div>`;
  }
  function render() {
    const y = shown.getFullYear(), m = shown.getMonth();
    yearButton.textContent = y + '年⌄';
    monthControl.innerHTML = `<button type="button" data-shift="-1" aria-label="上个月">‹</button><span>${m + 1}月</span><button type="button" data-shift="1" aria-label="下个月">›</button>`;
    grid.innerHTML = '';
    const first = (new Date(y, m, 1).getDay() + 6) % 7;
    const cells = Math.ceil((first + new Date(y, m + 1, 0).getDate()) / 7) * 7;
    for (let i = 0; i < cells; i++) {
      const d = new Date(y, m, i - first + 1);
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'cal-day' + (d.getMonth() !== m ? ' muted' : '') + (i % 7 > 4 ? ' red' : '');
      el.dataset.date = key(d);
      el.innerHTML = `${d.getDate()}<small>${desc(d)}</small>`;
      el.addEventListener('click', () => { if (d.getMonth() !== shown.getMonth()) shown = new Date(d.getFullYear(), d.getMonth(), 1); render(); select(d); });
      grid.appendChild(el);
    }
    select(selected);
  }
  monthControl.addEventListener('click', e => {
    const shift = Number(e.target.dataset.shift);
    if (!shift) return;
    shown = new Date(shown.getFullYear(), shown.getMonth() + shift, 1);
    selected = new Date(shown.getFullYear(), shown.getMonth(), 1);
    render();
  });
  yearButton.addEventListener('click', () => {
    const value = prompt('输入年份（1900–2100）', shown.getFullYear());
    if (value === null) return;
    const year = Number(value);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) return;
    shown = new Date(year, shown.getMonth(), 1);
    selected = new Date(year, shown.getMonth(), 1);
    render();
  });
  todayButton.addEventListener('click', () => { shown = new Date(today.getFullYear(), today.getMonth(), 1); selected = new Date(today.getFullYear(), today.getMonth(), today.getDate()); render(); });
  render();
})();
