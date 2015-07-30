// Custom Post Field

Posts.addField({
  fieldName: 'customPostField',
  fieldSchema: {
    type: String,
    label: "Impact Tagline",
    optional: true,
    editableBy: ["member", "admin"]
  }
});

// Posts.addField({
//   fieldName: 'companyName',
//   fieldSchema: {
//     type: String,
//     label: "Company Name",
//     optional: true,
//     editableBy: ["member", "admin"]
//   }
// });
// Custom Comment Field

// Comments.addField({
//   fieldName: 'customCommentField',
//   fieldSchema: {
//     type: String,
//     optional: true,
//     editableBy: ["member", "admin"]
//   }
// });

// Custom User Field

Users.addField({
  fieldName: 'customUserField',
  fieldSchema: {
    type: String,
    label: "Role",
    optional: true,
    editableBy: ["member", "admin"]
  }
});

// Custom Setting Field

// Settings.addField({
//   fieldName: "customSettingsField",
//   fieldSchema: {
//     type: String,
//     optional: true,
//     autoform: {
//       group: "customGroup"
//     }
//   }
// });