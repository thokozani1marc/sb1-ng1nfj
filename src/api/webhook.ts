import { WebhookService } from '../services/webhook.service';

export async function handleWebhook(request: Request) {
  try {
    // Get the signature from the request headers
    const signature = request.headers.get('x-signature') || '';
    
    // Get the webhook payload
    const payload = await request.json();

    // Process the webhook
    await WebhookService.handleWebhook(signature, payload);

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
