// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';

// Mock winston
vi.mock('winston', () => {
    const format = {
        combine: vi.fn(),
        timestamp: vi.fn(),
        printf: vi.fn(),
        colorize: vi.fn(),
    };
    const transports = {
        Console: vi.fn(),
        File: vi.fn(),
    };
    return {
        default: {
            format,
            transports,
            createLogger: vi.fn().mockReturnValue({
                info: vi.fn(),
                error: vi.fn(),
                debug: vi.fn(),
            }),
        },
        format,
        transports,
        createLogger: vi.fn().mockReturnValue({
            info: vi.fn(),
            error: vi.fn(),
            debug: vi.fn(),
        }),
    };
});

import { logger } from './logger';

describe('Logger Utility', () => {
    it('should be defined', () => {
        expect(logger).toBeDefined();
    });

    it('should have standard logging methods', () => {
        expect(logger.info).toBeDefined();
        expect(logger.error).toBeDefined();
        expect(logger.debug).toBeDefined();
    });
});
