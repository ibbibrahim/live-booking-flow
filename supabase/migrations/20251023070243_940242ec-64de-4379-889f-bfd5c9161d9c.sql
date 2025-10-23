-- Remove foreign key constraint on created_by to allow dummy data
ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_created_by_fkey;