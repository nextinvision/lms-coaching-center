// Supabase Storage Service for PDFs
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseStorage = {
    /**
     * Upload PDF file to Supabase Storage
     */
    async uploadPDF(file: File, path: string): Promise<{ url: string; path: string }> {
        const { data, error } = await supabase.storage
            .from('pdfs')
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            throw new Error(`Failed to upload PDF: ${error.message}`);
        }

        const { data: urlData } = supabase.storage
            .from('pdfs')
            .getPublicUrl(data.path);

        return {
            url: urlData.publicUrl,
            path: data.path,
        };
    },

    /**
     * Get public URL for a PDF
     */
    getPublicUrl(path: string): string {
        const { data } = supabase.storage.from('pdfs').getPublicUrl(path);
        return data.publicUrl;
    },

    /**
     * Delete PDF from storage
     */
    async deletePDF(path: string): Promise<void> {
        const { error } = await supabase.storage.from('pdfs').remove([path]);

        if (error) {
            throw new Error(`Failed to delete PDF: ${error.message}`);
        }
    },

    /**
     * List files in a directory
     */
    async listFiles(prefix: string) {
        const { data, error } = await supabase.storage.from('pdfs').list(prefix);

        if (error) {
            throw new Error(`Failed to list files: ${error.message}`);
        }

        return data;
    },

    /**
     * Download file
     */
    async downloadFile(path: string): Promise<Blob> {
        const { data, error } = await supabase.storage.from('pdfs').download(path);

        if (error) {
            throw new Error(`Failed to download file: ${error.message}`);
        }

        return data;
    },
};

export default supabaseStorage;
