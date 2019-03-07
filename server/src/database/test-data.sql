-- Test data for development purposes

INSERT INTO users (id, time, name, secret) VALUES ('da776df3', '2018-11-10 09:32:11', 'jaba', 'sf8a7s');

INSERT INTO containers (id, subdomain, url, user_id, runner, blob) VALUES ('APP-1111', 'one', 'http://localhost:10001', 'da776df3', 'site', '{"auth": {"password": "$2a$10$Hr8a20CYZbBrSsnjAWQfu.l/v471fhXdwMbQc3Pgpqs.He.JVUwbu"}}');
INSERT INTO containers (id, subdomain, url, user_id, runner) VALUES ('APP-2222', 'two', 'http://localhost:10002', 'da776df3', 'site');
INSERT INTO containers (id, subdomain, url, user_id, runner) VALUES ('APD-1111', 'done', 'http://dockerhost:10001', 'da776df3', 'site');
INSERT INTO containers (id, subdomain, url, user_id, runner) VALUES ('APD-2222', 'dtwo', 'http://dockerhost:10002', 'da776df3', 'site');
INSERT INTO containers (id, subdomain, url, user_id, runner) VALUES ('APP-TEST', 'test', 'http://localhost:8080', 'da776df3', 'site');
INSERT INTO containers (id, subdomain, url, user_id, runner) VALUES ('APP-OTHR', 'other', 'http://localhost:8080', 'da776df3', 'site');

INSERT INTO threads (id, container_id) VALUES ('THR-1234', 'APP-TEST');

INSERT INTO comments (id, time, text, user_id, thread_id) VALUES ('1bd8052b', '2018-11-14 16:35:27', 'skrattia', 'da776df3', 'THR-1234');
INSERT INTO comments (id, time, text, user_id, thread_id) VALUES ('cb38e8f6', '2018-11-14 17:10:42', 'tröttistä', 'da776df3', 'THR-1234');
INSERT INTO comments (id, text, user_id, thread_id) VALUES ('13adr8sa', 'jaahaa', 'da776df3', 'THR-1234');


INSERT INTO questions (id, time, text, type, user_id, container_id, order_id) VALUES ('eb1de3fc', '2018-11-14 17:40:09', 'Mitä tänään syötäisiin?', 'text', 'da776df3', 'APP-TEST', 1);

INSERT INTO reactions (id, time, emoji, user_id, comment_id) VALUES ('5eaafea3', '2018-11-14 16:38:41', 'up', 'da776df3', 'cb38e8f6');
INSERT INTO reactions (id, time, emoji, user_id, comment_id) VALUES ('fb05d1a5', '2018-11-14 16:59:32', 'up', 'da776df3', '1bd8052b');
INSERT INTO reactions (id, time, emoji, user_id, comment_id) VALUES ('cba06aee', '2018-11-14 23:20:11', 'down', 'da776df3', '1bd8052b');
INSERT INTO reactions (id, time, emoji, user_id, comment_id) VALUES ('cba06dw', '2018-11-14 23:20:11', 'fire', 'da776df3', '1bd8052b');
