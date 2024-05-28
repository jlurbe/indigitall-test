create table if not exists test (
  id int,
  description text
);

insert into test values (1, 'test');

-- El id lo creamos autonumérico por sencillez pero como hay dos hemisferios, debería ser un id o uuid gestionado para asegurarse de que va a ser único entre los dos hemisferios y no hay repetidos.
create table if not exists users (
  id integer not null primary key autoincrement,
  username varchar(50) not null,
  email varchar(100) not null,
  password varchar(100) not null,
  longitude decimal(10,7),
  latitude decimal(10,7),
  browser_language varchar(5),
  ctime timestamp default current_timestamp,
  mtime timestamp default current_timestamp
);

-- trigger para actualizar el mtime. Para temas de optimización podría evitarse y hacerse en cada update o gestionarse de forma diferente
create trigger if not exists update_users_mtime
after update on users
for each row
begin
    update users
    set mtime = current_timestamp
    where id = old.id;
end;

-- usuarios de ejemplo
insert into users (username, email, password, longitude, latitude, browser_language) values 
('johndoe', 'johndoe@gmail.com', '$2a$10$DPlDlmKUMKHqtOj0zh6RlOjot7/QgWKFBhbQJoHtuSgheJ38X2dmG', 40.7128, -74.0060, 'es'),
('janedoe', 'janedoe@gmail.com', '$2a$10$9tDnBjy3lRVFGBu/gbQFzeC3ZbRM9UnfnQ1FyYFX0LyxxSwfCkNji', 51.5074, -0.1278, 'en'),
('alexsmith', 'alexsmith@gmail.com', '$2a$10$3i6Umo2b8itbzpCqIhVktuTlQJL96Vx92kjFzbrXEL4V9b2b2J7Na', 48.8584, 2.2945, 'fr'),
('emilybrown', 'emilybrown@gmail.com', '$2a$10$uAlncsCX.28e/AhJ9T0JVOM84IQzqGYPqBmHsmdavONmwqAysXTOG', 53.3498, -6.2603, 'en'),
('adamwilson', 'adamwilson@gmail.com', '$2a$10$xG8sXdVpQb0lELmj0BdMs.F/rmS/AgfZvWk2jTSPQlDP.CArHnlXS', 55.9533, -3.1883, 'jp'),
('sarahjones', 'sarahjones@gmail.com', '$2a$10$YuVL3jHZLYKq9SC7yl.E4OTWnl09QKFL9XtkFTg/cNJtsAFO1iU8O', 59.3293, 18.0686, 'en'),
('michaelgreen', 'michaelgreen@gmail.com', '$2a$10$ulJxdCMcsgSWOW84CrBI9eTmBCcN2YRwLztL0I9k.Amqcldm6zV2K', 52.5200, 13.4050, 'pt'),
('laurawilson', 'laurawilson@gmail.com', '$2a$10$Mo6IfchqBj18EenwrUJTR.l/8tVcnC7xI0sFEWkJ0QhdmImFCIgbK', 51.4545, -2.5879, 'en'),
('alexjohnson', 'alexjohnson@gmail.com', '$2a$10$FDbalSHXHg1qLVtN8JYJh.eGgSM9LXNqX1N2XKZw9b8dH5IhN5O0S', 51.5074, 0.1278, 'en'),
('danielthomas', 'danielthomas@gmail.com', '$2a$10$6pmMRZ0uhvH5d6G7qNWuYeFLqfwQG4SK9W9r78mW.2Zz0up3h.WHy', 52.3667, 4.8945, 'en');

-- tabla de amistades
create table if not exists friendships (
    user_id integer not null,
    friend_id integer not null,
    primary key(user_id, friend_id),
    foreign key(user_id) references users(id) on delete cascade,
    foreign key(friend_id) references users(id) on delete cascade
);

-- amistades de ejemplo
insert into friendships values 
(1, 2), (1, 3), (1, 4), (1, 5), (1, 6), -- User1 es amigo de User2, User3, User4, User5, User6
(2, 3), (2, 4), (2, 5), (2, 6), (2, 7), -- User2 es amigo de User3, User4, User5, User6, User7
(3, 4), (3, 5), (3, 6), (3, 7), (3, 8), -- User3 es amigo de User4, User5, User6, User7, User8
(4, 5), (4, 6), (4, 7), (4, 8), (4, 9), -- User4 es amigo de User5, User6, User7, User8, User9
(5, 6), (5, 7), (5, 8), (5, 9), (5, 10), -- User5 es amigo de User6, User7, User8, User9, User10
(6, 7), (6, 8), (6, 9), (6, 10),         -- User6 es amigo de User7, User8, User9, User10
(7, 8), (7, 9), (7, 10),                 -- User7 es amigo de User8, User9, User10
(8, 9), (8, 10),                         -- User8 es amigo de User9, User10
(9, 10); 