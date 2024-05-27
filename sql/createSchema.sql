create table if not exists test (
  id int,
  description text
);

insert into test values (1, 'test');

create table if not exists users (
  id int primary key,
  username varchar(50) not null,
  email varchar(100) not null,
  password varchar(50) not null,
  longitude decimal(10,7),
  latitude decimal(10,7),
  browser_language varchar(2),
  ctime timestamp default current_timestamp,
  mtime timestamp default current_timestamp
);

-- para temas de optimización podrí evitarse y hacerse en cada update
create trigger update_users_mtime
after update on users
for each row
begin
    update users
    set mtime = current_timestamp
    where id = old.id;
end;
