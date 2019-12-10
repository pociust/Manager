DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);


CREATE TABLE employee_role (
  id INT NOT NULL AUTO_INCREMENT,
  role_title VARCHAR(30) NULL,
  role_salary DECIMAL(10,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name  VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id) values ("John", "Smith", "1");
INSERT INTO employee (first_name, last_name, role_id) values ("Steven", "Jones", "2");
INSERT INTO employee (first_name, last_name, role_id) values ("Sarah", "Kyle", "3");
INSERT INTO employee (first_name, last_name, role_id) values ("Json", "File", "4");
INSERT INTO employee (first_name, last_name, role_id) values ("Tim", "Lee", "5");
INSERT INTO employee (first_name, last_name, role_id) values ("Luke", "Potter", "6");
INSERT INTO employee (first_name, last_name, role_id) values ("Lula", "Quta", "7");
INSERT INTO employee (first_name, last_name, role_id) values ("Hanz", "Tee", "8");
INSERT INTO employee (first_name, last_name, role_id) values ("Ben", "Wyyat", "9");
INSERT INTO employee (first_name, last_name, role_id) values ("Hope", "Hurr", "10");
INSERT INTO employee (first_name, last_name, role_id) values ("Mike", "Pocius", "11");
INSERT INTO employee (first_name, last_name, role_id) values ("Cody", "Sherman", "12");



INSERT INTO department (department_name) values ("Therapy");
INSERT INTO department (department_name) values ("Nursing");
INSERT INTO department (department_name) values ("Doctors");


INSERT INTO employee_role (role_title, role_salary, department_id) values ('Physical Therapist', '80000', 1);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('Occupational Therapist', '65000', 1);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('Speech Therapist', '60000', 1);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('Manager', '100000', 1);


INSERT INTO employee_role (role_title, role_salary, department_id) values ('Tele Nurse', '55000', 2);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('ICU Nurse', '75000', 2);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('Surgery Nurse', '90000', 2);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('Manager', '110000', 2);


INSERT INTO employee_role (role_title, role_salary, department_id) values ('PCP', '100000', 3);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('Surgeon', '200000', 3);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('Specialist', '120000', 3);
INSERT INTO employee_role (role_title, role_salary, department_id) values ('Manager', '3000000', 3);


SELECT first_name, last_name, role_title, role_salary, department_name FROM employee
INNER JOIN employee_role ON employee.role_id = employee_role.id
INNER JOIN  department ON employee_role.department_id = department.id
WHERE role_title = "Manager";

SELECT first_name, last_name, role_title, role_salary, department_name FROM employee
INNER JOIN employee_role ON employee.role_id = employee_role.id 
INNER JOIN  department ON employee_role.department_id = department.id 
WHERE department_name = "${select.department}";

SELECT first_name, last_name, role_title, role_salary, department_name FROM employee
INNER JOIN employee_role ON employee.role_id = employee_role.id 
INNER JOIN  department ON employee_role.department_id = department.id;