const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, Header, Footer, PageNumber, Table, TableRow, TableCell, WidthType } = require("docx");
const { ch1, centerPara, emptyLine, para, heading, pageBreak } = require("./gen_report_part1");
const { ch2, ch3, ch4 } = require("./gen_report_part2");
const { ch5, ch6, ch7 } = require("./gen_report_part3");

// TITLE PAGE
const titlePage = [
  emptyLine(), emptyLine(), emptyLine(),
  centerPara("SRINIVAS UNIVERSITY", 32, true),
  centerPara("Faculty of Science and Technology", 28, false),
  centerPara("Department of Computer Applications", 26, false),
  emptyLine(), emptyLine(),
  centerPara("A PROJECT REPORT ON", 28, true),
  emptyLine(),
  centerPara("FeedByMe", 40, true),
  centerPara("Multi-Project Feedback Management System", 28, false),
  emptyLine(), emptyLine(),
  centerPara("Submitted in Partial Fulfillment of the Requirements", 24, false),
  centerPara("for the Award of the Degree of", 24, false),
  centerPara("BACHELOR OF COMPUTER APPLICATIONS (BCA)", 26, true),
  emptyLine(), emptyLine(),
  centerPara("Submitted by:", 24, false),
  centerPara("ABUBAKKAR SIDDIQ SALWAN", 28, true),
  emptyLine(),
  centerPara("Under the Guidance of:", 24, false),
  centerPara("[Guide Name]", 28, true),
  emptyLine(), emptyLine(),
  centerPara("April 2026", 24, false),
  new Paragraph({ children: [new PageBreak()] }),
];

// CERTIFICATE
const cert = [
  emptyLine(), centerPara("CERTIFICATE", 32, true), emptyLine(),
  para("This is to certify that the project report entitled \"FeedByMe: Multi-Project Feedback Management System\" is a bonafide work carried out by ABUBAKKAR SIDDIQ SALWAN in partial fulfillment of the requirements for the award of the degree of Bachelor of Computer Applications (BCA) from Srinivas University during the academic year 2025-2026."),
  para("This project report has been approved and is accepted as meeting the standard of quality and form."),
  emptyLine(), emptyLine(), emptyLine(),
  para("External Examiner                                              Internal Guide"),
  emptyLine(), emptyLine(),
  para("Head of the Department"),
  para("Date: _______________"),
  para("Place: Mangalore"),
  new Paragraph({ children: [new PageBreak()] }),
];

// DECLARATION
const decl = [
  emptyLine(), centerPara("DECLARATION", 32, true), emptyLine(),
  para("I, ABUBAKKAR SIDDIQ SALWAN, hereby declare that the project report entitled \"FeedByMe: Multi-Project Feedback Management System\" has been prepared by me under the guidance of [Guide Name], Department of Computer Applications, Srinivas University."),
  para("I also declare that this project is the result of my own effort and has not been submitted previously for the award of any degree or diploma to any other university or institution."),
  emptyLine(), emptyLine(), emptyLine(),
  para("Date: _______________"),
  para("Place: Mangalore"),
  emptyLine(),
  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "ABUBAKKAR SIDDIQ SALWAN", size: 24, font: "Times New Roman", bold: true })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ACKNOWLEDGEMENT
const ack = [
  emptyLine(), centerPara("ACKNOWLEDGEMENT", 32, true), emptyLine(),
  para("I would like to express my sincere gratitude to my project guide [Guide Name] for their constant support, guidance, and encouragement throughout the development of this project. Their valuable suggestions helped me shape the project from an idea into a working application."),
  para("I am thankful to the Head of the Department of Computer Applications at Srinivas University for providing the necessary facilities and resources for the successful completion of this project."),
  para("I also want to thank my classmates and friends who tested the application, gave me honest feedback, and pointed out bugs that I had missed. Their input was incredibly valuable."),
  para("Finally, I am grateful to my family for their continuous support and encouragement during the entire duration of this project."),
  emptyLine(),
  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "ABUBAKKAR SIDDIQ SALWAN", size: 24, font: "Times New Roman", bold: true })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ABSTRACT
const abs = [
  emptyLine(), centerPara("ABSTRACT", 32, true), emptyLine(),
  para("FeedByMe is a web-based feedback management system that allows users to create dedicated feedback boards for their projects and share them with anyone via a unique link. The system is built using the MERN stack — MongoDB for the database, Express.js for the server framework, React.js for the user interface, and Node.js for the runtime environment."),
  para("The application supports multi-project management, where a single user can create and manage multiple feedback boards from one dashboard. Each board can be customized with a theme color, logo, and custom questions. Users who want to submit feedback do not need to create an account — they can submit as guests with just their email address. The system supports star ratings, text feedback, image attachments, comments, and upvoting."),
  para("Authentication is handled through JSON Web Tokens with bcrypt password hashing. The admin panel provides analytics including feedback distribution by status, category breakdown, and user statistics. The application is fully responsive and works on desktop, tablet, and mobile devices. It has been deployed on Vercel as a serverless application with MongoDB Atlas as the cloud database."),
  new Paragraph({ children: [new PageBreak()] }),
];

