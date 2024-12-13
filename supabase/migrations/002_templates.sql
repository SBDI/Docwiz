-- Templates table
CREATE TABLE public.templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Template questions table
CREATE TABLE public.template_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_questions ENABLE ROW LEVEL SECURITY;

-- Templates policies
CREATE POLICY "Templates are viewable by everyone" 
    ON public.templates FOR SELECT 
    USING (true);

-- Template questions policies
CREATE POLICY "Template questions are viewable by everyone" 
    ON public.template_questions FOR SELECT 
    USING (true);

-- Add updated_at triggers
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.template_questions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample templates
INSERT INTO public.templates (title, description, category, difficulty) VALUES
    ('JavaScript Basics', 'Basic JavaScript concepts and syntax', 'Programming', 'Beginner'),
    ('Advanced React Patterns', 'Complex React patterns and best practices', 'Programming', 'Advanced'),
    ('SQL Fundamentals', 'Essential SQL concepts and queries', 'Database', 'Intermediate'); 