-- Storage bucket for CV and general user file uploads (Candidate Management, chat attachments)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('file-uploads', 'file-uploads', false, 52428800)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "file_uploads_insert_own_folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'file-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "file_uploads_select_own_folder"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'file-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "file_uploads_update_own_folder"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'file-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "file_uploads_delete_own_folder"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'file-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
