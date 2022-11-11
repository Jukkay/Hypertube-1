import { NextApiRequest, NextApiResponse } from 'next';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const config = {
	api: {
		responseLimit: '20mb',
	},
};
// THIS WHOLE FILE HAS TO BE TYPESCRIPTED PROPERLY !! //
export default function createStream(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const regexPath = /path=(.*)&/;
	const regexImdb = /imdbCode=(.*?)&/;
	const regexSize = /size=(.*)/;
	const regexRange = /bytes=(.*)-/;
	let moviePath: any = req.url?.match(regexPath); // fix typescript // have to have check for if req.url exists before assigning values for these variables 
	moviePath = decodeURI( moviePath[1]);
	const imdbCode: any = req.url?.match(regexImdb); // fix typescript
	const fullSize: any = req.url?.match(regexSize); // fix typescript
	const range = req.headers.range;
	const videoPath = `./movies/${imdbCode[1]}/${moviePath}`;

	if (!range) {
		console.log("No Range Defined");
		const head = {
			'Content-Length': fullSize[1],
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		const videoStream = fs.createReadStream(videoPath)
		videoStream.pipe(res)
	} else {
		let parsedRange: RegExpMatchArray | null | string | number;
		parsedRange = range.match(regexRange);
		if(parsedRange !== null) {
			parsedRange = Number(parsedRange[1]);
		}

		let isMp4:boolean;
		if(videoPath.endsWith('mp4') && videoPath.includes('YTS')) {
			isMp4 = true;
		} else {
			isMp4 = false;
		}
		const videoSize = Number(fullSize[1]);
		const CHUNK_SIZE = 20e6;
		let start = Number(range.replace(/\D/g, ''));
		
		const end = isMp4
		? Math.min(start + CHUNK_SIZE, videoSize - 1)
		: videoSize - 1;
		const contentLength = (end - start) + 1;

		const headers = isMp4
		? {
			'Content-Range': `bytes ${start}-${end}/${videoSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': contentLength,
			'Content-Type': 'video/mp4',
		}
		: {
			"Content-Range": `bytes ${start}-${end}/${videoSize}`,
					"Accept-Ranges": "bytes",
					"Content-Type": "video/matroska"
		};

		// still have to implement if user is using firefox videdo has to be converted to 'webm' and bitrate 512k

		if(parsedRange !== null && parsedRange > fs.statSync(videoPath).size) {
			res.status(216).send('Video download not finished.');
		} else {
			res.writeHead(206, headers);
		}
		const videoStream = fs.createReadStream(videoPath, { start, end });
		if (isMp4) {
			videoStream.pipe(res)
		} else {
			console.log("NOT MP4 !!!!");
			ffmpeg(videoStream)
				.format('matroska')
				.videoBitrate('2048k')
				.on('error', (err) => { 
					console.log('An error occurred: ' + err.message);
				})
				.pipe(res);
		}
	}
}
