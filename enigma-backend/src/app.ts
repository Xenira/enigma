import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import passport from 'passport';
import * as path from 'path';
import KnexSessionStore from 'connect-session-knex';
import knexInstance from './models/db';

// ####################################
// Import routes and db inits
// ####################################
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

if (!process.env.SESSION_SECRET) {
	throw new Error(
		'Session secret must be set. Please provide SESSION_SECRET environment variable'
	);
}
const sessionConfig: session.SessionOptions = {
	secret: process.env.SESSION_SECRET,
	cookie: { maxAge: 3600000 },
	saveUninitialized: false,
	resave: false,
	store: new (KnexSessionStore(session))({
		knex: knexInstance as any,
	}),
};
if (app.get('env') === 'production') {
	app.set('trust proxy', 1);
	(sessionConfig.cookie || {}).secure = true;
}
app.use(session(sessionConfig));

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
