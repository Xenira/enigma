import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import passport from 'passport';
import * as path from 'path';
import * as favicon from 'serve-favicon';

// ####################################
// Import routes and db inits
// ####################################
import './models/db';
import router from './routes';

const app = express();

if (app.get('env') === 'development') {
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		next();
	});
}

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	session({
		cookie: { secure: app.get('env') !== 'development', maxAge: 3600000 },
		resave: true,
		saveUninitialized: true,
		secret: 'keyboard cat',
	})
);
app.use(passport.initialize());
app.use(passport.session());
import './config/passport';

app.use(express.static(path.join(__dirname, 'static')));
app.use('/api/v1', router);
app.use('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// error handlers

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err: any = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Unauthorized Error
app.use((err: any, req: any, res: any, next: any) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		return res.json({ message: err.name + ': ' + err.message });
	}
	next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	console.warn(
		'Registering dev error handler. If you see this message in prod use, there is something wrong.'
	);
	app.use((err: any, req: any, res: any, next: any) => {
		res.status(err.status || 500);
		res.json({
			error: err,
			message: err.message,
		});
	});
} else {
	// production error handler
	// no stacktraces leaked to user
	app.use((err: any, req: any, res: any, next: any) => {
		res.status(err.status || 500);
		res.json({
			error: {},
			message: err.message,
		});
	});
}

export default app;
