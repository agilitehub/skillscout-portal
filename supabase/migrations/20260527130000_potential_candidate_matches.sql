-- Potential candidate matches (Business Dashboard) + vector search prerequisites

-- 0. pgvector + search_index (required by matcher worker; may already exist on hosted project)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.search_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table text NOT NULL,
  source_id uuid NOT NULL,
  title text,
  content text,
  metadata jsonb,
  embedding vector(1536)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_search_index_source_unique
  ON public.search_index (source_table, source_id);

CREATE OR REPLACE FUNCTION public.match_search_index(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  source_table text,
  source_id uuid,
  title text,
  content text,
  similarity float,
  metadata jsonb
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    si.source_table,
    si.source_id,
    si.title,
    si.content,
    1 - (si.embedding <=> query_embedding) AS similarity,
    si.metadata
  FROM public.search_index si
  WHERE si.embedding IS NOT NULL
    AND 1 - (si.embedding <=> query_embedding) > match_threshold
  ORDER BY si.embedding <=> query_embedding
  LIMIT match_count;
$$;

REVOKE ALL ON FUNCTION public.match_search_index(vector, float, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.match_search_index(vector, float, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.match_search_index(vector, float, int) TO service_role;

ALTER TABLE public.search_index ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "search_index_select_authenticated" ON public.search_index;
CREATE POLICY "search_index_select_authenticated"
  ON public.search_index FOR SELECT TO authenticated
  USING (true);

-- 1. Match results table
CREATE TABLE IF NOT EXISTS public.potential_candidate_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  job_opportunity_id uuid NOT NULL REFERENCES public.job_opportunities(id) ON DELETE CASCADE,
  job_description_id uuid REFERENCES public.job_descriptions(id) ON DELETE SET NULL,
  candidate_user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vector_similarity double precision NOT NULL DEFAULT 0,
  confidence_score integer NOT NULL DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  rationale text,
  run_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT potential_candidate_matches_unique
    UNIQUE (org_id, job_opportunity_id, candidate_user_id)
);

CREATE INDEX IF NOT EXISTS idx_potential_candidate_matches_org_id
  ON public.potential_candidate_matches(org_id);

CREATE INDEX IF NOT EXISTS idx_potential_candidate_matches_job_opportunity_id
  ON public.potential_candidate_matches(job_opportunity_id);

CREATE INDEX IF NOT EXISTS idx_potential_candidate_matches_updated_at
  ON public.potential_candidate_matches(updated_at DESC);

-- 2. RLS — org members read only their org's matches; no client writes
ALTER TABLE public.potential_candidate_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "potential_candidate_matches_select_same_org" ON public.potential_candidate_matches;
CREATE POLICY "potential_candidate_matches_select_same_org"
  ON public.potential_candidate_matches FOR SELECT TO authenticated
  USING (
    org_id IS NOT NULL
    AND org_id = public.get_auth_user_org_id()
  );

-- 3. Vector search over live_resumes rows in search_index only
CREATE OR REPLACE FUNCTION public.match_live_resumes_for_embedding(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  source_id uuid,
  title text,
  content text,
  similarity float,
  metadata jsonb
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    si.source_id,
    si.title,
    si.content,
    1 - (si.embedding <=> query_embedding) AS similarity,
    si.metadata
  FROM public.search_index si
  WHERE si.source_table = 'live_resumes'
    AND si.embedding IS NOT NULL
    AND 1 - (si.embedding <=> query_embedding) > match_threshold
  ORDER BY si.embedding <=> query_embedding
  LIMIT match_count;
$$;

REVOKE ALL ON FUNCTION public.match_live_resumes_for_embedding(vector, float, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.match_live_resumes_for_embedding(vector, float, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.match_live_resumes_for_embedding(vector, float, int) TO service_role;
