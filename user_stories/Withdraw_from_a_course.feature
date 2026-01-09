Feature: Withdraw from a course

Background:
  Given that I am a user
  And I am logged in
  
Scenario: Successful withdraw from a course
  Given that I am in my profile
  And I am enrolled in a course
  When I click the "Withdraw" button
  Then I should be asked for confirmation
  When I click the button "Confirm"
  Then I should be informed that he has been withdrawn from the course
  And I should be redirected to my profile
  
Scenario: Unsuccessfull withdraw from a course
  Given that I am in my profile
  And I am enrolled in a course
  When I click the "Withdraw" button
  Then I should be asked for confirmation
  When I click  the button "Cancel"
  Then I should be informed that he has not been withdrawn from the course
  And I should be redirected to my profile
  