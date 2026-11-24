import express from 'express';
import {
  createNote, getAllNotes, getNoteById, editNoteById, deleteNoteById
} from '../services/notes/controller/note-controller.js';
import { createUser, getUserById } from '../services/users/controller/user-controller.js';
import {
  postAuthentication, putAuthentication, deleteAuthentication
} from '../services/authentications/controller/authentication-controller.js';
import validate, { validateQuery } from '../middlewares/validate.js';
import authMiddleware from '../middlewares/auth.js';
import { notePayloadSchema, noteQuerySchema } from '../services/notes/validator/schema.js';
import { userPayloadSchema } from '../services/users/validator/schema.js';
import {
  postAuthenticationSchema,
  putAuthenticationSchema,
  deleteAuthenticationSchema,
} from '../services/authentications/validator/schema.js';

const router = express.Router();

// Authentications
router.post('/authentications', validate(postAuthenticationSchema), postAuthentication);
router.put('/authentications', validate(putAuthenticationSchema), putAuthentication);
router.delete('/authentications', validate(deleteAuthenticationSchema), deleteAuthentication);

// Users
router.post('/users', validate(userPayloadSchema), createUser);
router.get('/users/:id', getUserById);

// Notes (protected)
router.post('/notes', authMiddleware, validate(notePayloadSchema), createNote);
router.get('/notes', authMiddleware, validateQuery(noteQuerySchema), getAllNotes);
router.get('/notes/:id', authMiddleware, getNoteById);
router.put('/notes/:id', authMiddleware, validate(notePayloadSchema), editNoteById);
router.delete('/notes/:id', authMiddleware, deleteNoteById);

export default router;
