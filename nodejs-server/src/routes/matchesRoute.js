import { getAllMatches } from '../controllers/matchesController'

const router = require('express').Router()

router.get('/', getAllMatches)

export default router