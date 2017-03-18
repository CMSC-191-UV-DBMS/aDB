'use strict';

const course =  {
    name: 'COURSE',
    path: 'tables/COURSE.csv',
    fields: [
      // {
      //   label: 'No',
      //   value: 'No',
      //   default: 'NULL'
      // },
      // {
      //   label: 'CTitle',
      //   value: 'CTitle',
      //   default: 'NULL'
      // },
      // {
      //   label: 'CDesc',
      //   value: 'CDesc',
      //   default: 'NULL'
      // },
      // {
      //   label: 'NoOfUnits',
      //   value: 'NoOfUnits',
      //   default: 'NULL'
      // },
      // {
      //   label: 'HasLab',
      //   value: 'HasLab',
      //   default: 'NULL'
      // },
      // {
      //   label: 'SemOffered',
      //   value: 'SemOffered',
      //   default: 'NULL'
      // }
      'No', 'CTitle', 'CDesc', 'NoOfUnits', 'HasLab', 'SemOffered'
    ]
  },
  courseoffering = {
    name: 'COURSEOFFERING',
    path: 'tables/COURSEOFFERING.csv',
    fields: [
      // {
      //   label: 'Semester',
      //   value: 'Semester',
      //   default: 'NULL'
      // },
      // {
      //   label: 'AcadYear',
      //   value: 'AcadYear',
      //   default: 'NULL'
      // },
      // {
      //   label: 'CNo',
      //   value: 'CNo',
      //   default: 'NULL'
      // },
      // {
      //   label: 'Section',
      //   value: 'Section',
      //   default: 'NULL'
      // },
      // {
      //   label: 'Time',
      //   value: 'Time',
      //   default: 'NULL'
      // },
      // {
      //   label: 'MaxStud',
      //   value: 'MaxStud',
      //   default: 'NULL'
      // }
      'Semester', 'AcadYear', 'CNo', 'Section', 'Time', 'MaxStud'
    ]
  },
  studcourse = {
    name: 'STUDCOURSE',
    path: 'tables/STUDCOURSE.csv',
    fields: [
      // {
      //   label: 'StudNo',
      //   value: 'StudNo',
      //   default: 'NULL'
      // },
      // {
      //   label: 'CNo',
      //   value: 'CNo',
      //   default: 'NULL'
      // },
      // {
      //   label: 'Semester',
      //   value: 'Semester',
      //   default: 'NULL'
      // },
      // {
      //   label: 'AcadYear',
      //   value: 'AcadYear',
      //   default: 'NULL'
      // }
      'StudNo', 'CNo', 'Semester', 'AcadYear'
    ]
  },
  student = {
    name: 'STUDENT',
    path: 'tables/STUDENT.csv',
    fields: [
      // {
      //   label: 'StudNo',
      //   value: 'StudNo',
      //   default: 'NULL'
      // },
      // {
      //   label: 'StudentName',
      //   value: 'StudentName',
      //   default: 'NULL'
      // },
      // {
      //   label: 'Birthday',
      //   value: 'Birthday',
      //   default: 'NULL'
      // },
      // {
      //   label: 'Degree',
      //   value: 'Degree',
      //   default: 'NULL'
      // },
      // {
      //   label: 'Major',
      //   value: 'Major',
      //   default: 'NULL'
      // },
      // {
      //   label: 'UnitsEarned',
      //   value: 'UnitsEarned',
      //   default: 'NULL'
      // }
      'StudNo', 'StudentName', 'Birthday', 'Degree', 'Major', 'UnitsEarned'
    ]
  },
  studenthistory = {
    name: 'STUDENTHISTORY',
    path: 'tables/STUDENTHISTORY.csv',
    fields: [
      // {
      //   label: 'StudNo',
      //   value: 'StudNo',
      //   default: 'NULL'
      // },
      // {
      //   label: 'Description',
      //   value: 'Description',
      //   default: 'NULL'
      // },
      // {
      //   label: 'Action',
      //   value: 'Action',
      //   default: 'NULL'
      // },
      // {
      //   label: 'DateFiled',
      //   value: 'DateFiled',
      //   default: 'NULL'
      // },
      // {
      //   label: 'DateResolved',
      //   value: 'DateResolved',
      //   default: 'NULL'
      // }
      'StudNo', 'Description', 'Action', 'DateFiled', 'DateResolved'
    ]
  };

module.exports = {
  course,
  courseoffering,
  studcourse,
  student,
  studenthistory
}
