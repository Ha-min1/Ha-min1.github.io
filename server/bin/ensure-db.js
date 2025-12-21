#!/usr/bin/env node

/*
  ensure-db.js
  - 시도: DB 연결
  - 실패 시: docker-compose로 mariadb 서비스 기동 (가능한 경우)
  - 이후 최대 대기 시간 동안 재시도
  - 항상 0으로 종료하여 서버 시작을 방해하지 않음 (경고 로그 출력)
*/

const path = require('path');
const { spawnSync } = require('child_process');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const MAX_RETRIES = 15; // 15 * 2s = 30s
const RETRY_DELAY_MS = 2000;

async function tryConnect() {
  const hostsToTry = [];
  const envHost = process.env.DB_HOST || 'localhost';

  // 우선 환경변수 호스트 시도
  hostsToTry.push(envHost);

  // Docker로 띄운 경우 호스트에서 접속할 수 있도록 로컬 호스트도 시도
  if (!hostsToTry.includes('127.0.0.1')) hostsToTry.push('127.0.0.1');
  if (!hostsToTry.includes('localhost')) hostsToTry.push('localhost');

  for (const host of hostsToTry) {
    try {
      const conn = await mysql.createConnection({
        host,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || '',
        connectTimeout: 2000,
      });
      await conn.end();
      console.log(`✓ DB 연결 성공 (host=${host})`);
      return true;
    } catch (err) {
      // 실패면 다음 호스트로 시도
    }
  }

  return false;
}

function commandExists(cmd, args = ['--version']) {
  try {
    const res = spawnSync(cmd, args, { stdio: 'ignore' });
    return res.status === 0;
  } catch (e) {
    return false;
  }
}

function startMariadbWithDockerCompose() {
  const repoRoot = path.resolve(__dirname, '..', '..');

  // Try docker-compose then fallback to 'docker compose'
  if (commandExists('docker-compose')) {
    console.log('docker-compose 사용: mariadb 서비스 시작 중...');
    const r = spawnSync('docker-compose', ['up', '-d', 'mariadb'], { cwd: repoRoot, stdio: 'inherit' });
    return r.status === 0;
  }

  if (commandExists('docker', ['compose', 'version'])) {
    console.log('docker compose 사용: mariadb 서비스 시작 중...');
    const r = spawnSync('docker', ['compose', 'up', '-d', 'mariadb'], { cwd: repoRoot, stdio: 'inherit' });
    return r.status === 0;
  }

  return false;
}

(async function main() {
  console.log('✓ DB 자동 시작: MariaDB 연결을 확인합니다...');

  if (await tryConnect()) {
    console.log('✓ DB 연결 확인됨 — 추가 조치 불필요');
    process.exit(0);
  }

  console.warn('✗ DB 연결 실패 — 자동으로 MariaDB를 시작 시도합니다 (Docker 필요)');

  const started = startMariadbWithDockerCompose();
  if (!started) {
    console.warn('⚠️ Docker(또는 docker-compose)를 찾을 수 없거나 mariadb 시작에 실패했습니다. 수동으로 mariadb를 시작해주세요.');
    process.exit(0);
  }

  console.log('대기 중: MariaDB가 올라오기를 기다립니다...');

  for (let i = 0; i < MAX_RETRIES; i++) {
    if (await tryConnect()) {
      console.log('✓ MariaDB 연결 성공');
      process.exit(0);
    }
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    process.stdout.write('.');
  }

  console.warn('\n⚠️ MariaDB가 시간 내에 시작되지 않았습니다. 수동 확인이 필요합니다.');
  process.exit(0);
})();