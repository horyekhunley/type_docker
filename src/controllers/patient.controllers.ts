import { db_connection } from "../config/mysql.config"
import { Patient } from "../interface/patient"
import { Request, Response } from "express"
import { QUERY } from "../query/patient.query"
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2"

type ResultSet = [
    RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader,
    FieldPacket[]
]

// GET all patients
export const get_patients = async (
    req: Request,
    res: Response
): Promise<Response<Patient[]>> => {
    console.info(
        `[${new Date().toLocaleString()}] Incoming ${req.method}:${req.originalUrl
        } request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
    )

    try {
        const pool = await db_connection()
        const results: ResultSet = await pool.query(QUERY.SELECT_PATIENTS)
        return res.status(200).json({
            message: "Patients retrieved successfully",
            data: results[0],
        })
    } catch (error: unknown) {
        console.error(`[${new Date().toLocaleString()}] ${error}`)
        return res.status(500).json({
            message: "Internal server error",
            error,
        })
    }
}
// GET a single patient
export const get_patient = async (
    req: Request,
    res: Response
): Promise<Response<Patient>> => {
    console.info(
        `[${new Date().toLocaleString()}] Incoming ${req.method}:${req.originalUrl
        } request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
    )

    try {
        const pool = await db_connection()
        const results: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [
            req.params.id,
        ])
        if ((results[0] as Array<ResultSet>).length > 0) {
            return res.status(200).json({
                message: "Patient retrieved successfully",
                data: results[0],
            })
        } else {
            return res.status(404).json({
                message: "Patient not found",
            })
        }
    } catch (error: unknown) {
        console.error(`[${new Date().toLocaleString()}] ${error}`)
        return res.status(500).json({
            message: "Internal server error",
            error,
        })
    }
}
// POST a patient
export const create_patient = async (
    req: Request,
    res: Response
): Promise<Response<Patient>> => {
    console.info(
        `[${new Date().toLocaleString()}] Incoming ${req.method}:${req.originalUrl
        } request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
    )
    let patient: Patient = { ...req.body }

    try {
        const pool = await db_connection()
        const results: ResultSet = await pool.query(
            QUERY.CREATE_PATIENT,
            Object.values(patient)
        )
        patient = { id: (results[0] as ResultSetHeader).insertId, ...req.body }
        return res.status(201).json({
            message: "Patient created successfully",
            data: patient,
        })
    } catch (error: unknown) {
        console.error(`[${new Date().toLocaleString()}] ${error}`)
        return res.status(500).json({
            message: "Internal server error",
            error,
        })
    }
}
// PUT a patient
export const update_patient = async (
    req: Request,
    res: Response
): Promise<Response<Patient>> => {
    console.info(
        `[${new Date().toLocaleString()}] Incoming ${req.method}:${req.originalUrl
        } request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
    )
    let patient: Patient = { ...req.body }

    try {
        const pool = await db_connection()
        const results: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [
            req.params.id,
        ])
        if ((results[0] as Array<ResultSet>).length > 0) {
            const results: ResultSet = await pool.query(QUERY.UPDATE_PATIENT, [
                ...Object.values(patient),
                req.params.id,
            ])
            return res.status(200).json({
                message: "Patient updated successfully",
                ...patient,
                id: req.params.id,
            })
        } else {
            return res.status(404).json({
                message: "Patient not found",
            })
        }
    } catch (error: unknown) {
        console.error(`[${new Date().toLocaleString()}] ${error}`)
        return res.status(500).json({
            message: "Internal server error",
            error,
        })
    }
}
// DELETE a patient
export const delete_patient = async (
    req: Request,
    res: Response
): Promise<Response<Patient>> => {
    console.info(
        `[${new Date().toLocaleString()}] Incoming ${req.method}:${req.originalUrl
        } request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
    )

    try {
        const pool = await db_connection()
        const results: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [
            req.params.id,
        ])
        if ((results[0] as Array<ResultSet>).length > 0) {
            const results: ResultSet = await pool.query(QUERY.DELETE_PATIENT, [
                req.params.id,
            ])
            return res.status(200).json({
                message: "Patient deleted successfully",
            })
        } else {
            return res.status(404).json({
                message: "Patient not found",
            })
        }
    } catch (error: unknown) {
        console.error(`[${new Date().toLocaleString()}] ${error}`)
        return res.status(500).json({
            message: "Internal server error",
            error,
        })
    }
}
