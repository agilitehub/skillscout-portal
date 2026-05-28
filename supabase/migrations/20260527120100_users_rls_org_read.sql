-- Allow authenticated users to read other users in the same organization.
-- Uses a SECURITY DEFINER helper to avoid infinite RLS recursion on users.

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

CREATE POLICY "users_select_same_org"
  ON public.users FOR SELECT TO authenticated
  USING (
    org_id IS NOT NULL
    AND org_id = public.get_auth_user_org_id()
  );
