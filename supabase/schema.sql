-- Supabase Schema for Elas Fazem Marketplace

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('CLIENT', 'PROVIDER')) not null,
  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  category text,
  bio text,
  hourly_rate numeric(10,2),
  instagram text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.quotes (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) not null,
  provider_id uuid references public.profiles(id) not null,
  service_description text not null,
  preferred_date date,
  status text check (status in ('PENDING', 'ACCEPTED', 'DECLINED')) default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.messages (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references public.quotes(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  sender_name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime for messages
alter publication supabase_realtime add table public.messages;
