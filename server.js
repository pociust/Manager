const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "way2great",
  database: "greatbay_db"
});

connection.connect(function(err) {
  if (err) throw err;
  startServer();
});

function startServer() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "init",
        message: "What would you like to do?",
        choices: [
          "Add an employee",
          "View all employees by department",
          "View all managers",
          "EXIT"
        ]
      }
    ])
    .then(answer => {
      console.log("answer1", answer.init);
      if (answer.init === "Add an employee") {
        console.log("all employees");
        viewEmployees();
      } else if (answer.init === "View all employees by department") {
        console.log("department");
        viewDepartment();
      } else if (answer.init === "3") {
        console.log("View all managers");
        // bidAuction();
      } else {
        console.log("close");
        connection.end();
      }
    });
}

function viewEmployees() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is your first name?",
        filter: function(val) {
          return val.charAt(0).toUpperCase() + val.slice(1);
        }
      },
      {
        type: "input",
        name: "lastName",
        message: "What is your last name?",
        filter: function(val) {
          return val.charAt(0).toUpperCase() + val.slice(1);
        }
      },
      {
        type: "rawlist",
        name: "department",
        message: "What department do you work for?",
        choices: [
          "Therapy",
          "Nursing",
          "Doctors",
        ]
      },
      {
        type: "confirm",
        name: "manager",
        message: "Are you a manager?",
        default: false
      },
      {
        type: "rawlist",
        name: "role",
        message: "What is your role?",
        choices: [
          "Physical Therapist",
          "Occupational Therapist",
          "Speech Therapist"
        ],
        when: function(answers) {
          return answers.manager === false && answers.department === "Therapy";
        }
      },
      {
        type: "rawlist",
        name: "role",
        message: "What is your role?",
        choices: [
          "Tele Nurse",
          "ICU Nurse",
          "Surgery Nurse"
        ],
        when: function(answers) {
          return answers.manager === false && answers.department === "Nursing";
        }
      },
      {
        type: "rawlist",
        name: "role",
        message: "What is your role?",
        choices: [
          "PCP",
          "Surgon",
          "Specialist"
        ],
        when: function(answers) {
          return answers.manager === false && answers.department === "Doctors";
        }
      }
    ])
    .then(answer => {
      console.log(answer);
      startServer();
    });
}

function viewDepartment() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "department",
        message: "What department do you want?",
        choices: [
          "Therapy",
          "Nursing",
          "Doctors",
        ]
      }
    ])
    .then(select => {
      console.log(select.department);
    });
}
