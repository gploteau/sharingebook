import fs from 'fs'
import path from 'path'
import * as mm from 'music-metadata';
const { getAudioDurationInSeconds } = require('get-audio-duration')
const md5 = require('md5');

const getTracks = async () => {

    const dirRelativeToPublicFolder = 'sound';

    const db_file = path.resolve('./public', 'db.json');

    let db = [];

    if(fs.existsSync(db_file)) {
        db = JSON.parse(fs.readFileSync(db_file));
    }

    const dir = path.resolve('./public', dirRelativeToPublicFolder);

    const filenames = fs.readdirSync(dir);

    if(filenames.length === db.length) {
        return db;
    }

    const tracks = await Promise.all(filenames.map(name => {
        path.join('/', dirRelativeToPublicFolder, name)
        const metaData = mm.parseFile(path.join(dir, name));
        const duration = getAudioDurationInSeconds(path.join(dir, name));

        return duration.then((duration) => {
            return metaData.then((metadata) => {

                let cover = metadata.common.picture ?
                    'data:' + metadata.common.picture[0].format + ';base64,' + Buffer.from(metadata.common.picture[0].data).toString('base64') : ''

                return {
                    id: md5(name),
                    duration: duration,
                    file: path.join('/', dirRelativeToPublicFolder, name),
                    title: metadata.common.title || name,
                    author: metadata.common.artist,
                    cover : cover
                };
            });
        })
    }));

    fs.writeFileSync(db_file, JSON.stringify(tracks));

    return tracks;
}

export default async (req, res) => {

    const images = await getTracks();

    return res.status(200).json(images);

}
