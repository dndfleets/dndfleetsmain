import { supabase } from '@/integrations/supabase/client';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    url?: string;
    hasTables?: boolean;
    tables?: string[];
    error?: string;
  };
}

/**
 * Test the Supabase connection and verify database setup
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  try {
    // Test 1: Check if environment variables are set
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return {
        success: false,
        message: 'Missing environment variables',
        details: {
          error: 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env file',
        },
      };
    }

    // Test 2: Try to query the cars table (should exist if migrations ran)
    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id')
      .limit(1);

    if (carsError) {
      // Check if it's a table doesn't exist error
      if (carsError.message.includes('does not exist') || carsError.code === '42P01') {
        return {
          success: false,
          message: 'Database tables not found',
          details: {
            url: url.replace(/\/\/.*@/, '//***@'), // Mask credentials
            error: 'The "cars" table does not exist. Please run the database migrations.',
          },
        };
      }

      return {
        success: false,
        message: 'Database connection error',
        details: {
          url: url.replace(/\/\/.*@/, '//***@'),
          error: carsError.message,
        },
      };
    }

    // Test 3: Check if car_images table exists
    const { error: imagesError } = await supabase
      .from('car_images')
      .select('id')
      .limit(1);

    if (imagesError) {
      if (imagesError.message.includes('does not exist') || imagesError.code === '42P01') {
        return {
          success: false,
          message: 'Database tables not found',
          details: {
            url: url.replace(/\/\/.*@/, '//***@'),
            error: 'The "car_images" table does not exist. Please run the database migrations.',
          },
        };
      }
    }

    // Test 4: Check storage bucket
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

    const hasCarImagesBucket = buckets?.some(bucket => bucket.id === 'car-images') || false;

    return {
      success: true,
      message: 'Supabase connection successful!',
      details: {
        url: url.replace(/\/\/.*@/, '//***@'),
        hasTables: true,
        tables: ['cars', 'car_images'],
        ...(storageError ? { error: `Storage check failed: ${storageError.message}` } : {}),
        ...(!hasCarImagesBucket ? { error: 'Warning: car-images storage bucket not found' } : {}),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Connection test failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

