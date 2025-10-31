-- Debug queries to check draft functionality
-- Run these in your Supabase SQL editor

-- 1. Check if is_draft column exists and its structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name = 'is_draft';

-- 2. Check all posts with their draft status
SELECT id, title, is_draft, created_at 
FROM posts 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Count drafts vs published posts
SELECT 
  is_draft,
  COUNT(*) as count
FROM posts 
GROUP BY is_draft;

-- 4. Check if there are any NULL values in is_draft column
SELECT COUNT(*) as null_count 
FROM posts 
WHERE is_draft IS NULL;

-- 5. Manually create a test draft to verify the column works
INSERT INTO posts (title, body, user_id, is_draft) 
VALUES ('Test Draft', 'This is a test draft', 1, true);

-- 6. Check the test draft was created correctly
SELECT * FROM posts WHERE title = 'Test Draft';