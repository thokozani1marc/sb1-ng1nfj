-- Drop existing tables and policies if they exist
drop policy if exists "Users can view their own subscriptions" on subscriptions;
drop policy if exists "Users can update their own subscriptions" on subscriptions;
drop policy if exists "Service role can insert subscriptions" on subscriptions;
drop policy if exists "Service role can update any subscription" on subscriptions;
drop policy if exists "Service role can manage webhook logs" on webhook_logs;
drop policy if exists "Service role can insert webhook logs" on webhook_logs;
drop policy if exists "Service role can view webhook logs" on webhook_logs;
drop policy if exists "Service role can update webhook logs" on webhook_logs;
drop policy if exists "Service role can delete webhook logs" on webhook_logs;
drop trigger if exists subscription_updated_trigger on subscriptions;
drop function if exists handle_subscription_updated();

-- Create subscriptions table if it doesn't exist
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subscription_id text not null unique,
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

-- Create webhook logs table if it doesn't exist
create table if not exists public.webhook_logs (
  id uuid default uuid_generate_v4() primary key,
  event_name text not null,
  payload jsonb not null,
  processed_at timestamp with time zone,
  error text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.subscriptions enable row level security;
alter table public.webhook_logs enable row level security;

-- Create subscription policies
create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on subscriptions for update
  using (auth.uid() = user_id);

create policy "Service role can insert subscriptions"
  on subscriptions for insert
  with check (auth.role() = 'service_role');

create policy "Service role can update any subscription"
  on subscriptions for update
  using (auth.role() = 'service_role');

-- Create webhook log policies
create policy "Service role can insert webhook logs"
  on webhook_logs for insert
  with check (auth.role() = 'service_role');

create policy "Service role can view webhook logs"
  on webhook_logs for select
  using (auth.role() = 'service_role');

create policy "Service role can update webhook logs"
  on webhook_logs for update
  using (auth.role() = 'service_role');

create policy "Service role can delete webhook logs"
  on webhook_logs for delete
  using (auth.role() = 'service_role');

-- Create subscription update function
create or replace function handle_subscription_updated()
returns trigger as $$
begin
  -- Update the subscription record
  update public.subscriptions
  set
    status = NEW.status,
    current_period_start = NEW.current_period_start,
    current_period_end = NEW.current_period_end,
    cancel_at = NEW.cancel_at,
    card_brand = NEW.card_brand,
    card_last_four = NEW.card_last_four,
    trial_ends_at = NEW.trial_ends_at,
    billing_anchor = NEW.billing_anchor,
    update_payment_method_url = NEW.update_payment_method_url,
    updated_at = now()
  where subscription_id = NEW.subscription_id;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Create subscription update trigger
create trigger subscription_updated_trigger
  after update on subscriptions
  for each row
  execute function handle_subscription_updated();