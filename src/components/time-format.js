function formatTime(ms) {
	const h = Math.floor(ms/3600/1000);
	const mmss = new Date(ms).toISOString().slice(14, 19);
	return (h == 0) ? mmss : h + ":" + mmss;
}

export default formatTime;

