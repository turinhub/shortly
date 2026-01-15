import { NextRequest, NextResponse } from 'next/server'
import { getLinkByShortLink, recordActivity } from '@/lib/link-service'
import { userAgent } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  // Try to find the link
  const link = await getLinkByShortLink(code)

  if (!link) {
    // Redirect to home page if link not found
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (link.status === 'frozen') {
    // Redirect to frozen page if link is paused
    return NextResponse.redirect(new URL('/frozen', request.url))
  }

  // Record activity
  const ua = userAgent(request)
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown'

  // We can try to guess region from headers if available (e.g. Vercel)
  const region = request.headers.get('x-vercel-ip-country') || 'unknown'

  try {
    // Record activity asynchronously but await to ensure it's captured
    // (In serverless environments, unawaited promises might be cancelled)
    await recordActivity(link.id, {
      ip: typeof ip === 'string' ? ip : ip[0], // x-forwarded-for can be array
      device: ua.device.type || 'desktop',
      region: typeof region === 'string' ? region : 'unknown',
      origin: request.headers.get('referer') || 'direct',
    })
  } catch (error) {
    console.error('Failed to record activity:', error)
    // Don't block redirect on error
  }

  return NextResponse.redirect(link.long_link)
}
