import { prisma } from '../lib/prisma';

export interface LogEventParams {
  userId: string;
  action: string;
  ipAddress: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Writes an event to the AuditLog table via Prisma.
 * This function never throws an error; if writing fails, it logs to the console only.
 */
export async function logEvent(params: LogEventParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent || null,
        metadata: params.metadata || undefined,
      },
    });
  } catch (error) {
    console.error('[auditLogger] Failed to create audit log entry:', error);
  }
}
