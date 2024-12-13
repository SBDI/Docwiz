-- Insert sample template questions
INSERT INTO public.template_questions 
(template_id, type, question, options, correct_answer, order_index) 
VALUES
-- For JavaScript Basics template
((SELECT id FROM public.templates WHERE title = 'JavaScript Basics'), 
'multiple-choice',
'What is a variable?',
'["A container for storing data values", "A loop statement", "A function name", "A programming language"]'::jsonb,
'A container for storing data values',
1),

((SELECT id FROM public.templates WHERE title = 'JavaScript Basics'),
'true-false',
'JavaScript is a statically typed language',
null,
'false',
2),

-- For Advanced React Patterns template
((SELECT id FROM public.templates WHERE title = 'Advanced React Patterns'),
'multiple-choice',
'What is a React Hook?',
'["A function that lets you use state in functional components", "A class component", "A CSS framework", "A JavaScript library"]'::jsonb,
'A function that lets you use state in functional components',
1),

-- For SQL Fundamentals template
((SELECT id FROM public.templates WHERE title = 'SQL Fundamentals'),
'multiple-choice',
'What does SQL stand for?',
'["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"]'::jsonb,
'Structured Query Language',
1); 