# Matefest 2018 Stand Repo

## Webapp

The webapp should start with a menu with the following options:
- Blockchain: shows every block. One can follow the links to each block to see its transactions.
- Watch account: shows a text input, one can write any address and see its balance and past transactions.
- Make transaction: enter a public/private key pair and a destination account, plus an amount of coins to transfer.

Additionally, the first time the user accesses the app, a new address (public/private key pair) will be generated and displayed. For increased usability (and to avoid any memorization) these should be cached into the device.

Design/ui: I would personally use Bootstrap (v3 or 4, I don't really mind).

## Tasks

[ ] Create keys at first access and store into a cookie
[ ] Define database schema
[ ] Visualize blocks and transactions
[ ] Compute account (public key) status from transactions
[ ] Make transactions
[ ] Mining
