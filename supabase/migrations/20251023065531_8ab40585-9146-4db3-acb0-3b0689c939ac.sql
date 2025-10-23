-- Disable Row Level Security on all tables for testing
ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_allocations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_transitions DISABLE ROW LEVEL SECURITY;