// Error Logging Utility
import { NextRequest } from 'next/server';

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    error?: Error;
    context?: Record<string, any>;
    timestamp: string;
    request?: {
        method?: string;
        url?: string;
        ip?: string;
        userAgent?: string;
    };
}

class ErrorLogger {
    private logs: LogEntry[] = [];
    private maxLogs = 1000; // Keep last 1000 logs in memory

    log(entry: Omit<LogEntry, 'timestamp'>) {
        const logEntry: LogEntry = {
            ...entry,
            timestamp: new Date().toISOString(),
        };

        // Add to in-memory store
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Console output based on environment
        if (process.env.NODE_ENV === 'development') {
            const consoleMethod = entry.level === LogLevel.ERROR ? 'error' : 
                                 entry.level === LogLevel.WARN ? 'warn' : 
                                 entry.level === LogLevel.INFO ? 'info' : 'log';
            
            console[consoleMethod](`[${entry.level}] ${entry.message}`, {
                error: entry.error,
                context: entry.context,
                request: entry.request,
            });
        } else {
            // In production, you might want to send to external logging service
            // For now, we'll just keep in memory and log errors
            if (entry.level === LogLevel.ERROR) {
                console.error(`[${entry.level}] ${entry.message}`, entry.error);
            }
        }
    }

    error(message: string, error?: Error, context?: Record<string, any>, request?: NextRequest) {
        this.log({
            level: LogLevel.ERROR,
            message,
            error,
            context,
            request: request ? this.extractRequestInfo(request) : undefined,
        });
    }

    warn(message: string, context?: Record<string, any>, request?: NextRequest) {
        this.log({
            level: LogLevel.WARN,
            message,
            context,
            request: request ? this.extractRequestInfo(request) : undefined,
        });
    }

    info(message: string, context?: Record<string, any>, request?: NextRequest) {
        this.log({
            level: LogLevel.INFO,
            message,
            context,
            request: request ? this.extractRequestInfo(request) : undefined,
        });
    }

    debug(message: string, context?: Record<string, any>, request?: NextRequest) {
        this.log({
            level: LogLevel.DEBUG,
            message,
            context,
            request: request ? this.extractRequestInfo(request) : undefined,
        });
    }

    private extractRequestInfo(request: NextRequest) {
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
        
        return {
            method: request.method,
            url: request.url,
            ip,
            userAgent: request.headers.get('user-agent') || undefined,
        };
    }

    getLogs(level?: LogLevel, limit?: number): LogEntry[] {
        let filtered = this.logs;
        
        if (level) {
            filtered = filtered.filter(log => log.level === level);
        }
        
        if (limit) {
            filtered = filtered.slice(-limit);
        }
        
        return filtered.reverse(); // Most recent first
    }

    clear() {
        this.logs = [];
    }
}

export const errorLogger = new ErrorLogger();

