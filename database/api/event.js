const route = require('express').Router();
const Event = require('../modles/event');
const DbAPIClass = require('../api-functions');
const eventDbFunctions = new DbAPIClass(Event);

route.get('/all', (req, res) => {
    eventDbFunctions.getAllData().then(data => res.send(data)).catch(err => console.error(err));
});

route.get('/', (req, res) => {
    eventDbFunctions.getSpecificData(req.query).then(data => res.send(data)).catch(err => console.error(err));
});

route.post('/', (req, res) => {
    eventDbFunctions.addCollection(req.body).then(data => res.send(data)).catch(err => console.error(err));
});

route.put('/:eventId', (req, res) => {
    eventDbFunctions.updateOneRow(req.params, req.body).then(data => res.send(data)).catch(err => console.error(err));
});

route.delete('/:eventId', (req, res) => {
    eventDbFunctions.deleteOneRow(req.params).then(data => res.send(data)).catch(err => console.error(err));
});

module.exports = route;