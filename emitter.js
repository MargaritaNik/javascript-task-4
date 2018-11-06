'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = new Map();

    return {

        on: function (event, context, handler) {
            const object = {
                func: handler,
                context,
                frequency: 1,
                times: Infinity,
                count: 0
            };

            if (!events.has(event)) {
                events.set(event, []);
            }

            events.get(event).push(object);

            return this;
        },

        off: function (event, context) {
            for (let key of [...events.keys()]) {
                if (key === event || key.startsWith(event + '.')) {
                    let needingEvents = events.get(event);
                    needingEvents.forEach((eventObject, index) => {
                        if (eventObject.context === context) {
                            events.get(event).splice(index, 1);
                        }
                    });
                }
            }

            return this;
        },

        emit: function (event) {
            let eventToEmit = getAllEvents(event, events);
            eventToEmit.forEach(currentEvent => {
                events.get(currentEvent).forEach(eventObject => {
                    if (eventObject.times > eventObject.count &&
                        eventObject.count % eventObject.frequency === 0) {
                        eventObject.func.call(eventObject.context);
                    }
                    eventObject.count++;
                });
            });

            return this;
        },

        several: function (event, context, handler, times) {
            var object = {
                func: handler,
                context,
                frequency: 1,
                times: times <= 0 ? Infinity : times,
                count: 0
            };

            if (!events.has(event)) {
                events.set(event, []);
            }
            events.get(event).push(object);

            return this;
        },

        through: function (event, context, handler, frequency) {
            var object = {
                func: handler,
                context,
                frequency: frequency <= 0 ? 1 : frequency,
                times: Infinity,
                count: 0
            };

            if (!events.has(event)) {
                events.set(event, []);
            }

            events.get(event).push(object);

            return this;
        }
    };
}

function getAllEvents(event, events) {
    let allEvent = event.split('.');
    let eventToEmit = [];
    let str = '';
    for (let i = 0; i < allEvent.length; i++) {
        if (i === 0) {
            str += allEvent[i];
        } else {
            str += '.' + allEvent[i];
        }
        if (events.has(str)) {
            eventToEmit.push(str);
        }
    }
    eventToEmit.reverse();

    return eventToEmit;
}

module.exports = {
    getEmitter,

    isStar
};
