import fs from 'fs'
import path from 'path'

const getTracks = async () => {

    const db_file = path.resolve('./public', 'db.json');

    let db = [];

    if(fs.existsSync(db_file)) {
        db = JSON.parse(fs.readFileSync(db_file));
    }

    return db;
}

export default async (req, res) => {

    const images = await getTracks();

    return res.status(200).json(images);

}
