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
  role_id INT NULL
  manager_id INT,
  PRIMARY KEY (id)
);