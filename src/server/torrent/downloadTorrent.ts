import torrentStream from 'torrent-stream';

export const downloadTorrent = async (magnetLink: string, imdbCode: string) => new Promise((resolve) => {

	const torrentStreamOptions: {} = { // this will have to be specified later, testing purpose
		trackers: [
			'udp://open.demonii.com:1337/announce',
			'udp://tracker.openbittorrent.com:80',
			'udp://tracker.coppersurfer.tk:6969',
			'udp://glotorrents.pw:6969/announce',
			'udp://tracker.opentrackr.org:1337/announce',
			'udp://torrent.gresille.org:80/announce',
			'udp://p4p.arenabg.com:1337',
			'udp://tracker.leechers-paradise.org:6969',
		],
		path: `./movies/${imdbCode}`
	};

	const engine: TorrentStream.TorrentEngine = torrentStream(magnetLink, torrentStreamOptions);
	
	engine.on('ready', () => {
		console.log('Engine is ready!');
		console.log('This is the url passed: ', magnetLink);
	})
	
	engine.on('torrent', () => {
		console.log('These are the files : ', engine.files);
		engine.files.forEach((file: TorrentStream.TorrentFile) => {
			console.log('filename : ', file.name);
			if (file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.webm')) {
				file.select();
				// here i would want to save the path of the movie into the database
				// and the file name as well because it might be needed to give the full path in the streaming function
			  } else {
				file.deselect();
			}
		});
	});

	engine.on('download', () => {
		console.log('Piece downloaded!');
		resolve('');
	});
	
	engine.on('idle', () => {
		// set the movie as downloaded into database or somewhere
		engine.destroy(() => {
			console.log('All connections to peers destroyed.');
		})
	});
});