# Project Reflection

## What parts did you consider easy??

- Creating models in the schema, loading data into the prisma
- Setting up authentication on the server
- Configuring the navigation panel
- Filtering books by popularity, by name

## What parts did you consider hard??

- It took a long time to understand how to correctly create `BookProgress` in the database so that it would also be updated. For some reason, newly added `BookProgress` entries were not saved. I eventually concluded that a separate Form component needed to be created to properly process and save the data.
- It was also not immediately clear why form validation on the server was failing, but after refactoring the code, I realized that some data I expected to see simply wasn't coming through. Consequently, the validation was incorrectly set up because I was expecting to receive data that wasn't actually needed. (Probably)
- Hiding the "start reading" button after it is clicked. It wasn't clear where to get the `userID` from, but ChatGPT pointed me in the right direction and suggested a function for parsing. (This was not part of the original task, it was my personal challenge. I was just curious about how to do it.)

## Is there anything you could have done better??

- Organizing the Git repository
- Creating more detailed commits

## Are you aware of any problems with your code?

- Lack of CSS
