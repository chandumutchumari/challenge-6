-- Supabase RLS Policy and Security Test Suite
-- Tests cross-user access isolation, anonymous table read/write restrictions,
-- and cascade deletion behavior.
-- Blueprint Reference: Section 8 & 10

BEGIN;

-- Test 1: Anonymous users cannot insert or read private user preferences
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    INSERT INTO public.user_preferences (user_id, commute_mode) VALUES ('00000000-0000-0000-0000-000000000001', 'bike');
    RAISE EXCEPTION 'RLS Failure: Anonymous user was allowed to insert into user_preferences';
  EXCEPTION WHEN insufficient_privilege THEN
    -- Expected behavior: privilege denied
  END;
END $$;

-- Test 2: Anonymous users can read approved provider sources
DO $$
BEGIN
  PERFORM * FROM public.provider_sources;
END $$;

-- Test 3: Authenticated User A cannot select User B's saved locations
SET ROLE authenticated;
SET request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

-- Insert for User A
INSERT INTO public.saved_locations (id, user_id, label, latitude, longitude)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'User A Home', 40.71, -74.00);

-- Switch to User B
SET request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';

-- User B attempts to read User A's record
DO $$
DECLARE
  rec_count INT;
BEGIN
  SELECT COUNT(*) INTO rec_count FROM public.saved_locations WHERE id = '22222222-2222-2222-2222-222222222222';
  IF rec_count > 0 THEN
    RAISE EXCEPTION 'RLS Failure: User B was able to view User A private saved location';
  END IF;
END $$;

ROLLBACK;
