-- Quiz attempts policies
CREATE POLICY "Users can view their own attempts" 
    ON public.quiz_attempts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attempts" 
    ON public.quiz_attempts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts" 
    ON public.quiz_attempts FOR UPDATE 
    USING (auth.uid() = user_id); 