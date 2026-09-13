# 🍅 Tomato

A modern food delivery web application built with **React, TypeScript, Redux Toolkit, and Spring Boot**.

Tomato provides separate experiences for **Customers, Sellers, and Riders**, with features such as authentication, role-based access, menu management, location-based functionality, and order management.

---

## 🚀 Features

* 🔐 **Authentication & Authorization**

  * Google Authentication
  * Role-based access control
  * Customer, Seller, and Rider roles

* 👤 **Customer**

  * Browse food items
  * View restaurant menus
  * Manage profile
  * Location-based functionality

* 🏪 **Seller**

  * Manage menu items
  * Add, update, and delete food items
  * Manage seller-specific data

* 🚴 **Rider**

  * Rider-specific functionality
  * Order delivery workflow

* 📍 **Geolocation**

  * Location-aware application features
  * React geolocation context

* 🗃️ **State Management**

  * Redux Toolkit for global application state
  * React Context API for shared application data

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Redux Toolkit
* React Router
* Axios
* Tailwind CSS

### Backend

* Node JS

### Database

* MongoDB

---

# 🔄 Redux Toolkit

Redux Toolkit is used to manage complex global state in the application.

![Redux Toolkit](https://github.com/user-attachments/assets/1c63be67-8719-4d64-8d26-3e454460f77a)

### Core Redux Concepts

#### 🏪 Store

The **Store** is the central place that holds the application's global state.

```text
Store
 ├── User State
 ├── Cart State
 ├── Authentication State
 └── Other Global State
```

#### 🧩 Slices

A **Slice** groups related state and the logic required to update that state.

For example:

```text
userSlice
cartSlice
authSlice
```

Each slice contains its own state, reducers, and actions.

#### ⚡ Actions

Actions describe **what happened** in the application.

Components dispatch actions when they need to update the state.

```text
Component
    ↓
  Action
    ↓
  Store
```

#### 🔧 Reducers

Reducers contain the logic that determines how the state changes when an action is dispatched.

```text
Action
  ↓
Reducer
  ↓
Updated State
```

#### 🪝 Hooks

React components interact with Redux using hooks such as:

* `useDispatch()` — dispatch actions
* `useSelector()` — read data from the Redux store

Example:

```tsx
const dispatch = useDispatch();

const user = useSelector((state) => state.user);
```

---

# ⚖️ Context API vs Redux

When building React applications, sharing data between components can become difficult as the application grows.

Two common approaches are **React Context API** and **Redux**.

Both can provide application-wide state, but they are designed for different levels of complexity.

---

## ⚛️ Context API

The **Context API** is built directly into React.

It is useful when you need to share data across multiple components without passing props through every level of the component tree.

### Best suited for

* Simple global state
* Theme settings
* Authentication information
* User preferences
* Language settings
* Small and medium-sized applications

### Flow

```text
Provider
   ↓
Context
   ↓
Components
```

Example:

```tsx
const AppContext = createContext<AppContextType | undefined>(undefined);
```

Components can then consume the shared data without prop drilling.

---

## 🔄 Redux

**Redux** is a standalone state management library designed for predictable and structured state management.

Redux Toolkit provides the recommended modern approach to writing Redux logic.

### Best suited for

* Complex global state
* Large applications
* Frequently changing state
* Multiple components accessing the same state
* Complex state update logic
* Applications requiring predictable state changes

### Flow

```text
Component
    ↓
dispatch(action)
    ↓
Redux Store
    ↓
Reducer
    ↓
Updated State
    ↓
Component
```

---

## 🆚 Context API vs Redux

| Feature                        | Context API | Redux Toolkit   |
| ------------------------------ | ----------- | --------------- |
| Built into React               | ✅           | ❌               |
| Additional library             | ❌           | ✅               |
| Setup                          | Simple      | More structured |
| Simple global state            | ✅ Excellent | ✅               |
| Complex state                  | ⚠️ Limited  | ✅ Excellent     |
| State organization             | Basic       | Structured      |
| DevTools                       | Limited     | ✅ Excellent     |
| Middleware                     | ❌           | ✅               |
| Large applications             | ⚠️ Depends  | ✅               |
| Predictable state updates      | Basic       | ✅               |
| Multiple complex state updates | ⚠️          | ✅               |

---

## 🤔 Why Use Both?

Context API and Redux don't necessarily have to be alternatives.

They can be used together when they serve different purposes.

For example:

```text
React Context
     ↓
Application-level data
     │
     ├── Authentication
     ├── Location
     └── Configuration

Redux Toolkit
     ↓
Complex application state
     │
     ├── User State
     ├── Cart State
     ├── Orders
     └── Other Dynamic State
```

The key is to use each tool where it provides the most value.


## 📸 Application

<img width="173" height="173" alt="Tomato" src="https://github.com/user-attachments/assets/0016530b-dd47-48ba-8a95-84d077560791" />

---

## 👨‍💻 Author

**Ankit Agarwal**

GitHub: [ankit-2210](https://github.com/ankit-2210)

