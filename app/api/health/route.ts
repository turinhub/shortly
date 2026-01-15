import { NextResponse } from 'next/server'
import { healthCheck } from '@/lib/db'

/**
 * Database health check endpoint
 * GET /api/health
 */
export async function GET() {
  try {
    const isHealthy = await healthCheck()

    if (isHealthy) {
      return NextResponse.json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          status: 'error',
          database: 'disconnected',
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
