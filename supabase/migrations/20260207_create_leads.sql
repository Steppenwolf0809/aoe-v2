-- Create leads table for calculator conversions
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text,
  source text not null, -- 'inmobiliario', 'vehicular', 'checklist'
  status text default 'new', -- 'new', 'contacted', 'converted'
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.leads enable row level security;

-- Policy: Service role can do everything (server actions use service role usually if configured, 
-- but here we use createClient which might be anon depending on config.
-- Usually server actions use authenticated client or service role if needed.
-- For public lead capture, allow INSERT to anon? 
-- Better: Server Action uses Service Role if we want to bypass RLS for public inserts without auth,
-- OR allow anon insert with validation.
-- Simplest for now: Allow anon insert.

create policy "Enable insert for everyone" on public.leads
  for insert with check (true);

-- Only admins/service_role can view
create policy "Enable select for service role only" on public.leads
  for select using ( auth.role() = 'service_role' );

-- Create index on email for quick lookup
create index if not exists leads_email_idx on public.leads (email);
