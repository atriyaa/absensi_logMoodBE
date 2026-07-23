import type { Request, Response, NextFunction } from "express";
import { count, eq, sql, desc } from "drizzle-orm";

import { db } from "../db/index.js";
import { employees } from "../db/employees.js";
import { departments } from "../db/departments.js";
import { attendanceLogs } from "../db/attedanceLogs.js";
import { moodJournals } from "../db/moodJournals.js";

class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const getAdminDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const today = new Date().toISOString().split("T")[0]!;

        const [
            totalEmployees,
            totalDepartments,
            attendanceToday,
            moodToday,
            recentAttendance
        ] = await Promise.all([

            db.select({
                total: count()
            }).from(employees),

            db.select({
                total: count()
            }).from(departments),

            db.select({
                total: count()
            })
            .from(attendanceLogs)
            .where(eq(attendanceLogs.attendanceDate, today)),

            db.select({
                mood: moodJournals.moodLevel,
                total: count()
            })
            .from(moodJournals)
            .where(sql`DATE(${moodJournals.createdAt}) = ${today}`)
            .groupBy(moodJournals.moodLevel)
            .orderBy(desc(count())),

            db.select({
                id: attendanceLogs.id,
                employeeName: employees.full_name,
                department: departments.departmentsName,
                checkIn: attendanceLogs.checkIn,
                attendanceStatus: attendanceLogs.attendanceStatus,
                mood: moodJournals.moodLevel
            })
            .from(attendanceLogs)
            .innerJoin(
                employees,
                eq(attendanceLogs.employeeId, employees.id)
            )
            .leftJoin(
                departments,
                eq(employees.department_id, departments.id)
            )
            .leftJoin(
                moodJournals,
                eq(moodJournals.attendanceLogId, attendanceLogs.id)
            )
            .where(eq(attendanceLogs.attendanceDate, today))
            .orderBy(desc(attendanceLogs.checkIn))
            .limit(5)

        ]);

        const totalEmployee = totalEmployees[0]?.total ?? 0;
        const hadirHariIni = attendanceToday[0]?.total ?? 0;

        const percentage =
            totalEmployee === 0
                ? 0
                : Number(((hadirHariIni / totalEmployee) * 100).toFixed(1));

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data dashboard",
            data: {
                summary: {
                    totalEmployees: totalEmployee,
                    attendanceToday: hadirHariIni,
                    attendancePercentage: percentage,
                    averageMood: moodToday[0]?.mood ?? "-",
                    totalDepartments: totalDepartments[0]?.total ?? 0
                },
                recentAttendance
            }
        });

    } catch (error) {
        next(error);
    }
};