# ORM type declaration

File with all type declarations used in development is read and converted to OpenApi structure at server start and joins with metadata from ORM.

Syntax
Property is used to follow OpenApi and object can be more than a table

Foreign key (Fk)
[Property, FK Property, FK Table][]

Property with FK, Uk or Pk are bold
Property required: false if |null is last in TYPE column else true

Views with join from tables, function results or data from objects start with name 'View'

@{ORM}