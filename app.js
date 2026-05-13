const DATA_URL = './public/data/kleague1-2026.json';
const REFRESH_MS = 15 * 60 * 1000;

const matchesBody = document.getElementById('matchesBody');
const updatedAt = document.getElementById('updatedAt');
const summary = document.getElementById('summary');
const teamFilter = document.getElementById('teamFilter');
const roundFilter = document.getElementById('roundFilter');
const statusFilter = document.getElementById('statusFilter');
const refreshBtn = document.getElementById('refreshBtn');

let allMatches = [];

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

function statusLabel(status) {
  return ({ SCHEDULED: '예정', IN_PLAY: '진행중', FINISHED: '종료' }[status] || status || '-');
}

function scoreText(match) {
  if (match.status !== 'FINISHED' && match.status !== 'IN_PLAY') return '-';
  return `${match.homeScore ?? 0} : ${match.awayScore ?? 0}`;
}

function renderSummary(matches) {
  const total = matches.length;
  const finished = matches.filter((m) => m.status === 'FINISHED').length;
  const scheduled = matches.filter((m) => m.status === 'SCHEDULED').length;
  const live = matches.filter((m) => m.status === 'IN_PLAY').length;
  summary.textContent = `전체 ${total}경기 · 종료 ${finished} · 예정 ${scheduled} · 진행중 ${live}`;
}

function render() {
  const teamQ = teamFilter.value.trim().toLowerCase();
  const roundQ = roundFilter.value.trim().toLowerCase();
  const statusQ = statusFilter.value;

  const filtered = allMatches.filter((m) => {
    const byTeam = !teamQ || m.homeTeam.toLowerCase().includes(teamQ) || m.awayTeam.toLowerCase().includes(teamQ);
    const byRound = !roundQ || (String(m.round || '')).toLowerCase().includes(roundQ);
    const byStatus = !statusQ || m.status === statusQ;
    return byTeam && byRound && byStatus;
  });

  if (!filtered.length) {
    matchesBody.innerHTML = '<tr><td colspan="7" class="empty">조건에 맞는 경기가 없습니다.</td></tr>';
    return;
  }

  matchesBody.innerHTML = filtered
    .map((m) => `
    <tr>
      <td>${formatDate(m.kickoff)}</td>
      <td>${m.round || '-'}</td>
      <td>${m.homeTeam}</td>
      <td>${scoreText(m)}</td>
      <td>${m.awayTeam}</td>
      <td>${m.venue || '-'}</td>
      <td class="status-${m.status}">${statusLabel(m.status)}</td>
    </tr>
  `)
    .join('');
}

async function loadData() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('데이터 로드 실패');
  const data = await res.json();
  allMatches = data.matches || [];
  updatedAt.textContent = `데이터 갱신 시각: ${formatDate(data.updatedAt)}`;
  renderSummary(allMatches);
  render();
}

async function refresh() {
  try {
    await loadData();
  } catch (e) {
    updatedAt.textContent = `오류: ${e.message}`;
    summary.textContent = '데이터를 불러오지 못했습니다.';
  }
}

[teamFilter, roundFilter, statusFilter].forEach((el) => el.addEventListener('input', render));
refreshBtn.addEventListener('click', refresh);

refresh();
setInterval(refresh, REFRESH_MS);
