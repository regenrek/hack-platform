create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

create table player_highscores (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players (id) on delete cascade,
  score int not null,
  created_at timestamp with time zone default now()
);

insert into players (name) values ('TestPlayer');
-- Suppose this returns a player id: 123e4567-e89b-12d3-a456-426614174000

insert into player_highscores (player_id, score)
values ('123e4567-e89b-12d3-a456-426614174000', 1000);