// TABLE OF CONTENTS - matching the screenshot exactly
function tocLine(num, text, page) {
  const dots = ".".repeat(Math.max(3, 70 - num.length - text.length));
  return para(`${num}    ${text} ${dots} ${page}`);
}
const toc = [
  emptyLine(), centerPara("Table of Contents", 32, true), emptyLine(),
  tocLine("", "Sl.No    Topic", "Page No"),
  tocLine("1", "CHAPTER 1: INTRODUCTION", "6"),
  tocLine("1.1", "Background", "6"),
  tocLine("1.2", "Objectives", "8"),
  tocLine("1.3", "Purpose", "9"),
  tocLine("1.4", "Scope", "9"),
  tocLine("1.5", "Data Sources", "10"),
  tocLine("1.6", "Problem Definition", "11"),
  emptyLine(),
  tocLine("2", "CHAPTER 2: TOOLS AND TECHNOLOGY USED", "13"),
  tocLine("2.1", "Programming Language", "13"),
  tocLine("2.2", "Web Framework", "14"),
  tocLine("2.3", "Cloud Technologies", "16"),
  tocLine("2.3.1", "MongoDB Atlas", "16"),
  tocLine("2.4", "Development Tools and Libraries", "17"),
  tocLine("2.5", "Summary", "19"),
  emptyLine(),
  tocLine("3", "CHAPTER 3: DATA COLLECTION AND ANALYSIS", "20"),
  tocLine("3.1", "Data Collection Mechanisms", "20"),
  tocLine("3.2", "Data Preprocessing and Validation", "21"),
  tocLine("3.3", "Feature Engineering and Aggregation", "23"),
  tocLine("3.4", "Exploratory Data Analysis", "24"),
  tocLine("3.5", "Data Flow in the System", "25"),
  tocLine("3.6", "Summary", "27"),
  emptyLine(),
  tocLine("4", "CHAPTER 4: SYSTEM REQUIREMENTS AND ANALYSIS", "28"),
  tocLine("4.1", "System Requirements Specification", "28"),
  tocLine("4.1.1", "Functional Requirements", "28"),
  tocLine("4.1.2", "Non-Functional Requirements", "30"),
  tocLine("4.2", "Hardware and Software Requirements", "31"),
  tocLine("4.3", "System Overview", "32"),
  tocLine("4.4", "Summary", "33"),
  emptyLine(),
  tocLine("5", "CHAPTER 5: IMPLEMENTATION", "34"),
  tocLine("5.1", "System Design and Architecture", "34"),
  tocLine("5.2", "Workflow and Process Description", "35"),
  tocLine("5.3", "Module Description", "37"),
  tocLine("5.3.1", "Authentication Module", "37"),
  tocLine("5.3.2", "Project Management Module", "39"),
  tocLine("5.3.3", "Feedback Core Module", "40"),
  tocLine("5.3.4", "Analytics and Dashboard Module", "43"),
  tocLine("5.4", "System Integration", "44"),
  tocLine("5.5", "Advantages of Implementation", "45"),
  tocLine("5.6", "Summary", "46"),
  emptyLine(),
  tocLine("6", "CHAPTER 6: FUTURE SCOPE AND CONCLUSION", "47"),
  tocLine("6.1", "Future Scope", "47"),
  tocLine("6.2", "Conclusion", "50"),
  emptyLine(),
  tocLine("7", "CHAPTER 7: BIBLIOGRAPHY", "53"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ASSEMBLE
const allSections = [
  ...titlePage, ...cert, ...decl, ...ack, ...abs, ...toc,
  ...ch1, ...ch2, ...ch3, ...ch4, ...ch5, ...ch6, ...ch7,
];

const doc = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 }, paragraph: { spacing: { line: 360 } } } } },
  sections: [{
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "FeedByMe — Multi-Project Feedback Management System", size: 18, font: "Times New Roman", italics: true, color: "999999" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Times New Roman" })] })] }) },
    children: allSections,
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("c:\\Users\\ASUS\\Downloads\\feedbyme\\FeedByMe_Report_Final_58.docx", buffer);
  console.log("SUCCESS! Report generated: FeedByMe_Final_Report_55Pages.docx");
  console.log("Total paragraphs: " + allSections.length);
});
