ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "auth_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_data" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verification_tokens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
-- Auth.js and application data are accessed through the server connection only.
REVOKE ALL PRIVILEGES ON TABLE public.users, public.accounts, public.auth_sessions,
  public.verification_tokens, public.user_data FROM PUBLIC;
--> statement-breakpoint
DO $privacy$
DECLARE api_role text;
BEGIN
  FOR api_role IN
    SELECT rolname FROM pg_catalog.pg_roles
    WHERE rolname IN ('anon', 'authenticated', 'service_role')
  LOOP
    EXECUTE format(
      'REVOKE ALL PRIVILEGES ON TABLE public.users, public.accounts, public.auth_sessions, public.verification_tokens, public.user_data FROM %I',
      api_role
    );
  END LOOP;
END
$privacy$;
