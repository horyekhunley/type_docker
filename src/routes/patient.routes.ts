import { Router } from 'express'
import { create_patient, delete_patient, get_patient, get_patients, update_patient } from '../controllers/patient.controllers'

const router = Router()

router.route('/').get(get_patients).post(create_patient)

router.route('/:id').get(get_patient).put(update_patient).delete(delete_patient)


export default router