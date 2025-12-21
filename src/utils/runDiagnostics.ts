import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

export interface DiagnosticResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export async function runDiagnostics(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  // Check 1: Environment Variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    results.push({
      check: 'Environment Variables',
      status: 'fail',
      message: 'Missing Supabase environment variables',
      details: 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env file',
    });
    return results; // Stop here if env vars are missing
  } else {
    results.push({
      check: 'Environment Variables',
      status: 'pass',
      message: 'Environment variables configured',
      details: `URL: ${supabaseUrl.replace(/\/\/.*@/, '//***@')}`,
    });
  }

  // Check 2: Supabase Client Initialization
  if (!isSupabaseConfigured()) {
    results.push({
      check: 'Supabase Client',
      status: 'fail',
      message: 'Supabase client not properly initialized',
    });
    return results;
  } else {
    results.push({
      check: 'Supabase Client',
      status: 'pass',
      message: 'Supabase client initialized successfully',
    });
  }

  // Check 3: Database Connection
  try {
    const { data, error } = await supabase.from('cars').select('id').limit(1);
    
    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        results.push({
          check: 'Database Tables',
          status: 'fail',
          message: 'Database tables do not exist',
          details: 'The "cars" table is missing. Please run the migration files in your Supabase SQL Editor.',
        });
      } else if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        results.push({
          check: 'Database Connection',
          status: 'warning',
          message: 'Connection successful but permission issue',
          details: error.message,
        });
      } else {
        results.push({
          check: 'Database Connection',
          status: 'fail',
          message: 'Failed to connect to database',
          details: error.message,
        });
      }
    } else {
      results.push({
        check: 'Database Connection',
        status: 'pass',
        message: 'Successfully connected to database',
      });
    }
  } catch (error) {
    results.push({
      check: 'Database Connection',
      status: 'fail',
      message: 'Connection error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Check 4: Cars Table Structure
  try {
    const { data, error } = await supabase.from('cars').select('*').limit(0);
    
    if (!error) {
      results.push({
        check: 'Cars Table',
        status: 'pass',
        message: 'Cars table exists and is accessible',
      });
    } else if (error.message?.includes('does not exist')) {
      results.push({
        check: 'Cars Table',
        status: 'fail',
        message: 'Cars table does not exist',
        details: 'Run migration: 20250908122801_d42b48c9-784f-4e70-8b00-cafd15240f89.sql',
      });
    }
  } catch (error) {
    // Already handled in previous check
  }

  // Check 5: Car Images Table
  try {
    const { data, error } = await supabase.from('car_images').select('id').limit(1);
    
    if (error) {
      if (error.message?.includes('does not exist')) {
        results.push({
          check: 'Car Images Table',
          status: 'fail',
          message: 'Car images table does not exist',
          details: 'Run migration: 20250908122801_d42b48c9-784f-4e70-8b00-cafd15240f89.sql',
        });
      }
    } else {
      results.push({
        check: 'Car Images Table',
        status: 'pass',
        message: 'Car images table exists',
      });
    }
  } catch (error) {
    // Skip if we can't check
  }

  // Check 6: Storage Bucket
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      results.push({
        check: 'Storage Access',
        status: 'warning',
        message: 'Could not access storage',
        details: error.message,
      });
    } else {
      const hasCarImagesBucket = buckets?.some(bucket => bucket.id === 'car-images') || false;
      
      if (hasCarImagesBucket) {
        results.push({
          check: 'Storage Bucket',
          status: 'pass',
          message: 'car-images bucket exists',
        });
      } else {
        results.push({
          check: 'Storage Bucket',
          status: 'warning',
          message: 'car-images bucket not found',
          details: 'Create the bucket in Supabase Storage settings and make it public',
        });
      }
    }
  } catch (error) {
    results.push({
      check: 'Storage Bucket',
      status: 'warning',
      message: 'Could not check storage bucket',
    });
  }

  // Check 7: Data Count
  try {
    const { count, error } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true })
      .eq('available', true);
    
    if (!error && count !== null) {
      if (count === 0) {
        results.push({
          check: 'Car Data',
          status: 'warning',
          message: 'No cars in database',
          details: `Found ${count} available cars. Add cars through the backoffice.`,
        });
      } else {
        results.push({
          check: 'Car Data',
          status: 'pass',
          message: `Found ${count} available car(s) in database`,
        });
      }
    }
  } catch (error) {
    // Skip if we can't check
  }

  return results;
}

