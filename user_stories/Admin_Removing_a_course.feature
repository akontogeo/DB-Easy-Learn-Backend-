Feature: Removing a course

Background:
  Given that I am an admin
  And I am logged in
  
Scenario: Successfully removing a course
  Given that I am in my profile
  When I click the "Remove" button
  Then I should be asked for confirmation
  When I click "Confirm"
  Then I should be informed that the course has been removed successfully
  And I should be redirected to my profile
  
Scenario: Unsuccessfully removing a course
  Given that I am in my profile
  When I click the "Remove" button
  Then I should be asked for confirmation
  When I click "Cancel"
  Then I should be informed that the course has not been removed 
  And I should be redirected to my profile
  