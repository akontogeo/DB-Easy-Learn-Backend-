Feature: Searching for course
  
Background:
  Given that I am a user
  And I am logged in
  
Scenario: Successful Search
  Given that I am in the "Home page"
  When I click on the search bar 
  And I type a existing course name or category
  Then I should see all the relevant courses
  And I should be able to click on the course that I want
  And I should be able to see the course's details
  
Scenario: Unsuccessful Search due to no existing course/category
  Given that I am in the "Home page"
  When I click on the search bar 
  But I type a non existing course name or category
  Then I should be informed that there are no results
  And I should be able to type something else in the search bar