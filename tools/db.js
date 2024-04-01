const { Client } = require('pg');

const client = new Client({
    user: 'secrethitler',
    host: 'localhost',
    database: 'secrethitler',
    password: '1q2w3e4r',
    port: 5432, // Porta predefinita di PostgreSQL
});
var Postgres = require('pg');

var Config = require('./config');
var Utils = require('./utils');

// SETUP

Postgres.defaults.parseInt8 = true;

var connectURL = process.env.DATABASE_URL || Config.LOCAL_DB_URL;
var dbConfigured = connectURL != '';
if (!dbConfigured) {
	console.log('Database not configured');
}

// HELPERS


const query = function(statement, params, callback) {
    client.connect()
        .then(() => {
            client.query(statement, params, (err, result) => {
                if (err) {
                    console.error('Errore durante l\'esecuzione della query:', err);
                    if (callback) {
                        callback(null);
                    }
                } else {
                    if (callback) {
                        callback(result.rows);
                    }
                }
            });
        })
        .catch(err => {
            console.error('Errore durante la connessione al database:', err);
        });
};

module.exports = query;
/*
var query = function(statement, params, callback) {
	//Postgres.connect(connectURL, function(err, client, done) {
		client.connect()
			.then(() => {
				client.query(statement, params, function(err, result) {
					done();
					if (result) {
						if (callback) {
							callback(result.rows);
						}
					} else if (dbConfigured) {
						console.error('QUERY ERROR');
						console.log(statement, params);
						console.log(err);
					}
				});
				
			})
			.catch(err => {
				if (dbConfigured) {
				console.error('CLIENT CONNECTION ERROR');
				console.log(err, client, done);
			}
			done();
			return;
			});
/*			
		if (!client) {
			if (dbConfigured) {
				console.error('CLIENT CONNECTION ERROR');
				console.log(err, client, done);
			}
			done();
			return;
		}
		client.query(statement, params, function(err, result) {
			done();
			if (result) {
				if (callback) {
					callback(result.rows);
				}
			} else if (dbConfigured) {
				console.error('QUERY ERROR');
				console.log(statement, params);
				console.log(err);
			}
		});
	});

};
*/
var queryOne = function(statement, params, callback) {
	query(statement, params, function(result) {
		if (callback) {
			callback(result[0]);
		}
	});
};

var fetch = function(columns, table, where, params, callback) {
	queryOne('SELECT ' + columns + ' FROM ' + table + ' WHERE ' + where + ' LIMIT 1', params, callback);
};

var property = function(column, table, where, params, callback) {
	fetch(column, table, where, params, function(result) {
		callback(result[column]);
	});
};

// UPSERT

var update = function(table, where, columnsValues, returning, callback) {
	columnsValues.updated_at = Utils.now();

	var columns = [], values = [], placeholders = [];
	var index = 0;
	for (var column in columnsValues) {
		columns.push(column);
		values.push(columnsValues[column]);
		placeholders.push('$' + (++index));
	}
	var queryString = 'UPDATE ' + table + ' SET (' + columns.join() + ') = (' + placeholders.join() + ') WHERE ' + where;
	queryString += ' RETURNING ' + (returning || 1);
	queryOne(queryString, values, callback);
};

var insert = function(table, columnsValues, returning, callback) {
	var now = Utils.now();
	if (!columnsValues.created_at) {
		columnsValues.created_at = now;
	}
	columnsValues.updated_at = now;

	var columns = [], values = [], placeholders = [];
	var index = 0;
	for (var column in columnsValues) {
		columns.push(column);
		values.push(columnsValues[column]);
		placeholders.push('$' + (++index));
	}
	var queryString = 'INSERT INTO ' + table + ' (' + columns.join() + ') VALUES (' + placeholders.join() + ')';

	queryString += ' RETURNING ' + (returning || 1);
	queryOne(queryString, values, callback);
};

// PUBLIC

module.exports = {

	query: query,

	queryOne: queryOne,

	fetch: fetch,

	property: property,

	update: update,

	insert: insert,

	upsert: function(table, updateWhere, updateColsVals, returning, insertColsVals, callback) {
		update(table, updateWhere, updateColsVals, returning, function(updated) {
			if (updated) {
				callback(updated);
			} else {
				insert(table, insertColsVals, returning, callback);
			}
		});
	},

	count: function(table, callback) {
		query('SELECT COUNT(*) FROM ' + table, null, function(result) {
			callback(result[0].count);
		});
	},

	updatePlayers: function(userIds, state) {
		console.log(state, userIds);
		query('UPDATE users SET games_'+state+' = games_'+state+' + 1 WHERE id IN ('+userIds.join(',')+')');
	},

};
