const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const sqlQuery = `SELECT first_name, last_name, role_title, role_salary, department_name FROM employee
INNER JOIN employee_role ON employee.role_id = employee_role.id
INNER JOIN  department ON employee_role.department_id = department.id`;
let employeeList = [];

const roleSelect = {
  "Physical Therapist": "1",
  "Occupational Therapist": "2",
  "Speech Therapist": "3",
  // "Therapy Manager": "4",
  "Tele Nurse": "5",
  "ICU Nurse": "6",
  "Surgery Nurse": "7",
  // "Nurse Manager": "8"
  PCP: "9",
  Surgeon: "10",
  Specialist: "11"
  // "Doctor Manager": "12"
};

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "blank",
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
        type: "list",
        name: "init",
        message: "What would you like to do?",
        choices: [
          "Add an employee",
          "View all employees",
          "View all managers",
          "View employees by department",
          "Edit an employee",
          "EXIT"
        ]
      }
    ])
    .then(answer => {
      if (answer.init === "Add an employee") {
        addEmployees();
      } else if (answer.init === "View all employees") {
        viewEmployees();
      } else if (answer.init === "View employees by department") {
        viewDepartment();
      } else if (answer.init === "View all managers") {
        viewManagers();
      } else if (answer.init === "Edit an employee") {
        editEmployee();
      } else {
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
        type: "list",
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
        type: "list",
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
        type: "list",
        name: "role",
        message: "What is your role?",
        choices: ["Tele Nurse", "ICU Nurse", "Surgery Nurse"],
        when: function(answers) {
          return answers.manager === false && answers.department === "Nursing";
        }
      },
      {
        type: "list",
        name: "role",
        message: "What is your role?",
        choices: ["PCP", "Surgeon", "Specialist"],
        when: function(answers) {
          return answers.manager === false && answers.department === "Doctors";
        }
      }
    ])
    .then(answer => {
      let role_id = null;
      if (!answer.manager) {
        role_id = roleSelect[answer.role];
      } else {
        if (answer.department === "Therapy") {
          role_id = "4";
        } else if (answer.department === "Nursing") {
          role_id = "8";
        } else if (answer.department === "Doctors") {
          role_id = "12";
        }
      }

      connection.query(
        `INSERT INTO employee (first_name, last_name, role_id)
        values ("${answer.firstName}", "${answer.lastName}", "${role_id}");`,
        function(err, res) {
          if (err) throw err;
          console.log("employee added");
          startServer();
        }
      );
    });
}

function viewEmployees() {
  connection.query(sqlQuery, function(err, res) {
    if (err) throw err;
    console.table(res);
    startServer();
  });
}

function viewDepartment() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "What department do you want?",
        choices: ["Therapy", "Nursing", "Doctors"]
      }
    ])
    .then(select => {
      let data = [];
      connection.query(
        `${sqlQuery} WHERE department_name = "${select.department}"`,
        function(err, res) {
          if (err) throw err;
          data.push(res);
          console.table(res);
          startServer();
        }
      );
    });
}

function viewManagers() {
  connection.query(`${sqlQuery} WHERE role_title = "Manager"`, function(
    err,
    res
  ) {
    if (err) throw err;
    console.table(res);
    startServer();
  });
}

function editEmployee() {
  new Promise((resolve, reject) => {
    connection.query(
      `SELECT first_name, last_name, employee.id, department_name FROM employee 
    INNER JOIN employee_role ON employee.role_id = employee_role.id 
    INNER JOIN  department ON employee_role.department_id = department.id`,
      function(err, res) {
        if (err) throw err;
        res.forEach(employee =>
          employeeList.push({
            name: `${employee.first_name} ${employee.last_name}`,
            value: [`${employee.id}`, `${employee.department_name}`]
          })
        );
        resolve(employeeList);
      }
    );
  }).then(employee => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "singleEmployee",
          message: "Who do you want to edit?",
          choices: employeeList
        }
      ])
      .then(worker => {
        connection.query(
          `SELECT first_name, last_name, role_title, role_salary, department_name, employee.id FROM employee
          INNER JOIN employee_role ON employee.role_id = employee_role.id
          INNER JOIN  department ON employee_role.department_id = department.id
          WHERE employee.id = "${worker.singleEmployee[0]}"`,
          function(err, res) {
            if (err) throw err;
            console.table(res);
            let rawDataWorker = [res[0].id, res[0].department_name];

            updateEmployee(rawDataWorker);
          }
        );
      });
  });
}

function updateEmployee(id) {
  let userUpdateID = id[0];
  let userUpdateDepartment = id[1];

  inquirer
    .prompt([
      {
        type: "list",
        name: "updateChoice",
        message: "What do you want to do?",
        choices: [
          "Delete employee",
          "Change role",
          "Promote to manager",
          "Go back"
        ]
      }
    ])
    .then(answer => {
      if (answer.updateChoice === "Delete employee") {
        connection.query(
          `DELETE FROM employee WHERE employee.id = "${userUpdateID}"`,
          function(err, res) {
            if (err) throw err;
            console.log("employee deleted");
            startServer();
          }
        );
      } else if (answer.updateChoice === "Change role") {
        changeEmployeeRole(userUpdateDepartment, userUpdateID);
      } else if (answer.updateChoice === "Promote to manager") {
        promoteToManager(userUpdateDepartment, userUpdateID);
      } else if (answer.updateChoice === "Go back") {
        startServer();
      }
    });
}

function changeEmployeeRole(newRole, ID) {
  let changeRole = newRole;
  let changeRoleAtID = ID;

  inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "What is their new role?",
        choices: [
          "Physical Therapist",
          "Occupational Therapist",
          "Speech Therapist"
        ],
        when: function() {
          return changeRole === "Therapy";
        }
      },
      {
        type: "list",
        name: "role",
        message: "What is your role?",
        choices: ["Tele Nurse", "ICU Nurse", "Surgery Nurse"],
        when: function() {
          return changeRole === "Nursing";
        }
      },
      {
        type: "list",
        name: "role",
        message: "What is your role?",
        choices: ["PCP", "Surgeon", "Specialist"],
        when: function() {
          return changeRole === "Doctors";
        }
      }
    ])
    .then(answer => {
      let role_id = null;
      role_id = roleSelect[answer.role];

      connection.query(
        `UPDATE employee SET role_id=${role_id} WHERE id=${changeRoleAtID};`,
        function(err, res) {
          if (err) throw err;
          console.log(`employee updated to ${answer.role}`);
          startServer();
        }
      );
    });
}

function promoteToManager(newManager, ID) {
  if (newManager === "Therapy") {
    role_id = "4";
  } else if (newManager === "Nursing") {
    role_id = "8";
  } else if (newManager === "Doctors") {
    role_id = "12";
  }

  connection.query(
    `UPDATE employee SET role_id=${role_id} WHERE id=${ID};`,
    function(err, res) {
      if (err) throw err;
      console.log(`Congratulations Mr/Mrs manager!`);
      startServer();
    }
  );
}
