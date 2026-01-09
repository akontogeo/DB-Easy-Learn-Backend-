Feature: Enrolling in a course
  
Background:
  Given that I am user
  And I am logged in 
  
Scenario: Successful enrollment in a course
  Given that I am in "Home Page"
  And I have clicked on a course
  When I click the button "Enroll"
  Then I should be informed that I have successfuly enrolled
  And I should be redirected to the course's page
  
Scenario: Unsuccessful enrollment to a premium course
  Given that I am in "Home Page"
  And I have clicked on a course
  When I click the button "Enroll"
  But the course is accesible only to premium users
  Then I should be informed that I can not enroll
  And I should be remain in the page with the details of the course