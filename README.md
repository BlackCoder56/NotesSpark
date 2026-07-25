# ✨ NoteSpark

NoteSpark is a lightweight notes application that allows users to create and manage notes without creating an account.

Guest notes are stored locally in the user's browser using **Local Storage**, allowing users to access their notes even after refreshing the page.

When a guest user later **logs in or creates an account**, their locally stored notes can be synchronized with the backend database and associated with their account.

## 🚀 Features

* 📝 Create notes without authentication
* 💾 Store guest notes using browser Local Storage
* 🔄 Automatically save notes while typing
* 🗑️ Delete notes
* 👤 Support for guest and authenticated users
* ☁️ Sync guest notes with the backend after login or registration
* 🔐 Permanently associate notes with a user's account

## 🧠 How It Works

```text
Guest User
    ↓
Creates a Note
    ↓
Note is Saved to Local Storage
    ↓
User Logs In or Creates an Account
    ↓
Guest Notes are Synced with Backend
    ↓
Notes are Attached to User Account
```

## 🛠️ Technologies

* Vue.js
* JavaScript
* Tailwind CSS
* Browser Local Storage
* Flask Backend
* Database Storage

## 📌 Project Status

🚧 **Currently in development**

The current focus is building the guest notes functionality and local data persistence. Backend synchronization and authentication integration will be implemented in later stages.

## 🎯 Project Goal

The goal of NoteSpark is to explore how modern applications can support **guest users**, provide **local-first data persistence**, and seamlessly migrate guest data to authenticated user accounts.