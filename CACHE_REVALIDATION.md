# Cache Revalidation Setup Guide

This application uses Next.js cache revalidation with Sanity webhooks to ensure content changes are immediately reflected on the frontend.

## Environment Variables Required

Add these to your `.env.local` file:

```
SANITY_HOOK_SECRET=your-webhook-secret-here
REVALIDATE_SECRET=your-manual-revalidate-secret
SITE_URL=http://localhost:3000
```

## Setting up Sanity Webhook

1. Go to your Sanity Studio dashboard
2. Navigate to API → Webhooks
3. Create a new webhook with these settings:
   - **Name**: NextMerce Revalidation
   - **URL**: `https://your-domain.com/api/revalidate` (or `http://localhost:3000/api/revalidate` for development)
   - **Trigger on**: Create, Update, Delete
   - **Filter**: Leave empty to trigger on all documents, or use specific filters
   - **Secret**: Use the same value as `SANITY_HOOK_SECRET`
   - **HTTP method**: POST
   - **API version**: Use the same version as your Sanity client

## Manual Cache Revalidation (for Development)

For testing purposes, you can manually trigger cache revalidation:

### Revalidate specific tag:

```
GET/POST http://localhost:3000/api/revalidate-manual?tag=product&secret=your-manual-revalidate-secret
```

### Revalidate all tags:

```
GET http://localhost:3000/api/revalidate-manual?secret=your-manual-revalidate-secret
```

## Available Cache Tags

- `product` - All product-related data
- `category` - Product categories
- `heroBanner` - Hero banner content
- `heroSlider` - Hero slider content
- `countdown` - Countdown banners

## How It Works

1. When you make changes in Sanity Studio, a webhook is triggered
2. The webhook calls `/api/revalidate` with the changed document data
3. The endpoint validates the request using the webhook secret
4. It then calls `revalidateTag()` to invalidate cached data
5. Next.js will fetch fresh data on the next request

## Troubleshooting

### Changes not reflecting immediately:

1. Check that `SANITY_HOOK_SECRET` is set correctly
2. Verify the webhook is configured in Sanity with the correct URL and secret
3. Check the Network tab in Sanity Studio to see if webhooks are being sent
4. Look at server logs for any revalidation errors

### For development (no webhook):

- Set `SANITY_HOOK_SECRET` to empty/undefined to disable caching
- Or use the manual revalidation endpoint to clear cache

### Cache not working in production:

- Ensure `SANITY_HOOK_SECRET` is set in production environment
- Verify webhook URL is pointing to your production domain
- Check that your hosting provider supports Next.js cache revalidation
