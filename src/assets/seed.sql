CREATE TABLE IF NOT EXISTS developer(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,skills TEXT,img TEXT);
INSERT or IGNORE INTO developer VALUES (1, 'Hector', 'Frontend, Backend', '');
INSERT or IGNORE INTO developer VALUES (2, 'Gerardo', 'Frontend, Marketing, SEO', '');
INSERT or IGNORE INTO developer VALUES (3, 'Ayrton', 'Backend', '');

CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, creatorId INTEGER);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (1, 'Software Startup Manual', 1);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (2, 'Meraki Developer', 2);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (3, 'Ionic Framework', 1);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (4, 'FastBike', 1);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (5, 'Angular app', 2);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (6, 'NodeJS app', 3);
