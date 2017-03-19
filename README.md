# aDB: A single-user prototype DBMS

A prototype DBMS with a predefined set of minimum features. It is meant to be used by one user only at a time. Also, all queries are auto-commit.

### Supported features:

##### DML statements
 - INSERT
 - SELECT

##### Query clauses
 - WHERE clauses are single condition only

### Usage:
First, run ```npm install``` to install the necessary modules.

Since Chrome only allows cross origin requests are only supported for protocol schemes, (```file://``` not included), for us to read and write to  the local CSV files, we need to run a simple server.

```
$ node server.js
```
Proceed to ```localhost:8000```
