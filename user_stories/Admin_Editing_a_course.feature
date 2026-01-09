Feature: Editing a course

Background:
  Given that I am an admin
  And I am logged in
  
Scenario: Successfully editing a course
  Given that I am in my profile
  When I click on the "Edit" button
  Then I should be asked to change the course details
  And I should be able to click the button "OK"
  And I should be informed that the course has been edited Successfully
  And I should be redirected to my profile and view the edited course 
  
Scenario: Unsuccessfully editing a course due to empty fields
  Given that I am in my profile
  When I click on the "Edit" button
  Then I should be asked to change the course details
  And I should be able to click the button "OK"
  But there are one or more empty fields 
  Then i should be informed that there are empty fields
  And the empty fields should turn red
  And I should remain on the same page
  And I should be able to make corrections and attempt to add the neccessary informations of the course
  