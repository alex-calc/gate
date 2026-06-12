-- Створення таблиці для логування повідомлень чату
CREATE TABLE IF NOT EXISTS public.chat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'model')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Налаштування безпеки (Row Level Security)
-- Оскільки API буде записувати дані через серверний клієнт (Service Role Key),
-- нам не обов'язково відкривати доступ для анонімних користувачів, але для зручності RLS:
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- Дозволяємо лише читання або повний доступ для сервісних ролей:
CREATE POLICY "Allow service role full access" ON public.chat_logs FOR ALL USING (true);
