CREATE TABLE public.typologies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.descriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  typology_id UUID NOT NULL REFERENCES public.typologies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'pass',
  text TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_setup (
  user_id UUID NOT NULL PRIMARY KEY,
  seeded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_typologies_user ON public.typologies(user_id, position);
CREATE INDEX idx_descriptions_typology ON public.descriptions(typology_id, position);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.typologies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.descriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_setup TO authenticated;
GRANT ALL ON public.typologies TO service_role;
GRANT ALL ON public.descriptions TO service_role;
GRANT ALL ON public.user_setup TO service_role;

ALTER TABLE public.typologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_setup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own typologies" ON public.typologies FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Own descriptions" ON public.descriptions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Own setup" ON public.user_setup FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.descriptions ADD CONSTRAINT descriptions_kind_check CHECK (kind IN ('pass','fail'));