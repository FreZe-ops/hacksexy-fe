/**
 * Login local auth → mở /casino/room/C04 → kiểm tra API bảng cầu kèo.
 *   node scripts/probe-room-c04.mjs
 */
import { firefox } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AUTH = process.env.AUTH_URL || 'http://localhost:1235';
const CASINO = process.env.CASINO_URL || 'http://localhost:3201';
const FE = process.env.FE_URL || 'http://localhost:3000';
const TABLE = process.env.TABLE_NAME || 'C04';
const USER = process.env.TEST_USER || 'bminr88';
const PASS = process.env.TEST_PASS || 'bminr88123';

const report = {
  auth: {},
  api: {},
  page: {},
  checks: {},
};

async function ensureUser() {
  const loginRes = await fetch(`${AUTH}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USER, password: PASS }),
  });
  const loginBody = await loginRes.json().catch(() => ({}));
  report.auth.loginStatus = loginRes.status;
  if (loginRes.ok && loginBody.access_token) {
    report.auth.token = loginBody.access_token.slice(0, 24) + '...';
    return loginBody.access_token;
  }

  const regRes = await fetch(`${AUTH}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USER, password: PASS, phone: '0900000000' }),
  });
  const regBody = await regRes.json().catch(() => ({}));
  report.auth.registerStatus = regRes.status;

  const login2 = await fetch(`${AUTH}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USER, password: PASS }),
  });
  const login2Body = await login2.json().catch(() => ({}));
  report.auth.loginAfterRegister = login2.status;
  if (!login2.ok) throw new Error(`Login failed: ${login2.status} ${JSON.stringify(login2Body)}`);
  report.auth.token = login2Body.access_token.slice(0, 24) + '...';
  return login2Body.access_token;
}

function validateTablePayload(data) {
  const checks = {
    hasTableName: data?.tableName === TABLE,
    hasPercentCurrent: data?.percentCurrent != null,
    percentHasRound:
      data?.percentCurrent?.round != null || data?.percentCurrent?.Round != null,
    hasTotalRound: Array.isArray(data?.totalRound),
    totalRoundCount: Array.isArray(data?.totalRound) ? data.totalRound.length : 0,
    totalRoundSampleFields: null,
    hasAi0: data?.ai0 != null,
    hasAi1: data?.ai1 != null,
    hasTimeCurrent: data?.timeCurrent != null,
    hasDealerImage: !!data?.dealerImage,
    maintenance: data?.maintenance,
    shuffle: data?.shuffle,
  };
  if (checks.totalRoundCount > 0) {
    const sample = data.totalRound[data.totalRound.length - 1];
    checks.totalRoundSampleFields = {
      keys: Object.keys(sample || {}),
      hasStampTime: sample?.stampTime != null,
      hasResult: sample?.result != null || sample?.winner != null || sample?.win != null,
    };
  }
  checks.okForFeRoad =
    checks.hasPercentCurrent &&
    checks.hasTotalRound &&
    checks.totalRoundCount > 0 &&
    checks.hasAi0;
  return checks;
}

const token = await ensureUser();

const apiRes = await fetch(
  `${CASINO}/predict/get-table-by-name?tableName=${TABLE}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const apiText = await apiRes.text();
let apiData = {};
try {
  apiData = JSON.parse(apiText);
} catch {
  apiData = { raw: apiText.slice(0, 200) };
}
report.api.status = apiRes.status;
report.api.bodyLen = apiText.length;
report.checks = validateTablePayload(apiData);

const browser = await firefox.launch({ headless: true });
const context = await browser.newContext();
await context.addCookies([
  {
    name: 'access_token',
    value: token,
    domain: 'localhost',
    path: '/',
    sameSite: 'Lax',
  },
]);
const page = await context.newPage();
const apiCalls = [];
page.on('response', async (res) => {
  const u = res.url();
  if (u.includes('get-table-by-name')) {
    let body = '';
    try {
      body = await res.text();
    } catch {}
    apiCalls.push({ status: res.status(), url: u.slice(0, 120), len: body.length });
  }
});

await page.goto(`${FE}/casino/room/${TABLE}`, {
  waitUntil: 'networkidle',
  timeout: 90000,
});

await page.waitForTimeout(8000);

report.page.url = page.url();
report.page.title = await page.title();
report.page.hasBigRoad = (await page.locator('.big-road, [class*="BigRoad"], canvas').count()) > 0;
report.page.hasResultTable = (await page.locator('table, [class*="result"], [class*="ResultTable"]').count()) > 0;
report.page.bodySnippet = (await page.locator('body').innerText().catch(() => ''))
  .replace(/\s+/g, ' ')
  .slice(0, 400);
report.page.apiCalls = apiCalls;

const out = path.join(ROOT, 'probe-room-c04-report.json');
fs.writeFileSync(out, JSON.stringify(report, null, 2));

console.log('=== Room C04 probe ===');
console.log('Auth login:', report.auth.loginStatus || report.auth.loginAfterRegister);
console.log('API direct:', report.api.status, 'bytes', report.api.bodyLen);
console.log('Checks:', JSON.stringify(report.checks, null, 2));
console.log('Page API calls:', apiCalls.length, apiCalls[0] || 'none');
console.log('Page URL:', report.page.url);
console.log('Report:', out);

await browser.close();
process.exit(report.checks.okForFeRoad && report.api.status === 200 ? 0 : 1);
