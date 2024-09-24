# Todo List Webpage

This project was bootstrapped with Create React App and implements all the provided requirements. The final product fetches and displays all todos from the provided API in a list, showing the title and checkbox for the "completed" value. Additionally, it sends a `PATCH` request to update the todos on the server when their status is changed.

## Bonus Features:

* Added a sound effect when the user checks, unchecks, or checks all todos.
* A button that toggles between viewing todos for individual users or viewing all todos.
* Utilized `aria-label` to provide clear text for screen readers, improving accessibility.

## Note

The users toggle simulates different users viewing their own todo lists. Updates made for one user won't be saved when cycling between users, as the data is reset when toggling.
