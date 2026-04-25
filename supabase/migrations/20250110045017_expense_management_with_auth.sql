-- Location: supabase/migrations/20250110045017_expense_management_with_auth.sql
-- Schema Analysis: Fresh project with no existing schema
-- Integration Type: Complete expense management system with authentication
-- Dependencies: None (new schema)

-- 1. Create Types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE public.expense_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'paid');
CREATE TYPE public.expense_category AS ENUM ('travel', 'meals', 'office_supplies', 'software', 'equipment', 'other');

-- 2. Core User Management Table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'employee'::public.user_role,
    department TEXT,
    manager_id UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Expenses Table
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    category public.expense_category NOT NULL,
    expense_date DATE NOT NULL,
    status public.expense_status DEFAULT 'draft'::public.expense_status,
    receipt_url TEXT,
    merchant TEXT,
    approved_by UUID REFERENCES public.user_profiles(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Receipt Storage Table
CREATE TABLE public.expense_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_status ON public.expenses(status);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expense_receipts_expense_id ON public.expense_receipts(expense_id);

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_receipts ENABLE ROW LEVEL SECURITY;

-- 7. Helper Functions (must be before RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin', 'manager')
)
$$;

CREATE OR REPLACE FUNCTION public.is_user_manager(employee_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = employee_id 
    AND up.manager_id = auth.uid()
)
$$;

-- 8. RLS Policies
-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for expenses with manager access
CREATE POLICY "users_manage_own_expenses"
ON public.expenses
FOR ALL
TO authenticated
USING (
    user_id = auth.uid() 
    OR public.is_user_manager(user_id)
    OR public.is_admin_or_manager()
)
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Expense receipts follow expense access
CREATE POLICY "users_manage_expense_receipts"
ON public.expense_receipts
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.expenses e 
        WHERE e.id = expense_id 
        AND (e.user_id = auth.uid() 
             OR public.is_user_manager(e.user_id)
             OR public.is_admin_or_manager())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.expenses e 
        WHERE e.id = expense_id 
        AND e.user_id = auth.uid()
    )
);

-- 9. Automatic Profile Creation Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'employee'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- 10. Trigger for New User Creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Complete Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    employee_uuid UUID := gen_random_uuid();
    expense1_uuid UUID := gen_random_uuid();
    expense2_uuid UUID := gen_random_uuid();
    expense3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@company.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@company.com', crypt('manager123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Manager", "role": "manager"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (employee_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'employee@company.com', crypt('employee123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Mike Employee", "role": "employee"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with additional info
    UPDATE public.user_profiles SET 
        department = 'IT',
        role = 'admin'::public.user_role
    WHERE id = admin_uuid;

    UPDATE public.user_profiles SET 
        department = 'Finance',
        role = 'manager'::public.user_role
    WHERE id = manager_uuid;

    UPDATE public.user_profiles SET 
        department = 'Engineering',
        manager_id = manager_uuid,
        role = 'employee'::public.user_role
    WHERE id = employee_uuid;

    -- Create sample expenses
    INSERT INTO public.expenses (id, user_id, title, description, amount, category, expense_date, status, merchant) VALUES
        (expense1_uuid, employee_uuid, 'Team Lunch Meeting', 'Lunch with client to discuss project requirements', 85.50, 'meals', CURRENT_DATE - 2, 'submitted', 'Restaurant ABC'),
        (expense2_uuid, employee_uuid, 'Software License', 'Annual subscription for development tools', 299.99, 'software', CURRENT_DATE - 5, 'approved', 'Software Company XYZ'),
        (expense3_uuid, manager_uuid, 'Conference Travel', 'Flight tickets for industry conference', 450.00, 'travel', CURRENT_DATE - 1, 'submitted', 'Airline ABC');

    -- Approve one expense
    UPDATE public.expenses SET 
        status = 'approved'::public.expense_status,
        approved_by = manager_uuid,
        approved_at = now()
    WHERE id = expense2_uuid;

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;