# Paytrack

This system is responsible for calculating and updating the salary balances of employees, both for **monthly** and **daily** salaried workers. It processes attendance data and ensures accurate payroll management. It integrates with PostgreSQL for data storage and NestJS for API management, running scheduled tasks daily to ensure balances are up-to-date.

To ensure scalability and performane, the applications follows a distributed architecture and asynchronous task handling via Publish/Subscribe pattern using BullMQ. BullMQ is message queue facilitator which uses Redis as the storage medium. It provides blazing fast task scheduling and retrieval. The application also emphasizes on database optimzations by using composite indexes and functions for salary balance updation logic.

---

## Table of Contents
- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Performance Optimization](#performance-optimization)
- [Future Enhancements](#future-enhancements)

---

## Overview

The **Employee Balance Calculation System** calculates employee balances daily based on:
- **Monthly Salaried Employees**: The salary is calculated based on working days in a month.
- **Daily Salaried Employees**: The salary is calculated based on actual attendance (must work 9+ hours to count as a paid day).

It works by:
1. Fetching the attendance records from the **attendances** table.
2. Calculating the per-day salary for monthly employees and the total balance for each employee.
3. Updating the balance for each employee in the **balances** table, either by updating an existing balance or creating a new record if no balance exists for the month.

---

## System Requirements

- **PostgreSQL 12+** for data storage.
- **Node.js (v16+)** for backend services.
- **NestJS** for API management.
- **BullMQ** for background job processing.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/employee-balance-calculation-system.git
cd employee-balance-calculation-system
