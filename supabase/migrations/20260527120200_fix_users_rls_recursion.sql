-- Fix infinite recursion in users_select_same_org RLS policy.
-- Policies must not query the same table directly; use a SECURITY DEFINER helper instead.

CREATE OR REPLACE FUNCTION public.get_auth_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_auth_user_org_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_user_org_id() TO authenticated;

DROP POLICY IF EXISTS "users_select_same_org" ON public.users;

CREATE POLICY "users_select_same_org"
  ON public.users FOR SELECT TO authenticated
  USING (
    org_id IS NOT NULL
    AND org_id = public.get_auth_user_org_id()
  );
