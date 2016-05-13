module.exports = function(db, conn, conf) {
  return db.db(conf.database.name).table("servers").insert([
    {
      name: "Host-1",
      parent: null,
      is_offline: false
    },
    {
      name: "Host-2",
      parent: null,
      is_offline: false
    },
    {
      name: "Host-3",
      parent: null,
      is_offline: true
    },
    {
      name: "Server-1", 
      parent: "Host-1",
      ip: "localhost",
      port: 60000,
      connections: 0,
      max_connections: 60,
      is_offline: false
    },
    {
      name: "Server-2", 
      parent: "Host-1",
      ip: "localhost",
      port: 60001,
      connections: 0,
      max_connections: 60,
      is_offline: false
    },
    {
      name: "Server-1", 
      parent: "Host-2",
      ip: "localhost",
      port: 60002,
      connections: 60,
      max_connections: 60,
      is_offline: false
    },
    {
      name: "Server-2", 
      parent: "Host-2",
      ip: "localhost",
      port: 60002,
      connections: 60,
      max_connections: 60,
      is_offline: true
    }
    ]).run(conn);
};