const { nanoid } = require('nanoid'); // import nanoid dari package nanoid.
const notes = require('./notes'); // import array notes dari file notes.js.

// handler untuk add notes
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload; // mendapatkan body request di Hapi menggunakan properti request.payload.


    const id = nanoid(16); // membuat id unik menggunakan nanoid.
    const createdAt = new Date().toISOString(); // membuat properti createdAt dengan nilai tanggal dan waktu saat ini.
    const updatedAt = createdAt; // membuat properti updatedAt dengan nilai yang sama dengan createdAt.

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote); // menambahkan newNote ke array notes.

    const isSuccess = notes.filter((note) => note.id === id).length > 0; // mengecek apakah catatan sudah berhasil ditambahkan ke array notes.

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
};

// handler untuk mendapatkan seluruh catatan.
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },

}); 

//handler untuk membuka catatan.
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params; // mengambil nilai id dari parameter request.

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload; //dapatkan data notes terbaru yang dikirimkan oleh client melalui body request.

    const updatedAt = new Date().toISOString(); //perbarui juga nilai dari properti updatedAt dengan tanggal dan waktu saat ini.

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// menghapus catatan
const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler }; // export handler agar dapat digunakan di file lain.