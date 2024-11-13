CREATE TABLE emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT,
    body TEXT,
    sent_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status INTEGER DEFAULT 0
);
