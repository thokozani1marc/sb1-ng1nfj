-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subscription_id text not null,
  customer_id text not null,
  plan_id text not null,
  variant_id text not null,
  status text not null check (status in ('active', 'canceled', 'past_due', 'expired')),
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at timestamp with time zone,
  card_brand text,
  card_last_four text,
  trial_ends_at timestamp with time zone,
  billing_anchor integer,
  update_payment_method_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on subscriptions
alter table public.subscriptions enable row level security;

-- Create policies for subscriptions
create policy "Users can view their own subscriptions."
  on subscriptions for select
  using ( auth.uid() = user_id );

create policy "Users can update their own subscriptions."
  on subscriptions for update
  using ( auth.uid() = user_id );

-- Create webhook logs table for debugging
create table if not exists public.webhook_logs (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null,
  payload jsonb not null,
  processed_at timestamp with time zone default now(),
  error text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on webhook_logs
alter table public.webhook_logs enable row level security;

-- Create policy for webhook_logs
create policy "Service role can manage webhook logs."
  on webhook_logs for all
  using ( auth.role() = 'service_role' );