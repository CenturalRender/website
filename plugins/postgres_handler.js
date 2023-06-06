'use strict'

const fp = require('fastify-plugin')

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {
    fastify.register(require('@fastify/postgres'), {
        connectionString: 'postgres://kgotuble:ugMEV2bKbsV5meiCd5aUdTeyRV29jUhh@drona.db.elephantsql.com/kgotuble'
    })
    fastify.register(require('fastify-postgraphile'), {
        pool: {
          user: 'kgotuble',
          host: 'drona.db.elephantsql.com',
          database: 'kgotuble',
          password: 'ugMEV2bKbsV5meiCd5aUdTeyRV29jUhh',
          port: 5432
        },
        schemas: 'public',
        middleware: true, // default
        postgraphileOptions: {
          graphiql: true
        }
      })
      
    fastify.get('/graphql', async (req, reply) => {
    return reply.graphql(req.body.query, req.body.variables)
    })
    
    
    fastify.get('/user/:id', async (req, reply) => {
    const client = await fastify.pg.connect()
    try {
        const { rows } = await client.query(
        'SELECT username, hash, salt FROM user WHERE username=$1', [req.params.id],
        )
        // Note: avoid doing expensive computation here, this will block releasing the client
        return rows
    } finally {
        // Release the client immediately after query resolves, or upon error
        client.release()
    }
    })
})
