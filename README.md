# Lecture Schedule Setter

It's just a project we have finished in 3 days for our homework.

Input files:

  *busy.csv: 
  
    It's for which lecturer is busy at which day and which time(Morning and Evening only).
    It has to be in the same format as the example and the line has to be in one coloumn.
    Different inputs will be in different rows.
    Ex.
      PROF.DR.Mr.Test;Monday;Morning
      DR.Mrs.TestTest;Friday;Evening
      
  *classroom.csv: 
  
    It's for which classes we have and what are their sizes.
    It has to be in the same format as the example and the line has to be in one coloumn.
    Different inputs will be in different rows.
    Ex.
      B403;100
      C501;60
      
  *courses.csv:
  
    It's for all the lectures we have to put to schedule.
    codeOfTheLecture;nameOfTheLecture;whichYear;howManyCredit;compulsoryOrElective;isDepartmantOrServiceLecture;totalStudentThatTakes;nameOfTheLecturer
    It has to be in the same format as the example and the line has to be in one coloumn.
    Different inputs will be in different rows.
    Ex.
      CENG201;Computer Programming II;2;5;C;D;95;PROF.DR.Mr.Test
      ENGR302;Discrete Mathmatic;3;4;C;D;121;DR.Mrs.TestTest

*service.csv:

    It's for the service lectures which has to be at the specified day and time.
    It has to be in the same format as the example and the line has to be in one coloumn.
    Different inputs will be in different rows.
    Ex.
       CENG206;Tuesday;Morning
       CENG417;Friday;Evening
