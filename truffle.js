module.exports = {
  networks: {
    development: {
      host: "192.168.0.198",
      port: 8002,
      network_id: "999",// Match any network id
      gas:3000000
    },
      publicNet: {
          host:"192.168.0.198",
          port: 8002,

          network_id: "1",// Match any network id
          gas:3000000
      },
      ropsten2: {
          host:"192.168.0.198",
          port: 8002,
          network_id: "3",// Match any network id
          gas:3000000
      },
  }
};
