
    fn next_to_drawing_element(&self, loc: &Loc) -> bool{
    
    }

    fn next_to_drawing_element(&self, loc: &Loc)->bool{
        [self.is_char(&loc.top(), is_drawing_element(ch)), 
         self.is_char(&loc.bottom(), is_drawing_element(ch)),
         self.is_char(&loc.left(), is_drawing_element(ch)),
         self.is_char(&loc.right(), is_drawing_element(ch)),
         self.is_char(&loc.top_left(), is_drawing_element(ch)),
         self.is_char(&loc.top_right(), is_drawing_element(ch)),
         self.is_char(&loc.bottom_left(), is_drawing_element(ch)),
         self.is_char(&loc.bottom_right(), is_drawing_element(ch)),
        ].iter()
            .find(|&x| *x )
    }


    fn next_to_drawing_element(&self, loc: &Loc)->bool{
        [self.is_char(&loc.top(), is_drawing_element), 
         self.is_char(&loc.bottom(), is_drawing_element),
         self.is_char(&loc.left(), is_drawing_element),
         self.is_char(&loc.right(), is_drawing_element),
         self.is_char(&loc.top_left(), is_drawing_element),
         self.is_char(&loc.top_right(), is_drawing_element),
         self.is_char(&loc.bottom_left(), is_drawing_element),
         self.is_char(&loc.bottom_right(), is_drawing_element),
        ].iter()
            .find(|&x| *x )
                .map_or(false, |_| true)
    }

    /// get the 8 neighbors
    pub fn neighbors(&self) -> Vec<Loc> {
        vec![self.top(), 
             self.bottom(),
             self.left(),
             self.right(),
             self.top_left(),
             self.top_right(),
             self.bottom_left(),
             self.bottom_right(),
            ]
    }
