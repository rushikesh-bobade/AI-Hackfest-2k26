import snowflake from "snowflake-sdk";

const SF_CONFIG = {
  account: process.env.SNOWFLAKE_ACCOUNT ?? "",
  username: process.env.SNOWFLAKE_USER ?? "",
  password: process.env.SNOWFLAKE_PASSWORD ?? "",
  database: process.env.SNOWFLAKE_DATABASE ?? "",
  schema: process.env.SNOWFLAKE_SCHEMA ?? "PUBLIC",
  warehouse: process.env.SNOWFLAKE_WAREHOUSE ?? "PAPER_WH",
};

// Disable OOB telemetry to avoid console noise
snowflake.configure({ logLevel: "ERROR" });

let _connection: snowflake.Connection | null = null;
let _initDone = false;

const QUALIFIED_TABLE = `${SF_CONFIG.database}.${SF_CONFIG.schema}.PAPER_ANALYSES`;

function getConnection(): Promise<snowflake.Connection> {
  return new Promise((resolve, reject) => {
    if (_connection) {
      resolve(_connection);
      return;
    }

    const conn = snowflake.createConnection(SF_CONFIG);
    conn.connect(async (err, c) => {
      if (err) {
        console.error("Snowflake connection failed:", err.message);
        reject(err);
      } else {
        _connection = c;
        // Explicitly set database and schema context
        try {
          await executeQuery(c, `USE DATABASE ${SF_CONFIG.database}`);
          await executeQuery(c, `USE SCHEMA ${SF_CONFIG.schema}`);
          console.log(`[Snowflake] Database context set: ${SF_CONFIG.database}.${SF_CONFIG.schema}`);
        } catch (ctxErr: any) {
          console.warn("[Snowflake] Failed to set context:", ctxErr.message);
        }
        resolve(c);
      }
    });
  });
}

function executeQuery(conn: snowflake.Connection, sql: string, binds: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) {
          console.error("Snowflake query error:", err.message, "\nSQL:", sql);
          reject(err);
        } else {
          resolve(rows ?? []);
        }
      },
    });
  });
}

export async function initTables(): Promise<void> {
  if (_initDone) return;

  try {
    const conn = await getConnection();

    await executeQuery(
      conn,
      `CREATE TABLE IF NOT EXISTS ${QUALIFIED_TABLE} (
        ID VARCHAR(100) PRIMARY KEY,
        USER_ID VARCHAR(100),
        TITLE VARCHAR(1000),
        AUTHORS VARCHAR(2000),
        UPLOAD_DATE TIMESTAMP_NTZ,
        WORD_COUNT INTEGER,
        FILE_NAME VARCHAR(500),
        CREDIBILITY_SCORE INTEGER,
        CLAIM_COUNT INTEGER,
        TOKENS_COST INTEGER,
        STATUS VARCHAR(50) DEFAULT 'complete',
        SUMMARY TEXT,
        CLAIMS TEXT,
        CONTRADICTIONS TEXT,
        REBUTTAL TEXT,
        REBUTTAL_SNIPPET VARCHAR(500),
        AUDIO_URL VARCHAR(500),
        CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )`
    );

    await executeQuery(
      conn,
      `CREATE TABLE IF NOT EXISTS ${SF_CONFIG.database}.${SF_CONFIG.schema}.USERS (
        ID VARCHAR(100) PRIMARY KEY,
        NAME VARCHAR(200),
        EMAIL VARCHAR(300) UNIQUE,
        PASSWORD_HASH VARCHAR(500),
        AVATAR VARCHAR(10) DEFAULT 'DD',
        TOKENS_REMAINING INTEGER DEFAULT 5000,
        TOKENS_USED INTEGER DEFAULT 0,
        CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )`
    );

    _initDone = true;
    console.log("[Snowflake] Tables initialized.");
  } catch (e: any) {
    console.error("[Snowflake] Table init failed:", e.message);
  }
}

// ---- AUTH FUNCTIONS ----

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export async function registerUser(name: string, email: string, password: string): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const conn = await getConnection();
    await initTables();

    // Check if email already exists
    const existing = await executeQuery(
      conn,
      `SELECT ID FROM ${SF_CONFIG.database}.${SF_CONFIG.schema}.USERS WHERE EMAIL = ?`,
      [email.toLowerCase()]
    );
    if (existing.length > 0) {
      return { success: false, error: "Email already registered. Please sign in." };
    }

    const userId = `user-${Date.now().toString(36)}`;
    const passwordHash = simpleHash(password);
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

    await executeQuery(
      conn,
      `INSERT INTO ${SF_CONFIG.database}.${SF_CONFIG.schema}.USERS (ID, NAME, EMAIL, PASSWORD_HASH, AVATAR) VALUES (?, ?, ?, ?, ?)`,
      [userId, name, email.toLowerCase(), passwordHash, initials]
    );

    console.log(`[Snowflake] User registered: ${email}`);
    return {
      success: true,
      user: { id: userId, name, email: email.toLowerCase(), avatar: initials, tokensRemaining: 5000, tokensUsed: 0 },
    };
  } catch (e: any) {
    console.error("[Snowflake] Register failed:", e.message);
    return { success: false, error: "Registration failed. Please try again." };
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const conn = await getConnection();
    await initTables();

    const passwordHash = simpleHash(password);
    const rows = await executeQuery(
      conn,
      `SELECT * FROM ${SF_CONFIG.database}.${SF_CONFIG.schema}.USERS WHERE EMAIL = ? AND PASSWORD_HASH = ?`,
      [email.toLowerCase(), passwordHash]
    );

    if (rows.length === 0) {
      return { success: false, error: "Invalid email or password." };
    }

    const row = rows[0] as any;
    console.log(`[Snowflake] User logged in: ${email}`);
    return {
      success: true,
      user: {
        id: row.ID,
        name: row.NAME,
        email: row.EMAIL,
        avatar: row.AVATAR,
        tokensRemaining: row.TOKENS_REMAINING ?? 5000,
        tokensUsed: row.TOKENS_USED ?? 0,
      },
    };
  } catch (e: any) {
    console.error("[Snowflake] Login failed:", e.message);
    return { success: false, error: "Login failed. Please try again." };
  }
}

