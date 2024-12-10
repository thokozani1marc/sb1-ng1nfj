import { supabaseAdmin } from './supabase-admin';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic select
    const { data: testData, error: testError } = await supabaseAdmin
      .from('subscriptions')
      .select('count(*)');

    if (testError) {
      console.error('Database SELECT test failed:', {
        error: testError,
        code: testError.code,
        message: testError.message
      });
      return;
    }

    console.log('Database SELECT test successful:', testData);

    // Test insert
    const testSubscription = {
      user_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
      subscription_id: 'test-' + Date.now(),
      customer_id: 'test-customer',
      plan_id: 'test-plan',
      variant_id: 'test-variant',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('subscriptions')
      .insert([testSubscription])
      .select();

    if (insertError) {
      console.error('Database INSERT test failed:', {
        error: insertError,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details
      });
      return;
    }

    console.log('Database INSERT test successful:', insertData);

    // Clean up test data
    const { error: deleteError } = await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('subscription_id', testSubscription.subscription_id);

    if (deleteError) {
      console.error('Database DELETE test failed:', {
        error: deleteError,
        code: deleteError.code,
        message: deleteError.message
      });
      return;
    }

    console.log('Database connection tests completed successfully');
  } catch (error) {
    console.error('Database test error:', error);
  }
}
