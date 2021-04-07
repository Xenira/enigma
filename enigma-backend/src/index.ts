import app from './app';

// rest of the code remains same
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
