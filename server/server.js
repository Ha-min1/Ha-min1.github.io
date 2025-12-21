require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MySQL 연결 풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'yourpassword',
    database: process.env.DB_NAME || 'yourdbname',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// 데이터베이스 초기화 함수
async function initDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // 메시지 테이블 생성 (없으면)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user VARCHAR(50) NOT NULL DEFAULT 'user',
                text TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        // 시드: 메시지 테이블이 비어있으면 초기 시스템 메시지 삽입
        const [countRows] = await connection.execute('SELECT COUNT(*) as cnt FROM messages');
        if (countRows && countRows[0] && countRows[0].cnt === 0) {
            await connection.execute("INSERT INTO messages (user, text) VALUES ('system', '채팅 시스템이 시작되었습니다.')");
            console.log('✓ Seeded initial message into messages table');
        }

        console.log('✓ Database initialized successfully');
        connection.release();
    } catch (err) {
        console.error('✗ Database initialization error:', err);
    }
}

// 정적 파일 서빙 (테스트용)
app.use(express.static(path.join(__dirname, 'public')));

// 헬스 체크 엔드포인트
app.get('/_health', (req, res) => res.send('OK'));

// GET /api/messages - 모든 메시지 조회
app.get('/api/messages', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT id, user, text, timestamp FROM messages ORDER BY id ASC'
        );
        connection.release();
        
        res.json(rows);
    } catch (err) {
        console.error('메시지 조회 오류:', err);
        res.status(500).json({ error: '메시지 조회 실패' });
    }
});

// POST /api/messages - 새 메시지 저장
app.post('/api/messages', async (req, res) => {
    const { text, user = 'me' } = req.body;
    
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: '메시지 텍스트가 필요합니다' });
    }
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO messages (user, text) VALUES (?, ?)',
            [user, text.trim()]
        );
        
        // 저장된 메시지 조회
        const [rows] = await connection.execute(
            'SELECT id, user, text, timestamp FROM messages WHERE id = ?',
            [result.insertId]
        );
        
        connection.release();
        
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('메시지 저장 오류:', err);
        res.status(500).json({ error: '메시지 저장 실패' });
    }
});

// DELETE /api/messages/:id - 메시지 삭제 (선택사항)
app.delete('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'DELETE FROM messages WHERE id = ?',
            [id]
        );
        connection.release();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '메시지를 찾을 수 없습니다' });
        }
        
        res.json({ success: true, message: '메시지가 삭제되었습니다' });
    } catch (err) {
        console.error('메시지 삭제 오류:', err);
        res.status(500).json({ error: '메시지 삭제 실패' });
    }
});

// 서버 시작
(async () => {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log(`✓ 채팅 서버가 포트 ${PORT}에서 실행 중입니다`);
        console.log(`✓ MariaDB 연결: ${process.env.DB_HOST || 'localhost'}`);
    });
})();

// 종료 시 풀 닫기
process.on('SIGTERM', () => {
    pool.end();
    console.log('데이터베이스 연결을 종료했습니다');
    process.exit(0);
});
