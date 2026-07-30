import type { Request, Response, NextFunction } from 'express';
/**
 * 1. CREATE WORK SCHEDULE (Admin)
 */
export declare const createWorkSchedule: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 2. GET ALL WORK SCHEDULES
 */
export declare const getAllWorkSchedules: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 3. GET WORK SCHEDULE BY ID
 */
export declare const getWorkScheduleById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 4. UPDATE WORK SCHEDULE (Admin)
 */
export declare const updateWorkSchedule: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 5. DELETE WORK SCHEDULE (Admin)
 */
export declare const deleteWorkSchedule: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=workSchedulesController.d.ts.map