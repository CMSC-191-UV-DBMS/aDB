# aDB: A single-user prototype DBMS

A prototype DBMS with a predefined set of minimum features. It is meant to be used by one user only at a time. Also, all queries are auto-commit.

### Supported features:

#####DML statements
 - INSERT
 - SELECT

#####Query clauses
 - WHERE clauses are single condition only

###Usage:
Since Chrome only allows cross origin requests are only supported for protocol schemes, (```file://``` not included), for us to read local CSV files, we need to run a simple server at the project root either via python or Node.js:

Then proceed to ```localhost:8000```.

>This is needed only when you want to view the project using Chrome. You do not have to do this when viewing the project using Firefox.

#####Python
```
    $ python -m SimpleHTTPServer
```

> You do not have to install anything. Details explained [here](http://stackoverflow.com/a/23118676).

#####Node.js
```
    $ node server.js
```
> Do not forget to run ```npm install``` if you are going to do it via node.
