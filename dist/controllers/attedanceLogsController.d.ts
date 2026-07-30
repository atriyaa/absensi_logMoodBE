import type { Request, Response, NextFunction } from 'express';
export declare const checkIn: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkOut: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyAttendance: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllAttendanceLogs: (_req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMonthlyAttendanceLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDepartmentMonthlyReport: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=attedanceLogsController.d.ts.map