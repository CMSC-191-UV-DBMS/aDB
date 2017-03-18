'use strict';

const max = {
    string: 50
  },

  semEnum = [
    '1st',
    '2nd',
    'Sum'
  ],

  fields = {
    No: {
      // name: 'No',
      type: 'string',
      format: '',
    },
    CTitle: {
      // name: 'CTitle',
      type: 'string',
      format: '',
    },
    CDesc: {
      // name: 'CDesc',
      type: 'string',
      format: '',
    },
    NoOfUnits: {
      // name: 'NoOfUnits',
      type: 'int',
      format: '',
    },
    HasLab: {
      // name: 'HasLab',
      type: 'int',
      format: '',
    },
    SemOffered: {
      // name: 'SemOffered',
      type: 'enum.sem',
      format: '',
      possibleValues: semEnum,
    },
    Semester: {
      // name: 'Semester',
      type: 'enum.sem',
      format: '',
      possibleValues: semEnum,
    },
    AcadYear: {
      // name: 'AcadYear',
      type: 'string',
      format: '',
    },
    CNo: {
      // name: 'CNo',
      type: 'string',
      format: '',
    },
    Section: {
      // name: 'Section',
      type: 'string',
      format: '',
    },
    Time: {
      // name: 'Time',
      type: 'string',
      format: '([01][0-9]|2[0-3]):([0-5][0-9])',
    },
    MaxStud: {
      // name: 'MaxStud',
      type: 'int',
      format: '',
    },
    StudNo: {
      // name: 'StudNo',
      type: 'string',
      format: '(19[0-9]{2}|20[01][0-7])-[0-9]{5}',
    },
    StudentName: {
      // name: 'StudentName',
      type: 'string',
      format: '',
    },
    Birthday: {
      // name: 'Birthday',
      type: 'string',
      format: '(1[0-9]{3}|20[01][0-7])-(0[1-9]|1[0-2])-([012][0-9]|3[0-1])',
    },
    Degree: {
      // name: 'Degree',
      type: 'string',
      format: '',
    },
    Major: {
      // name: 'Major',
      type: 'string',
      format: '',
    },
    UnitsEarned: {
      // name: 'UnitsEarned',
      type: 'int',
      format: '',
    },
    Description: {
      // name: 'Description',
      type: 'string',
      format: '',
    },
    Action: {
      // name: 'Action',
      type: 'string',
      format: '',
    },
    DateFiled: {
      // name: 'DateFiled',
      type: 'string',
      format: '',
    },
    DateResolved: {
      // name: 'DateResolved',
      type: 'string',
      format: '',
    }
  },

  course = {
    path: 'tables/COURSE.csv',
    columns: [
      fields['No'],
      fields['CTitle'],
      fields['CDesc'],
      fields['NoOfUnits'],
      fields['HasLab'],
      fields['SemOffered']
    ],
    required: [
      {
        CNo: fields['CNo']
      },
    ]
  },

  courseoffering = {
    path: 'tables/COURSEOFFERING.csv',
    columns: [
      fields['Semester'],
      fields['AcadYear'],
      fields['CNo'],
      fields['Section'],
      fields['Time'],
      fields['MaxStud']
    ],
    required: [
      {
        Semester: fields['Semester'],
        AcadYear: fields['AcadYear'],
        CNo: fields['CNo'],
        Section: fields['Section']
      },
    ]
  },

  studcourse = {
    path: 'tables/STUDCOURSE.csv',
    columns: [
      fields['StudNo'],
      fields['CNo'],
      fields['Semester'],
      fields['AcadYear']
    ]
  },

  student = {
    path: 'tables/STUDENT.csv',
    columns: [
      fields['StudNo'],
      fields['StudentName'],
      fields['Birthday'],
      fields['Degree'],
      fields['Major'],
      fields['UnitsEarned']
    ],
    required: [
      {
        StudNo: fields['StudNo']
      },
    ]
  },

  studenthistory = {
    path: 'tables/STUDENTHISTORY.csv',
    columns: [
      fields['StudNo'],
      fields['Description'],
      fields['Action'],
      fields['DateFiled'],
      fields['DateResolved']
    ],
    required: [
      {
        StudNo: fields['StudNo']
      },
    ]
  };
