-- Org-gated CV context for Business Dashboard potential-candidate chat (SECURITY DEFINER)

CREATE OR REPLACE FUNCTION public.get_matched_candidate_cv_context(p_match_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_row record;
  v_candidate record;
  v_resume_content jsonb;
  v_listing_title text;
  v_listing_location text;
BEGIN
  IF p_match_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Match id is required');
  END IF;

  v_org_id := public.get_auth_user_org_id();
  IF v_org_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Organization not found');
  END IF;

  SELECT
    pcm.id,
    pcm.org_id,
    pcm.job_opportunity_id,
    pcm.candidate_user_id,
    pcm.confidence_score,
    pcm.rationale,
    jo.title AS job_title,
    jo.location AS job_location
  INTO v_row
  FROM public.potential_candidate_matches pcm
  LEFT JOIN public.job_opportunities jo ON jo.id = pcm.job_opportunity_id
  WHERE pcm.id = p_match_id
    AND pcm.org_id = v_org_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Match not found or access denied');
  END IF;

  SELECT
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.professional_title
  INTO v_candidate
  FROM public.users u
  WHERE u.id = v_row.candidate_user_id;

  SELECT lr.content
  INTO v_resume_content
  FROM public.live_resumes lr
  WHERE lr.user_id = v_row.candidate_user_id;

  IF v_resume_content IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Candidate CV is not available',
      'matchId', v_row.id,
      'candidateUserId', v_row.candidate_user_id
    );
  END IF;

  v_listing_title := COALESCE(v_row.job_title, 'Job listing');
  v_listing_location := v_row.job_location;

  RETURN jsonb_build_object(
    'success', true,
    'matchId', v_row.id,
    'orgId', v_row.org_id,
    'jobOpportunityId', v_row.job_opportunity_id,
    'candidateUserId', v_row.candidate_user_id,
    'candidateName', COALESCE(
      NULLIF(trim(COALESCE(v_candidate.first_name, '') || ' ' || COALESCE(v_candidate.last_name, '')), ''),
      v_candidate.email,
      'Candidate'
    ),
    'candidateTitle', v_candidate.professional_title,
    'jobListingTitle', v_listing_title,
    'jobListingLocation', v_listing_location,
    'confidenceScore', v_row.confidence_score,
    'rationale', v_row.rationale,
    'resumeContent', v_resume_content,
    'contact', jsonb_build_object(
      'first_name', v_candidate.first_name,
      'last_name', v_candidate.last_name,
      'email', v_candidate.email,
      'professional_title', v_candidate.professional_title
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_matched_candidate_cv_context(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_matched_candidate_cv_context(uuid) TO authenticated;
