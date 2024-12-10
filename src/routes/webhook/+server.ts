import { WebhookService } from '../../services/webhook.service';
import type { RequestEvent } from '@sveltejs/kit';
import { testDatabaseConnection } from '../../lib/test-db';

export async function POST({ request }: RequestEvent) {
  try {
    console.log('Webhook request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers)
    });

    // Test database connection first
    await testDatabaseConnection();

    // Get the signature from the request headers
    const signature = request.headers.get('x-signature');
    if (!signature) {
      console.error('Missing signature in webhook request');
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the webhook payload
    const payload = await request.json();
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

    // Process the webhook
    console.log('Processing webhook with signature:', signature);
    await WebhookService.handleWebhook(signature, payload);

    // Return success response
    console.log('Webhook processed successfully');
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook processing error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
