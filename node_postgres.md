# PostgreSQL JavaScript Library Review

This series tries to review the PostgreSQL libary for Node.js which is written
in pure JavaScript. The goal of this review is firstly to give the author a
better understanding of the library, and every once in a while stumble upon a 
fun programming concept.

# Choice of library

This library is a main-stream one, those with a few thousands of stars and
followers on GitHub, plus it's an interesting library connecting the two worlds
of PostgreSQL and JavaScript together.

This is not going to be a thorough review, covering every piece of the software
instead, it's going to be a look through a keyhole into the library internals
and how it does its magic.


# Table of contents

## Connection

### constructor

{% gist a9848d5bc57b4b5fb510f08bcc5c4efe node-postgres-constructor.js %}

### constructor

{% gist a9848d5bc57b4b5fb510f08bcc5c4efe node-postgres-connect.js %}
