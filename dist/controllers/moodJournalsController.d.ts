import type { Request, Response, NextFunction } from 'express';
export declare const createMoodJournal: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllMoodJournals: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMonthlyMoodJournals: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 3. GET MY MOOD JOURNALS (Employee — hanya milik sendiri)
 */
export declare const getMyMoodJournals: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 4. UPDATE MOOD JOURNAL (Admin / Owner)
 */
export declare const updateMoodJournal: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 4. DELETE MOOD JOURNAL (Admin / Owner)
 */
export declare const deleteMoodJournal: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=moodJournalsController.d.ts.map