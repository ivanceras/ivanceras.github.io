
# Spongedown

[Spongedown](https://github.com/ivanceras/spongedown) is an extension of Github Flavored Markdown
with more components added, maily [svgbob](https://github.com/ivanceras/svgbobrus/)



```bob

 _____                       _               
|   __|___ ___ ___ ___ ___ _| |___ _ _ _ ___ 
|__   | . | . |   | . | -_| . | . | | | |   |
|_____|  _|___|_|_|_  |___|___|___|_____|_|_|
      |_|         |___|                      

                                                   +-----+------+
                                             .---> |-----|------|
                                            /      |-----|------|
                                           /       +-----+------+
                                          /                     
                                         /                  .--.
                                        /                   v  |
  .-------.                            /           .-. .-. .-. |
  | Table |-.                         /        .-->'-' '-' '-' |
  '-------'  \                       / .-----> |     \  |  /   |
              \                     / /        |      v . v    |
.------------. \                   / /         |_______/ \_____|
| Flowcharts |--.                 / /                  \ /
'------------'   \               / /                    |     ____
                  v _______     / /                     '--> /___/
.--------.         /       \---' /                          
| Graphs |------->/ Sponge  \---'-.
'--------'     .->\  down   /----. \           ^  .  /\  .-.
              / .->\_______/-.    \ \          |_/ \/  \/   \
.--------.   / /              \    \ `-------> +------------->
| Comics |--' /                \    \
'--------'   /                  \    \         +------------+
            /                    \    \        |   .-----.  |
   .----------.                   \    \       |  (       ) +------------+
   | Diagrams |                    \    \      |   `-, .-'  |  .-----.   |
   '----------'                     \    `---> |    /,'     | (       )  |
                                     \         |   /'       |  `-. .-'   |
                                      \        |   .-.      |     `.\    |
                                       \       | ٩(●̮̮̃ ̾•̃̾)۶    |       `\   |
                                        \      |   `-'      |      .-.   |
                                         \     +------------|     (⊙–⊙)७ |
                                          \                 |      `-'   |
                                           `--.             +------------+
                                               \                   .-.
                                                v              .-,(   ),-.    
                                                ___  _      .-(           ).-.                                       
                                               [___]|=| -->(                  )      __________ 
                                               /::/ |_|     '-(           ).-' ---->[_...__...°]
                                                               '-.(   ).-'                         
                                                                   `-'    \      ____   __ 
                                                                           '--->|    | |==|
                                                                                |____| |  | 
                                                                                /::::/ |__|

```

Support for table works as is.


## Tables

Tables are supported as commonly markdown implementation does.


  中文处理  | Data  |   CJK
-----------|-------|------------
**Table**  | `are` | supported
 as        | well  |


## CSV

CSV data are rendered as tables

<pre>
<code>
    ```csv
    foo,bar,baz
    apple,banana,carrots
    rust,haskel,c
    ```
</code>
</pre>

```csv
foo,bar,baz
apple,banana,carrots
rust,haskel,c
```

Codes syntax highlighted.

```sql

select * from data limit 1

```

```rust
fn main(){
	println!("hello world!");
}
```

## Math equations
\\[ E = m * c ^ 2 \\]

\\[ \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } } \\]

\\[ \left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right) \\]


## Svgbob

Svgbob is a diagramming model
which uses a set of typing characters
to approximate the intended shape.

```bob


       .---.
      /-o-/--
   .-/ / /->
  ( *  \/
   '-.  \
      \ /
       ' 
```

It uses a combination of these characters "`[(/<^.|+v*>\)]'",
which are readily available on your keyboards.

What can you do with svgbob?

### Basic shapes

```bob
                                                        .
       +------+   .------.    .------.      /\        .' `.
       |      |   |      |   (        )    /  \     .'     `.
       +------+   '------'    '------'    '----'     `.   .'
         _______            ________                   `.'   ^ /
        /       \      /\   \       \      ---->    | ^     / /
       /         \    /  \   )       )     <----    | |    / v
       \         /    \  /  /_______/               v |
        \_______/      \/

        .-----------.       .   <.      .>  .          ^  \
       (             )     (      )    (     )          \  \
        '-----+ ,---'       `>   '      `  <'            \  v
              |/
              '           _
             _   .-.    .' '.
            (_) (   )  (     ) 
                 `-'    `._.'



```          

### Quick logo scribbles

```bob
        .---.                      _
       /-o-/--       .--.         |-|               .--.
    .-/ / /->       /--. \     .--)-|    .--.-.    //.-.\
   ( *  \/         / O  )|     |  |-|    |->| |   (+(-*-))
    '-.  \        /\ |-/ /     .  * |    '--'-'    \\'-'/
       \ /        \ '+' /       \__/                '--'
        '          '---'            
```

###  Unicode box drawing

```bob
            ┌─┬┐  ╔═╦╗  ╓─╥╖  ╒═╤╕
            ├─┼┤  ╠═╬╣  ╟─╫╢  ╞═╪╡
            └─┴┘  ╚═╩╝  ╙─╨╜  ╘═╧╛
