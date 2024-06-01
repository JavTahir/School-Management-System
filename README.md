# School Management System

## Project Overview

This project involves creating a mobile application for a School Management System using React Native and Firebase. The system will support three types of users: Admin, Teacher, and Student, each with different functionalities.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Features](#features)
  - [Admin Portal](#admin-portal)
  - [Teacher Portal](#teacher-portal)
  - [Student Portal](#student-portal)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Submission Guidelines](#submission-guidelines)
- [Contact](#contact)

## Technologies Used

- **React Native CLI** (No Expo)
- **Firebase**
  - Authentication
  - Firestore
  - Storage
  - Realtime Database
- **Third-party Packages**:
  - `@react-native-async-storage/async-storage`
  - `@react-native-community/checkbox`
  - `@react-native-firebase/app`
  - `@react-native-firebase/auth`
  - `@react-native-firebase/database`
  - `@react-native-firebase/firestore`
  - `@react-native-firebase/storage`
  - `@react-navigation/native`
  - `@react-navigation/stack`
  - `react-native-bouncy-checkbox`
  - `react-native-chart-kit`
  - `react-native-date-picker`
  - `react-native-gesture-handler`
  - `react-native-html-to-pdf`
  - `react-native-image-picker`
  - `react-native-linear-gradient`
  - `react-native-paper`
  - `react-native-picker-select`
  - `react-native-safe-area-context`
  - `react-native-screens`
  - `react-native-share`
  - `react-native-svg`
  - `react-native-vector-icons`

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/JavTahir/School-Management-System.git
   cd sms
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up Firebase:**
   - Create a Firebase project at Firebase Console.
   - Add your projects `google-services.json` file in android/app/.

## Running the Project

1. **Start the Metro server:**
   ```sh
   npm start
   ```
2. **Run on Android:**
   ```sh
   npm run android
   ```
3. **Run on iOS:**
   ```sh
   npm run ios
   ```

## Features

### Admin Portal

- **Admin Account:** Pre-created account (no sign-up required).
- **Manage Classes and Teachers:** Assign or remove classes for teachers.
- **Student Management:** Create, view, edit, and delete student records.
- **Fee Management:** Insert, view, update, and delete fee status for students.
- **Reports:**
  - **Student Age Record:** Detailed age report of students.
  - **Result Sheet:** Overall class results.
  - **Timetable and Syllabus:** Upload and remove yearly timetable and class syllabi.
  - **PDF Reports:** Download reports in PDF format using a third-party package.

### Teacher Portal

- **Login:** Each teacher has individual login credentials.
- **Class Management:** View, search, insert, update, and delete student marks.
- **CRUD Operations:** Perform CRUD operations for assigned classes only.

### Student Portal

- **Login:** Each student has individual login credentials.
- **Marks Viewing:** View marks for all subjects and terms (First, Mid, Final).
- **Fee Status:** View fee status and payment history.
- **Timetable and Syllabus:** View class timetable and syllabus.

## Project Structure

```
sms/
├── android/
├── ios/
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── utils/
│   └── firebaseConfig.js
├── .eslintrc.js
├── .prettierrc
├── App.js
├── package.json
└── README.md
```

## Contact

For any queries, contact [Javeria Tahir](mailto:javeria.tahir2003@gmail.com) or refer to the course guidelines.

Thank you for using sms!
