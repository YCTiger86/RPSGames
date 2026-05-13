import { writeFile } from 'node:fs/promises';

const SOURCE = process.env.DATA_SOURCE_URL;
if (!SOURCE) {
  console.error('DATA_SOURCE_URL 환경변수가 필요합니다.');
  process.exit(1);
}

const res = await fetch(SOURCE);
if (!res.ok) {
  throw new Error(`원본 데이터 요청 실패: ${res.status}`);
}
const raw = await res.json();

const normalized = {
  season: 2026,
  competition: 'K League 1',
  updatedAt: new Date().toISOString(),
  matches: (raw.matches || []).map((m) => ({
    kickoff: m.kickoff || m.utcDate,
    round: m.round || m.matchday || '',
    homeTeam: m.homeTeam?.name || m.homeTeam || '',
    awayTeam: m.awayTeam?.name || m.awayTeam || '',
    homeScore: m.score?.fullTime?.home ?? m.homeScore ?? null,
    awayScore: m.score?.fullTime?.away ?? m.awayScore ?? null,
    venue: m.venue || '',
    status: m.status || 'SCHEDULED'
  }))
};

await writeFile('public/data/kleague1-2026.json', JSON.stringify(normalized, null, 2));
console.log(`updated: ${normalized.matches.length} matches`);
