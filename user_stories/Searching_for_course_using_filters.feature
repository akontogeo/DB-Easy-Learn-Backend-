Feature: Search for course using filters
  
Background:
  Given that I am user
  And I am logged in 
  
Scenario: Successful search with filters
  Given that I am in "Home Page"
  Then I should be able to select the filters that I want
  And I should be able to click the "Apply" button
  And I should be able to see the relevant courses
  And I should be able to click on the course that I want
  And I should be able to see the course's details
  
Scenario: Unsuccessful search with filters due to no existing courses
  Given that I am in "Home Page"
  Then I should be able to select the filters that I want
  And I should be able to click the "Apply" button
  But there are no relevant courses 
  Then I should be informed that there are no results
  And I should be able to change my options in filters