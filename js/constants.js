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
      name: 'No',
      type: 'string',
      enumType: '',
      format: '',
    },
    CTitle: {
      name: 'CTitle',
      type: 'string',
      enumType: '',
      format: '',
    },
    CDesc: {
      name: 'CDesc',
      type: 'string',
      enumType: '',
      format: '',
    },
    NoOfUnits: {
      name: 'NoOfUnits',
      type: 'int',
      enumType: '',
      format: '',
    },
    HasLab: {
      name: 'HasLab',
      type: 'int',
      enumType: '',
      format: '',
    },
    SemOffered: {
      name: 'SemOffered',
      type: 'enum',
      enumType: 'sem',
      format: '',
      possibleValues: semEnum,
    },
    Semester: {
      name: 'Semester',
      type: 'enum',
      enumType: 'sem',
      format: '',
      possibleValues: semEnum,
    },
    AcadYear: {
      name: 'AcadYear',
      type: 'string',
      enumType: '',
      format: '',
    },
    CNo: {
      name: 'CNo',
      type: 'string',
      enumType: '',
      format: '',
    },
    Section: {
      name: 'Section',
      type: 'string',
      enumType: '',
      format: '',
    },
    Time: {
      name: 'Time',
      type: 'string',
      enumType: '',
      format: '([01][0-9]|2[0-3]):([0-5][0-9])',
    },
    MaxStud: {
      name: 'MaxStud',
      type: 'int',
      enumType: '',
      format: '',
    },
    StudNo: {
      name: 'StudNo',
      type: 'string',
      enumType: '',
      // format: '(19[0-9]{2}|20[01][0-7])-[0-9]{5}',
      format: '([12][0-9]{3})-[0-9]{5}',
    },
    StudentName: {
      name: 'StudentName',
      type: 'string',
      enumType: '',
      format: '',
    },
    Birthday: {
      name: 'Birthday',
      type: 'string',
      enumType: '',
      // format: '(1[0-9]{3}|20[01][0-7])-(0[1-9]|1[0-2])-([012][0-9]|3[0-1])',
      format: '([12][0-9]{3})-(0[1-9]|1[0-2])-([012][0-9]|3[0-1])',
    },
    Degree: {
      name: 'Degree',
      type: 'string',
      enumType: '',
      format: '',
    },
    Major: {
      name: 'Major',
      type: 'string',
      enumType: '',
      format: '',
    },
    UnitsEarned: {
      name: 'UnitsEarned',
      type: 'int',
      enumType: '',
      format: '',
    },
    Description: {
      name: 'Description',
      type: 'string',
      enumType: '',
      format: '',
    },
    Action: {
      name: 'Action',
      type: 'string',
      enumType: '',
      format: '',
    },
    DateFiled: {
      name: 'DateFiled',
      type: 'string',
      enumType: '',
      // format: '',
      format: '([12][0-9]{3})-(0[1-9]|1[0-2])-([012][0-9]|3[0-1])',
    },
    DateResolved: {
      name: 'DateResolved',
      type: 'string',
      enumType: '',
      // format: '',
      format: '([12][0-9]{3})-(0[1-9]|1[0-2])-([012][0-9]|3[0-1])',
    }
  },

  course = {
    name: 'course',
    path: 'tables/COURSE.csv',
    fields: [
      fields['CNo'],
      fields['CTitle'],
      fields['CDesc'],
      fields['NoOfUnits'],
      fields['HasLab'],
      fields['SemOffered']
    ],
    required: [
      fields['CNo'].name
    ]
  },

  courseoffering = {
    name: 'courseoffering',
    path: 'tables/COURSEOFFERING.csv',
    fields: [
      fields['Semester'],
      fields['AcadYear'],
      fields['CNo'],
      fields['Section'],
      fields['Time'],
      fields['MaxStud']
    ],
    required: [
      fields['Semester'].name,
      fields['AcadYear'].name,
      fields['CNo'].name,
      fields['Section'].name
    ]
  },

  studcourse = {
    name: 'studcourse',
    path: 'tables/STUDCOURSE.csv',
    fields: [
      fields['StudNo'],
      fields['CNo'],
      fields['Semester'],
      fields['AcadYear']
    ],
    required: []
  },

  student = {
    name: 'student',
    path: 'tables/STUDENT.csv',
    fields: [
      fields['StudNo'],
      fields['StudentName'],
      fields['Birthday'],
      fields['Degree'],
      fields['Major'],
      fields['UnitsEarned']
    ],
    required: [
      fields['StudNo'].name
    ]
  },

  studenthistory = {
    name: 'studenthistory',
    path: 'tables/STUDENTHISTORY.csv',
    fields: [
      fields['StudNo'],
      fields['Description'],
      fields['Action'],
      fields['DateFiled'],
      fields['DateResolved']
    ],
    required: [
      fields['StudNo'].name
    ]
  };
