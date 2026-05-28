-- Live resume schema: extend users, add data sources, resumes, and canonical live_resumes

-- 1. Extend users with contact/profile fields
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS middle_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS professional_title text,
  ADD COLUMN IF NOT EXISTS summary text;

-- 2. user_data_sources — registry of resume data origins
CREATE TABLE IF NOT EXISTS public.user_data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (source_type IN ('resume_upload', 'chat', 'manual')),
  label text,
  external_ref text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_primary boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('processing', 'active', 'failed', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  modified_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_data_sources_user_id ON public.user_data_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_sources_user_primary ON public.user_data_sources(user_id, is_primary) WHERE is_primary = true;

-- 3. resumes — parsed CV uploads
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  data_source_id uuid REFERENCES public.user_data_sources(id) ON DELETE SET NULL,
  storage_path text,
  original_filename text,
  raw_text text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  parse_status text NOT NULL DEFAULT 'pending' CHECK (parse_status IN ('pending', 'processing', 'complete', 'failed')),
  parse_error text,
  parsed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  modified_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_data_source_id ON public.resumes(data_source_id);

-- 4. live_resumes — canonical merged view (one row per user)
CREATE TABLE IF NOT EXISTS public.live_resumes (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  completeness_score integer NOT NULL DEFAULT 0 CHECK (completeness_score >= 0 AND completeness_score <= 100),
  primary_source_id uuid REFERENCES public.user_data_sources(id) ON DELETE SET NULL,
  last_merged_at timestamptz,
  last_chat_update_at timestamptz,
  modified_at timestamptz NOT NULL DEFAULT now()
);

-- 5. RLS policies
ALTER TABLE public.user_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_resumes ENABLE ROW LEVEL SECURITY;

-- user_data_sources policies
CREATE POLICY "user_data_sources_select_own"
  ON public.user_data_sources FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_data_sources_insert_own"
  ON public.user_data_sources FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_data_sources_update_own"
  ON public.user_data_sources FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_data_sources_delete_own"
  ON public.user_data_sources FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- resumes policies
CREATE POLICY "resumes_select_own"
  ON public.resumes FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "resumes_insert_own"
  ON public.resumes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "resumes_update_own"
  ON public.resumes FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "resumes_delete_own"
  ON public.resumes FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- live_resumes policies
CREATE POLICY "live_resumes_select_own"
  ON public.live_resumes FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "live_resumes_insert_own"
  ON public.live_resumes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "live_resumes_update_own"
  ON public.live_resumes FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "live_resumes_delete_own"
  ON public.live_resumes FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- users RLS (allow users to read/update own row)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own"
  ON public.users FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow insert for own user record (ensureUserRecord on login)
CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
