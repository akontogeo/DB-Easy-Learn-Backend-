Feature: Rating a course

Background:
  Given that I am a user
  And I am logged in
  
Scenario: Successfully rating a course
  Given that I am enrolled in a course
  And I am in the courses's page
  When I click the "Rate" button
  And I choose a number of stars according to my experience of the course
  And I click the "Submit" button
  Then I should be informed that the rating has been submitted
  And I should be redirected to the course's page
  
  
Scenario: Unsuccessfully rating a course
  Given that I am enrolled in a course
  And I am in the courses's page
  When I click the "Rate" button
  But I don't choose any number of stars
  And I click the "Submit" button
  Then I should be informed that I must select a number of stars
  And I should remain in the same page
  
 