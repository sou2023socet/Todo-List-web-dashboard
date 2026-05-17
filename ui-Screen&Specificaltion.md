This **UI Screen Specification** defines the frontend requirements for the Todo-List project. It maps the features from your **Backend Technical Specification** (Session Auth, CSRF, Tenant Isolation, and Enums) into a functional user interface.

---

## 🎨 UI Architecture & Global Components

Before detailing individual screens, all frontend clients (Web, Mobile, Desktop) must implement these core behaviors:

* **Global Interceptor:** Automatically attaches the `X-Frontend-Client` header and manages `X-XSRF-TOKEN` for `POST/PUT/DELETE` requests.
* **Tenant Persistence:** Remembers the `tenantId` during the session for the Login/Registration flow.
* **Stateful Badges:** Visual indicators for **Status** (PENDING: Yellow, IN_PROGRESS: Blue, COMPLETED: Green).
* **Priority Icons:** (LOW: 🟢, MEDIUM: 🟡, HIGH: 🔴).

---

## 🖥️ 1. Authentication Module

### 1.1 Login Screen

The gateway to the app.

* **Fields:** - `tenantId` (Text Input)
* `username` (Text Input)
* `password` (Password Input with "Show Password" toggle)


* **Primary Action:** `Login` button (Triggers `POST /api/auth/login`).
* **Secondary Actions:** - `Register New Account` link.
* `Forgot Password?` link.


* **Error Handling:** Display specific message for `401` (Invalid credentials) or `429` (Too many attempts).

### 1.2 Registration Screen

* **Fields:** - `tenantId` (Required, helps group users).
* `username` (Min 3 chars).
* `password` (Must satisfy the backend policy: Upper, Lower, Digit, Special).
* `confirmPassword` (Client-side validation).


* **Action:** `Register` button (Triggers `POST /api/auth/register`).
* **Success Flow:** Redirect to Login with a success toast.

### 1.3 Forgot Password Screen

* **Fields:** `tenantId`, `username`.
* **Note:** This is a placeholder for future implementation where a reset token is sent via email or an admin.

---

## 📋 2. Dashboard Module (Main View)

This is the primary workspace. It is divided into a **Sidebar** and a **Main Content Table**.

### 2.1 Sidebar / Navigation

* **All Tasks:** Link to fetch all todos (`GET /api/todo`).
* **Sections List:** A dynamic list generated from `GET /api/todo/sections`.
* **Add Section Button:** Opens a small prompt to create a new category name.
* **Tenant Display:** Shows the current `tenantId` and `username`.

### 2.2 Todo List Table (Main Content)

Displays data in a **Table Layout** to maximize visibility of summary points.

* **Columns:**
1. **Date:** `createdAt` (Formatted as `DD/MM/YYYY`).
2. **Topic:** Bold title of the task.
3. **Summary:** Truncated text of `summaryPoints`.
4. **Status/Priority:** Color-coded badges.
5. **Section:** Category label.
6. **Actions:** The **Three-Dot Menu (`⋮`)**.


* **Pagination Footer:** Controls for `page` and `size` (links to `?page=X&size=Y`).

---

## ➕ 3. Todo Operations (Modals/Forms)

### 3.1 Create/Edit Todo Form

A modal overlay triggered by the **"Add Todo"** button or the **"Edit"** action.

* **Fields:**
* `topic` (Text input).
* `summaryPoints` (Multi-line Text Area).
* `section` (Dropdown populated from Section list + "Add New" option).
* `status` (Select: PENDING, IN_PROGRESS, COMPLETED).
* `priority` (Select: LOW, MEDIUM, HIGH).


* **Actions:** `Save` (POST/PUT) and `Cancel`.

### 3.2 Action Menu (The "Three-Dot" Logic)

When a user clicks `⋮` on a table row:

* **Edit:** Opens the Todo Form populated with existing data.
* **Delete:** Triggers a confirmation modal ("Are you sure?"). On confirm, calls `DELETE /api/todo/{id}`.
* **Copy:** - **Logic:** Clones the object (minus the `id`) and opens the Create Form with these values pre-filled so the user can save a duplicate quickly.

---

## 🚦 4. Feedback & Status UI

| Scenario | UI Response |
| --- | --- |
| **Loading** | Shimmer/Skeleton effect on the table rows. |
| **Empty State** | Illustration + "No todos found in this section. Create one!" |
| **Success** | Small "Toast" notification (e.g., "Todo Saved Successfully"). |
| **Error (400)** | Highlight specific form fields with the error message from `data.errors`. |
| **Session Expired** | Automatic redirect to Login Screen if a `401` occurs. |

---

## 🛠️ 5. Implementation Summary Table

| View Name | Backend Endpoint | Key Frontend Component |
| --- | --- | --- |
| **Login** | `/api/auth/login` | Card with Form Validation |
| **Registration** | `/api/auth/register` | Password Complexity Meter |
| **Main Dashboard** | `/api/todo` | Data Table with Pagination |
| **Section Filter** | `/api/todo/section/{name}` | Sidebar Navigation |
| **Todo Modal** | `/api/todo (POST/PUT)` | Dynamic Select Menus (Enums) |

**Next Step Recommendation:** I can now generate the **Component List** and **Folder Structure** for a specific framework (e.g., Angular or React) based on this specification. Which framework should we start with?