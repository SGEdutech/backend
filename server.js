const express = require('express');
const path = require('path');
const cors = require('cors');
const PORT = require('./config').SERVER.PORT;
const session = require('express-session');
const passport = require('passport');
const keys = require('./oauth/_config').keys;
const {eventCoverPicMiddleware, schoolCoverPicMiddleware, tuitionCoverPicMiddleware, userCoverPicMiddleware} =
    require('./storage-engine');
const {nestingMiddleware} = require('./scripts/nesting');
const passwordHashingMiddleware = require('./scripts/hashPassword');
const sanitizeDemandsMiddleware = require('./scripts/sanatize-demands');
const {dashboard, loginPage} = require('./public-paths.json');
require('./oauth/local');
require('./oauth/google');
require('./oauth/facebook');
require('./database/connection');

const routes = {
    blog: require('./database/api/blog'),
    event: require('./database/api/event'),
    school: require('./database/api/school'),
    tuition: require('./database/api/tuition'),
    user: require('./database/api/user'),
    issue: require('./database/api/issue'),
    auth: require('./oauth/auth_routes')
};


const app = express();

app.use(session({
    secret: keys.CookieKey,
    cookie: {maxAge: 7 * 24 * 60 * 60 * 1000},
    maxAge: Date.now() + (7 * 86400 * 1000)
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(`/${dashboard}`, (req, res, next) => {
    if (req.user === undefined) {
        res.redirect(`/${loginPage}`);
        return;
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//temp routes
app.use('/add/tuition', (req, res) => res.redirect('/add-tuition.html'));
app.use('/add/school', (req, res) => res.redirect('/add-school.html'));
app.use('/admin/tuition', (req, res) => res.redirect('/Admin-tuition.html'));

app.use(cors());

app.use('/event', eventCoverPicMiddleware);
app.use('/school', schoolCoverPicMiddleware);
app.use('/tuition', tuitionCoverPicMiddleware);
app.use('/user', userCoverPicMiddleware);

app.get('/*', sanitizeDemandsMiddleware);

app.use(nestingMiddleware);

app.use(passwordHashingMiddleware);

app.use('/blog', routes.blog);
app.use('/event', routes.event);
app.use('/school', routes.school);
app.use('/tuition', routes.tuition);
app.use('/issue', routes.issue);
app.use('/user', routes.user);
app.use('/auth', routes.auth);
app.get('/*', (req, res) => res.redirect('/error-page.html'));

app.listen(PORT, () => console.log(`Yo dawg! Server's at http://localhost:${PORT}`));