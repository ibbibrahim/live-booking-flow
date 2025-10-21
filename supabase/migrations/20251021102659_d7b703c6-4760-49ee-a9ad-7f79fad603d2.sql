-- Create enum types
CREATE TYPE public.booking_type AS ENUM ('Incoming Feed', 'Guest for iNEWS Rundown');
CREATE TYPE public.workflow_state AS ENUM (
  'Draft',
  'Submitted',
  'With NOC',
  'Clarification Requested',
  'Resources Added',
  'With Ingest',
  'Completed',
  'Not Done'
);
CREATE TYPE public.app_role AS ENUM ('Booking', 'NOC', 'Ingest', 'Admin');
CREATE TYPE public.priority AS ENUM ('Normal', 'High', 'Urgent');
CREATE TYPE public.language AS ENUM ('English', 'Arabic');
CREATE TYPE public.source_type AS ENUM ('vMix', 'SRT', 'Satellite');
CREATE TYPE public.return_path AS ENUM ('Enabled', 'Disabled');
CREATE TYPE public.key_fill AS ENUM ('None', 'Key', 'Fill');
CREATE TYPE public.yes_no AS ENUM ('Yes', 'No');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_type booking_type NOT NULL,
  title TEXT NOT NULL,
  program_segment TEXT NOT NULL,
  air_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  language language NOT NULL,
  priority priority NOT NULL DEFAULT 'Normal',
  noc_required yes_no NOT NULL,
  resources_needed TEXT,
  newsroom_ticket TEXT,
  compliance_tags TEXT,
  notes TEXT,
  state workflow_state NOT NULL DEFAULT 'Draft',
  
  -- Type-specific fields for Incoming Feed
  source_type source_type,
  vmix_input_number TEXT,
  return_path return_path,
  key_fill key_fill,
  
  -- Type-specific fields for Guest Rundown
  guest_name TEXT,
  guest_contact TEXT,
  inews_rundown_id TEXT,
  story_slug TEXT,
  rundown_position TEXT,
  
  -- NOC fields
  noc_acknowledged BOOLEAN DEFAULT false,
  noc_assigned_resources TEXT,
  noc_clarification TEXT,
  noc_forward_to_ingest yes_no,
  
  -- Ingest fields
  ingest_status TEXT,
  ingest_not_done_reason TEXT,
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workflow_transitions table
CREATE TABLE public.workflow_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  from_state workflow_state,
  to_state workflow_state NOT NULL,
  actor_id UUID REFERENCES auth.users(id) NOT NULL,
  role app_role NOT NULL,
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create resource_allocations table
CREATE TABLE public.resource_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  resource_type TEXT NOT NULL,
  details TEXT NOT NULL,
  allocated_by UUID REFERENCES auth.users(id) NOT NULL,
  allocated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_allocations ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'Admin'));

-- RLS Policies for requests
CREATE POLICY "Users can view requests based on role"
  ON public.requests FOR SELECT
  USING (
    auth.uid() = created_by OR
    public.has_role(auth.uid(), 'Admin') OR
    (public.has_role(auth.uid(), 'NOC') AND state IN ('Submitted', 'With NOC', 'Clarification Requested', 'Resources Added')) OR
    (public.has_role(auth.uid(), 'Ingest') AND state IN ('With Ingest', 'Completed', 'Not Done'))
  );

CREATE POLICY "Booking users can create requests"
  ON public.requests FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    (public.has_role(auth.uid(), 'Booking') OR public.has_role(auth.uid(), 'Admin'))
  );

CREATE POLICY "Users can update requests based on role"
  ON public.requests FOR UPDATE
  USING (
    (auth.uid() = created_by AND state = 'Draft') OR
    public.has_role(auth.uid(), 'Admin') OR
    (public.has_role(auth.uid(), 'NOC') AND state IN ('Submitted', 'With NOC', 'Clarification Requested')) OR
    (public.has_role(auth.uid(), 'Ingest') AND state = 'With Ingest')
  );

-- RLS Policies for workflow_transitions
CREATE POLICY "Anyone can view transitions for their accessible requests"
  ON public.workflow_transitions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.requests
      WHERE requests.id = workflow_transitions.request_id
    )
  );

CREATE POLICY "Authenticated users can create transitions"
  ON public.workflow_transitions FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

-- RLS Policies for resource_allocations
CREATE POLICY "Anyone can view allocations for their accessible requests"
  ON public.resource_allocations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.requests
      WHERE requests.id = resource_allocations.request_id
    )
  );

CREATE POLICY "NOC and Admins can create allocations"
  ON public.resource_allocations FOR INSERT
  WITH CHECK (
    auth.uid() = allocated_by AND
    (public.has_role(auth.uid(), 'NOC') OR public.has_role(auth.uid(), 'Admin'))
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for requests
CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();