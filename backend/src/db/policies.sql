alter table profiles enable row level security;
alter table campsites enable row level security;
alter table favourites enable row level security;
alter table alerts enable row level security;

create policy "profiles_select" on profiles
    for select using (auth.uid() = id);
create policy "profiles_insert" on profiles
    for insert with check (auth.uid() = id);

create policy "campsites_select" on campsites
    for select using (auth.uid() = user_id);
create policy "campsites_modify" on campsites
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "favourites_select" on favourites
    for select using (auth.uid() = user_id);
create policy "favourites_modify" on favourites
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "alerts_select" on alerts
    for select using (auth.uid() = user_id);
create policy "alerts_modify" on alerts
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
