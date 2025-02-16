
create table "public"."gifts" (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  sender_id uuid references auth.users(id),
  recipient_phone text not null,
  amount text not null,
  theme jsonb not null,
  message_video_url text,
  memories jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  primary key (id)
);

-- Enable RLS
alter table "public"."gifts" enable row level security;

-- Policies
create policy "Users can view their own gifts" on "public"."gifts"
  for select using (auth.uid() = sender_id);

create policy "Users can create their own gifts" on "public"."gifts"
  for insert with check (auth.uid() = sender_id);

create policy "Users can update their own gifts" on "public"."gifts"
  for update using (auth.uid() = sender_id);

create policy "Users can delete their own gifts" on "public"."gifts"
  for delete using (auth.uid() = sender_id);

-- Add updated_at trigger
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger gifts_updated_at
  before update on gifts
  for each row
  execute procedure public.handle_updated_at();
