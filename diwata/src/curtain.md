# Curtain 

Curtain is a user-friendly database interface with a great of
focus on discoverability by the user.

Curtain focus on the DML(Data Manipulation Language) functionality of database.

Curtain is aimed to be a quick application backend to applications that
uses a database.

## Motivation
This has been tried before in the past, but didn't quite achieve the level
of quality that I was hoping for.

## Shortcomings of previous attempt.
- The ui/widget representation is plain, mostly only textbox representation
- The listing on records is monotonous per table.
- No further information of a selected record.
- Viewing a table fetches all the table content by default.

## Functionalities aimed
- Listing of data with a nice widget presentation according to data type and value

```bob


                         product_availability
                        /
                    _______
            (M:1)  /       \
 order_line <---- / product \
                  \_________/
                       \
                        \--> category   ( via product_category )
                         \
                          \---> photo   ( via product_photo )
                           \
                            `---> review  (via product_review )
  
```


## Curtain comprise of 3 major components

1. rustorm
2. intel
3. client

```bob

         
                _______
              ,'       `.
             /           \
            |   rustorm   |
             \           /
              `._______,'
                   |     ____________________
                   |    /                   /
                   |   / Database metadata /
                   |  /___________________/
                   v
               _________
              /         \
             /   intel   \
             \           /
              \_________/
                   |     ______________________
                   |    /                     /
                   |   / Data interpretation /
                   |  /_____________________/
                   v
       .------------------------.
       |        client          |
       |                        |
       |                        |
       '------------------------'

```

## Rustorm 
rustorm is the database ORM that takes care of extract table meta data
from the underlying database. PostgreSQL is the only supported database for
now.

## Intel 
intel is the intellisense of the system which does inference of an interpreting
the data being instrospected. This contains the logic for determining the presentation
of the data to the client. It fills the gap when there is not enough information
extracted from the system.

## Client 
the client does pull the curtain API and display the content in a nice
and structure presentation. Aside from just being a interactice Rich client application,
the client is also responsible for mapping the URL to their corresponding application
state and modules activated. Sharing the URL to other users with the same login
credentials will show the same exact content.
