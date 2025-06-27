-- Assessments Table for Supabase PostgreSQL
-- This table stores skill assessments and candidate testing data

CREATE TABLE assessments (
  -- Primary Key and Identifiers
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Technical', 'Behavioral', 'Portfolio', 'Cognitive')),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  
  -- Assessment Configuration
  duration INTEGER NOT NULL, -- Duration in minutes
  questions INTEGER NOT NULL, -- Number of questions
  passing_score INTEGER NOT NULL CHECK (passing_score >= 0 AND passing_score <= 100),
  
  -- Content
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL, -- Array of skills being assessed
  
  -- Status and Visibility
  status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Inactive', 'Archived')),
  
  -- Statistics (will be updated as assessments are taken)
  completions INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Assessment Content (detailed structure for future expansion)
  assessment_content JSONB, -- Flexible structure for questions, answers, scoring
  
  -- Settings and Configuration
  time_limit_enabled BOOLEAN DEFAULT true,
  randomize_questions BOOLEAN DEFAULT false,
  show_results_immediately BOOLEAN DEFAULT true,
  allow_retakes BOOLEAN DEFAULT false,
  max_retakes INTEGER DEFAULT 0,
  
  -- Access Control
  is_public BOOLEAN DEFAULT false,
  requires_invitation BOOLEAN DEFAULT true,
  
  -- Related Job Opportunities
  job_opportunity_ids UUID[], -- Array of related job opportunity IDs
  
  -- Search and SEO
  search_keywords TEXT, -- Generated keywords for search optimization
  tags TEXT[] DEFAULT '{}', -- Array of tags for categorization
  
  -- Audit Fields
  created_by UUID, -- User who created this assessment
  modified_by UUID, -- User who last modified this assessment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for better performance
CREATE INDEX idx_assessments_title ON assessments(title);
CREATE INDEX idx_assessments_category ON assessments(category);
CREATE INDEX idx_assessments_type ON assessments(type);
CREATE INDEX idx_assessments_difficulty ON assessments(difficulty);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_created_by ON assessments(created_by);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);
CREATE INDEX idx_assessments_updated_at ON assessments(updated_at);
CREATE INDEX idx_assessments_duration ON assessments(duration);
CREATE INDEX idx_assessments_passing_score ON assessments(passing_score);

-- GIN index for array fields to enable efficient array queries
CREATE INDEX idx_assessments_skills ON assessments USING GIN(skills);
CREATE INDEX idx_assessments_tags ON assessments USING GIN(tags);
CREATE INDEX idx_assessments_job_opportunity_ids ON assessments USING GIN(job_opportunity_ids);

-- GIN index for JSONB content
CREATE INDEX idx_assessments_content ON assessments USING GIN(assessment_content);

-- Full-text search index
CREATE INDEX idx_assessments_search ON assessments USING GIN(
  to_tsvector('english', title || ' ' || category || ' ' || description || ' ' || COALESCE(search_keywords, ''))
);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on row updates
CREATE TRIGGER tr_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_assessments_updated_at();

-- Function to update statistics when assessment results are recorded
CREATE OR REPLACE FUNCTION update_assessment_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be expanded when assessment results table is created
  -- For now, it's a placeholder for future statistics calculations
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) for multi-tenant security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Sample RLS policies (customize based on your authentication system)
-- Policy for users to see only their own assessments
CREATE POLICY "Users can view their own assessments" ON assessments
  FOR SELECT USING (created_by = auth.uid());

-- Policy for users to insert their own assessments
CREATE POLICY "Users can insert their own assessments" ON assessments
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Policy for users to update their own assessments
CREATE POLICY "Users can update their own assessments" ON assessments
  FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Policy for users to delete their own assessments
CREATE POLICY "Users can delete their own assessments" ON assessments
  FOR DELETE USING (created_by = auth.uid());

-- Sample data to test the table
INSERT INTO assessments (
  title, category, type, difficulty, duration, questions, passing_score,
  description, skills, status, search_keywords, tags
) VALUES 
(
  'React Developer Assessment',
  'Frontend Development',
  'Technical',
  'Intermediate',
  60,
  25,
  70,
  'Comprehensive assessment covering React fundamentals, hooks, state management, and best practices.',
  ARRAY['React', 'JavaScript', 'JSX', 'Hooks', 'State Management'],
  'Active',
  'react developer frontend javascript jsx hooks state management assessment',
  ARRAY['React', 'Frontend', 'JavaScript', 'Web Development']
),
(
  'Product Management Skills',
  'Product Management',
  'Behavioral',
  'Advanced',
  45,
  20,
  75,
  'Assessment focusing on product strategy, roadmap planning, stakeholder management, and analytical thinking.',
  ARRAY['Product Strategy', 'Analytics', 'Leadership', 'Communication'],
  'Active',
  'product management strategy analytics leadership communication behavioral',
  ARRAY['Product Management', 'Strategy', 'Leadership']
),
(
  'Data Science Fundamentals',
  'Data Science',
  'Technical',
  'Advanced',
  90,
  30,
  80,
  'In-depth assessment covering statistics, machine learning, Python, and data analysis techniques.',
  ARRAY['Python', 'Statistics', 'Machine Learning', 'Data Analysis'],
  'Draft',
  'data science python statistics machine learning analysis technical',
  ARRAY['Data Science', 'Python', 'Machine Learning', 'Analytics']
),
(
  'UX Design Principles',
  'Design',
  'Portfolio',
  'Intermediate',
  120,
  15,
  75,
  'Portfolio-based assessment evaluating design thinking, user research, prototyping, and visual design skills.',
  ARRAY['User Research', 'Prototyping', 'Visual Design', 'Figma'],
  'Active',
  'ux design user research prototyping figma visual design portfolio',
  ARRAY['UX Design', 'Design', 'User Research', 'Prototyping']
);

-- Comments for documentation
COMMENT ON TABLE assessments IS 'Stores skill assessments and candidate testing configurations';
COMMENT ON COLUMN assessments.skills IS 'Array of skills being assessed in this assessment';
COMMENT ON COLUMN assessments.assessment_content IS 'JSONB structure containing questions, answers, and scoring logic';
COMMENT ON COLUMN assessments.completions IS 'Number of successful completions of this assessment';
COMMENT ON COLUMN assessments.total_attempts IS 'Total number of attempts (including failed ones)';
COMMENT ON COLUMN assessments.average_score IS 'Average score across all completed assessments';
COMMENT ON COLUMN assessments.success_rate IS 'Percentage of attempts that resulted in passing scores';
COMMENT ON COLUMN assessments.job_opportunity_ids IS 'Array of job opportunity IDs this assessment is relevant for';
COMMENT ON COLUMN assessments.search_keywords IS 'Generated keywords for enhanced search functionality';
COMMENT ON COLUMN assessments.created_by IS 'UUID of the user who created this assessment';
COMMENT ON COLUMN assessments.modified_by IS 'UUID of the user who last modified this assessment'; 