```

###  Sequence Diagrams                                     
                               
```bob
                                   .--->  F
          A       B      C  D     /     
          *-------*-----*---*----*----->  E
                   \            ^ \
                    v          /   '--->  G
                     B --> C -'
```

### Crude Statistical charts

```bob
                                                                          
    E +-------------------------*--+     E |                         o    
    D |-------------------*--*--|--*     D |                   o  o  |  o 
    C |-------------*--*  |  |  |  |     C |             o  o  |  |  |  | 
    B |-------*--*  |  |  |  |  |  |     B |       o  o  |  |  |  |  |  | 
    A +-*--*--+--+--+--+--+--+--+--+     A +-o--o--+--+--+--+--+--+--+--+ 
        5 10 15 20 25 30 35 40 45 50         5 10 15 20 25 30 35 40 45 50 

```


### Flow charts

 ```bob
                                      .---.  .---. .---.  .---.    .---.  .---. 
                      .--.   OS API   '---'  '---' '---'  '---'    '---'  '---' 
                      v  |              |      |     |      |        |      |   
             .-. .-. .-. |              v      v     |      v        |      v   
         .-->'-' '-' '-' |            .------------. | .-----------. |  .-----. 
         |     \  |  /   |            | Filesystem | | | Scheduler | |  | MMU | 
         |      v . v    |            '------------' | '-----------' |  '-----' 
         |_______/ \_____|                   |       |      |        |          
                 \ /                         v       |      |        v          
                  |     ____              .----.     |      |    .---------.    
                  '--> /___/              | IO |<----'      |    | Network |    
                                          '----'            |    '---------'    
                                             |              |         |         
                                             v              v         v         
                                      .---------------------------------------. 
                                      |                  HAL                  | 
                                      '---------------------------------------' 
   
```

### Block diagrams

```bob
                              .-.
                          .-,(   ),-.    
           ___  _      .-(           )-.                                       
          [___]|=| -->(                 )      __________ 
          /::/ |_|     '-(          ).-' ---->[_...__...°]
                          '-.(   ).-'                         
                              `-' \      ____   __ 
                                   '--->|    | |==|
                                        |____| |  | 
                                        /::::/ |__|

```
### Mindmaps

```bob
                                            .-->  Alpha
                                           /
                                          .---->  Initial Release
          Planning *-------.             /         \      
                            \           /           '---> Patch 1
      Initial research       \         /             \
                *             \       /               '-->  Patch 2
                 \             \     .---------> Beta
                  \             \   /                              
                   \             o o                      _______  
                    \          .---. o--.___             /       \
                     '------> (     )       '----*--->  . Release .
                               `---' o                   \_______/
                               o  o o \
                              /    \ \ \  
                          .--'      \ \ \
                         /           \ \ '----+->  Push backs
                        .             \ \      \
                       /|              \ \      '----> Setbacks
                      / .               \ \
                     V /|                \ '-----> Reception
                Team  / .                 \
                     v /|                  \
             Worklaod / .                   '-->> Career change
                     V / 
                 PTO  /  
                     V
                 Bug 

```

### Circuit diagrams 

```bob

     +10-15V           ___0,047R       
      *------o------o-|___|-o--o---------o----o-------.
             |      |       |  |         |    |       |
            ---     |       | .+.        |    |       |
      470uF ###     |       | | | 2k2    |    |       |
             | +    |       | | |        |    |      .+.
      *------o      '--.    | '+'       .+.   |      '-'
             |         |6   |7 |8    1k | |   |       |
            GND      .-+----+--+--.     | |   |       |
                     |            |     '+'   |       |
                     |            |1     |  |/  BC    |
                     |            +------o--+   547   |
                     |            |      |  |`>       |
                     |            |     ,+.   |       |
                     |            | 220R| |   o----||-+  IRF9Z34
                     |            |     | |   |    |+->
                     |  MC34063   |     `+'   |    ||-+
                     |            |      |    |       |  BYV29     -12V6
                     |            |      '----'       o--|<-o----o--X OUT
                     |            |2                  |     |    |
                     |            |--o                C|    |    |
                     |            | GND         30uH  C|    |   --- 470
                     |            |3      1nF         C|    |   ###  uF
                     |            |-------||--.       |     |    | +
                     '-----+----+-'           |      GND    |   GND
                          5|   4|             |             |
                           |    '-------------o-------------o
                           |                           ___  |
                           '------/\/\/------------o--|___|-'
                                                   |       1k0
                                                  .+.
                                                  | | 5k6 + 3k3
                                                  | | in Serie
                                                  '+'
                                                   |
                                                  GND

```


## Links:

- [Spongedown code](https://github.com/ivanceras/spongedown)
- [Svgbob code](https://github.com/ivanceras/svgbobrus)
- [Svgbob spec](https://ivanceras.github.io/spongedown-editor/?file=https://raw.githubusercontent.com/ivanceras/svgbobrus/master/spec.md)
- [Patreon](https://www.patreon.com/ivanceras)


