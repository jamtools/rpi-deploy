import fs from 'fs';
import {Readable} from 'stream';
import {finished} from 'stream/promises';

export const downloadFile = (async (url: string, destination: string) => {
    const res = await fetch(url);
    if (!res.ok || !res.body) {
        return '';
    }

    const fileStream = fs.createWriteStream(destination, {flags: 'wx'});
    await finished(Readable.fromWeb(res.body as any).pipe(fileStream));
});
