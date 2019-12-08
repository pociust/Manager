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
  database: "company_db"
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
          "View all employees",
          "View all managers",
          "View employees by department",
          "EXIT"
        ]
      }
    ])
    .then(answer => {
      console.log("answer1", answer.init);
      if (answer.init === "Add an employee") {
        addEmployees();
      } else if (answer.init === "View all employees") {
        viewEmployees();
      } else if (answer.init === "View employees by department") {
        viewDepartment();
      } else if (answer.init === "View all managers") {
        viewManagers();
      } /*else if (answer.init === "View all managers") {
        viewManagers();
      } */ else {
        connection.end();
      }
    });
}

function addEmployees() {
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
        choices: ["Therapy", "Nursing", "Doctors"]
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
        choices: ["Tele Nurse", "ICU Nurse", "Surgery Nurse"],
        when: function(answers) {
          return answers.manager === false && answers.department === "Nursing";
        }
      },
      {
        type: "rawlist",
        name: "role",
        message: "What is your role?",
        choices: ["PCP", "Surgon", "Specialist"],
        when: function(answers) {
          return answers.manager === false && answers.department === "Doctors";
        }
      }
    ])
    .then(answer => {
      console.log(answer);
      console.log(answer.role);
      let role_id = "";
      if (answer.role === "Physical Therapist") {
        role_id = "1";
      }
      if (answer.role === "Occupational Therapist") {
        role_id = "2";
      }
      if (answer.role === "Speech Therapist") {
        role_id = "3";
      }
      if (answer.manager === true && answer.department === "Therapy") {
        role_id = "4";
      }
      if (answer.role === "Tele Nurse") {
        role_id = "5";
      }
      if (answer.role === "ICU Nurse") {
        role_id = "6";
      }
      if (answer.role === "Surgery Nurse") {
        role_id = "7";
      }
      if (answer.manager === true && answer.department === "Nursing") {
        role_id = "8";
      }
      if (answer.role === "PCP") {
        role_id = "9";
      }
      if (answer.role === "Surgon") {
        role_id = "10";
      }
      if (answer.role === "Specialist") {
        role_id = "11";
      }
      if (answer.manager === true && answer.department === "Doctors") {
        role_id = "12";
      }

      console.log("roleid", role_id);
      // connection.query(
      //   `INSERT INTO employee (first_name, last_name, role_id)
      //   values ("${answer.firstName}", "${answer.lastName}", "1");`,
      //   function(err, res) {
      //     if (err) throw err;
      //     console.table(res);
      //     startServer();
      // }
      // );

      startServer();
    });
}

function viewEmployees() {
  connection.query(
    `SELECT first_name, last_name, role_title, role_salary, department_name FROM employee 
    INNER JOIN employee_role ON employee.role_id = employee_role.id 
    INNER JOIN  department ON employee_role.department_id = department.id`,
    function(err, res) {
      if (err) throw err;
      console.table(res);
      startServer();
    }
  );
}

function viewDepartment() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "department",
        message: "What department do you want?",
        choices: ["Therapy", "Nursing", "Doctors"]
      }
    ])
    .then(select => {
      connection.query(
        `SELECT first_name, last_name, role_title, role_salary, department_name FROM employee 
        INNER JOIN employee_role ON employee.role_id = employee_role.id 
        INNER JOIN  department ON employee_role.department_id = department.id 
        WHERE department_name = "${select.department}"`,
        function(err, res) {
          if (err) throw err;
          console.table(res);
          startServer();
        }
      );
    });
}

function viewManagers() {
  connection.query(
    `SELECT first_name, last_name, role_title, role_salary, department_name FROM employee
    INNER JOIN employee_role ON employee.role_id = employee_role.id
    INNER JOIN  department ON employee_role.department_id = department.id
    WHERE role_title = "manager"`,
    function(err, res) {
      if (err) throw err;
      console.table(res);
      startServer();
    }
  );
}