export interface StoredAnalysis {
  id: string;
  userId: string;
  title: string;
  authors: string[];
  uploadDate: string;
  wordCount: number;
  fileName: string;
  credibilityScore: number;
  claimCount: number;
  tokensCost: number;
  status: string;
  summary: string;
  claims: any[];
  contradictions: any[];
  rebuttal: string;
  rebuttalSnippet: string;
  audioUrl: string;
}

export async function saveAnalysis(analysis: StoredAnalysis): Promise<void> {
  try {
    const conn = await getConnection();
    await initTables();

    await executeQuery(
      conn,
      `INSERT INTO ${QUALIFIED_TABLE} (ID, USER_ID, TITLE, AUTHORS, UPLOAD_DATE, WORD_COUNT, FILE_NAME, CREDIBILITY_SCORE, CLAIM_COUNT, TOKENS_COST, STATUS, SUMMARY, CLAIMS, CONTRADICTIONS, REBUTTAL, REBUTTAL_SNIPPET, AUDIO_URL)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?`,
      [
        analysis.id,
        analysis.userId,
        analysis.title,
        JSON.stringify(analysis.authors),
        analysis.uploadDate,
        analysis.wordCount,
        analysis.fileName,
        analysis.credibilityScore,
        analysis.claimCount,
        analysis.tokensCost,
        analysis.status,
        analysis.summary,
        JSON.stringify(analysis.claims),
        JSON.stringify(analysis.contradictions),
        analysis.rebuttal,
        analysis.rebuttalSnippet,
        analysis.audioUrl,
      ]
    );
    console.log(`[Snowflake] Analysis ${analysis.id} saved.`);
  } catch (e: any) {
    console.error("[Snowflake] Save failed:", e.message);
    // Non-fatal: analysis still works even if Snowflake fails
  }
}

export async function getAnalysisHistory(userId: string): Promise<StoredAnalysis[]> {
  try {
    const conn = await getConnection();
    await initTables();

    const rows = await executeQuery(
      conn,
      `SELECT * FROM ${QUALIFIED_TABLE} WHERE USER_ID = ? ORDER BY CREATED_AT DESC LIMIT 50`,
      [userId]
    );

    return rows.map((row: any) => ({
      id: row.ID,
      userId: row.USER_ID,
      title: row.TITLE,
      authors: safeJsonParse(row.AUTHORS, []),
      uploadDate: row.UPLOAD_DATE,
      wordCount: row.WORD_COUNT,
      fileName: row.FILE_NAME,
      credibilityScore: row.CREDIBILITY_SCORE,
      claimCount: row.CLAIM_COUNT,
      tokensCost: row.TOKENS_COST,
      status: row.STATUS,
      summary: row.SUMMARY ?? "",
      claims: safeJsonParse(row.CLAIMS, []),
      contradictions: safeJsonParse(row.CONTRADICTIONS, []),
      rebuttal: row.REBUTTAL ?? "",
      rebuttalSnippet: row.REBUTTAL_SNIPPET ?? "",
      audioUrl: row.AUDIO_URL ?? "",
    }));
  } catch (e: any) {
    console.error("[Snowflake] History query failed:", e.message);
    return [];
  }
}

export async function getAnalysisById(analysisId: string): Promise<StoredAnalysis | null> {
  try {
    const conn = await getConnection();
    await initTables();

    const rows = await executeQuery(
      conn,
      `SELECT * FROM ${QUALIFIED_TABLE} WHERE ID = ?`,
      [analysisId]
    );

    if (rows.length === 0) return null;
    const row = rows[0] as any;

    return {
      id: row.ID,
      userId: row.USER_ID,
      title: row.TITLE,
      authors: safeJsonParse(row.AUTHORS, []),
      uploadDate: row.UPLOAD_DATE,
      wordCount: row.WORD_COUNT,
      fileName: row.FILE_NAME,
      credibilityScore: row.CREDIBILITY_SCORE,
      claimCount: row.CLAIM_COUNT,
      tokensCost: row.TOKENS_COST,
      status: row.STATUS,
      summary: row.SUMMARY ?? "",
      claims: safeJsonParse(row.CLAIMS, []),
      contradictions: safeJsonParse(row.CONTRADICTIONS, []),
      rebuttal: row.REBUTTAL ?? "",
      rebuttalSnippet: row.REBUTTAL_SNIPPET ?? "",
      audioUrl: row.AUDIO_URL ?? "",
    };
  } catch (e: any) {
    console.error("[Snowflake] Get by ID failed:", e.message);
    return null;
  }
}

function safeJsonParse(str: string | null | undefined, fallback: any): any {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
