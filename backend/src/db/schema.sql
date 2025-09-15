create table profiles (
    id uuid primary key references auth.users on delete cascade,
    username text
);

create table campsites (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    name text not null,
    lat double precision not null,
    lon double precision not null,
    description text
);

create table favourites (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    campsite_id uuid references campsites on delete cascade
);

create table alerts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    campsite_id uuid references campsites on delete cascade,
    alert_type text
);
