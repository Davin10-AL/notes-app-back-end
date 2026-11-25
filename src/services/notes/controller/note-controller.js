import NoteRepositories from '../../../../repositories/note-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

export const createNote = async (req, res, next) => {
  try {
    const { title, body, tags } = req.validated;
    const { id: owner } = req.user;

    const note = await NoteRepositories.createNote({ title, body, tags, owner });

    if (!note) {
      return next(new InvariantError('Catatan gagal ditambahkan'));
    }

    return response(res, 201, 'Catatan berhasil ditambahkan', { noteId: note.id });
  } catch (err) {
    return next(err);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { title = '' } = req.query;

    const notes = await NoteRepositories.getNotes(owner);

    if (title !== '') {
      const filteredNotes = notes.filter((n) => n.title === title);
      return response(res, 200, 'success', { notes: filteredNotes });
    }

    return response(res, 200, 'success', { notes });
  } catch (err) {
    return next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;

    await NoteRepositories.verifyNoteOwner(id, owner);

    const note = await NoteRepositories.getNoteById(id);

    if (!note) {
      return next(new NotFoundError('Catatan tidak ditemukan'));
    }

    return response(res, 200, 'Catatan sukses ditampilkan', { note });
  } catch (err) {
    return next(err);
  }
};

export const editNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body, tags } = req.validated;
    const { id: owner } = req.user;

    await NoteRepositories.verifyNoteOwner(id, owner);

    const note = await NoteRepositories.editNote({ id, title, body, tags });

    if (!note) {
      return next(new NotFoundError('Catatan tidak ditemukan'));
    }

    return response(res, 200, 'Catatan berhasil diperbarui', note);
  } catch (err) {
    return next(err);
  }
};

export const deleteNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;

    await NoteRepositories.verifyNoteOwner(id, owner);

    const deletedNote = await NoteRepositories.deleteNote(id);

    if (!deletedNote) {
      return next(new NotFoundError('Catatan tidak ditemukan'));
    }

    return response(res, 200, 'catatan berhasil dihapus', deletedNote);
  } catch (err) {
    return next(err);
  }
};
