# 🐶 **Dog Search App**
> A React + TypeScript app for searching and adopting dogs using Fetch API.

## 🚀 **Overview**
The Dog Search App allows users to search for dogs available for adoption using various filters (breed, age, etc.). Users can also select favorite dogs and generate a match for adoption. The app integrates with a backend API to fetch dog information and supports pagination, sorting, and state management using **React Query**.

---

## ✅ **Tech Stack**
| Technology | Description |
|-----------|-------------|
| **React** | Frontend framework |
| **TypeScript** | Type-safe development |
| **React Query** | Server state management |
| **Axios** | HTTP requests |
| **React Router** | Client-side routing |
| **Jest** | Unit testing |
| **Testing Library** | Component and hook testing |
| **Vite** | Fast development and build tool |
| **CSS Modules** | Component-based styling |

---

## 📂 **Folder Structure**
```plaintext
src/
├── __tests__
├── assets
├── components
├── config
├── context
├── hooks
│   └── __tests__
├── lib
├── pages
├── services
├── styles
├── types
└── utils
```

---

## ⚙️ **Setup & Installation**
### 1. **Clone the repository**
```sh
git clone git@github.com:DavidMaximaWang/fetch-react.git
cd fetch-react
```

### 2. **Install dependencies**
```sh
npm install
```

### 3. **Start the development server**
```sh
npm run dev
```

### 4. **Build for production**
```sh
npm run build
```

### 5. **Run tests**
```sh
npm test
```

---

## 🌟 **Features**
✔️ Search by **Breed**, **Age**, and **Location**
✔️ **Pagination** – Infinite scroll for loading more results
✔️ **Favorite Dogs** – Save favorite dogs across sessions
✔️ **Match Generation** – Generate a match based on favorited dogs
✔️ **Responsive Design** – Works on desktop and mobile
✔️ **API Integration** – Connects to Fetch API for real data
✔️ **React Query** – Efficient state management and caching

---

## 🚦 **API Reference**
### **1. Login Endpoint**
- **POST** `/auth/login`
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
Response:
```json
200 OK
```

### **2. Search Dogs**
- **GET** `/dogs/search`
```json
{
  "size": 24,
  "from": 0,
  "sort": "breed:asc",
  "breeds": ["Golden Retriever"],
  "ageMin": 1,
  "ageMax": 10
}
```
Response:
```json
{
  "resultIds": ["dog1", "dog2", "dog3"],
  "total": 100,
  "next": "/dogs/search?size=24&from=24&sort=breed:asc"
}
```

### **3. Get Dog Details**
- **POST** `/dogs`
```json
["dog1", "dog2"]
```
Response:
```json
[
  {
    "id": "dog1",
    "name": "Fido",
    "age": 2,
    "breed": "Labrador",
    "zip_code": "12345",
    "img": "https://example.com/dog1.jpg"
  }
]
```

---

## 🧪 **Testing**
### ✅ **Unit Test Example**
Tests are written using **Jest** and **Testing Library**.

Example test for `useDogsInfiniteQuery`:
Located in src/__tests__/useDogsInfiniteQuery.test.tsx

---

## 🎨 **Styling**
- Styling is handled using **CSS Modules**.
Example:
```scss
.container {
  display: flex;
  justify-content: center;
  background-color: #f8f8f8;
}
```

---

## 🚀 **Deployment**
1. **Build the project**:
```sh
npm run build
```
2. **Deploy to Vercel or Netlify**:
```sh
vercel deploy
```

---

## 📸 **Screenshots**

<img width="428" alt="image" src="https://github.com/user-attachments/assets/f45baa82-2d0e-4935-a877-543a52e8a61b" />
<img width="1709" alt="image" src="https://github.com/user-attachments/assets/6ff38d17-8fe9-4a1a-829e-a45fd4605686" />
<img width="353" alt="image" src="https://github.com/user-attachments/assets/1252bb8d-b3b4-4ae1-88a3-f789f6de28e3" />
<img width="1312" alt="image" src="https://github.com/user-attachments/assets/7db94dbc-afe0-4973-b7a9-7a44e16b9cbc" />
<img width="1044" alt="image" src="https://github.com/user-attachments/assets/5268eb73-d243-48a9-9943-406f2adc71e4" />
<img width="954" alt="image" src="https://github.com/user-attachments/assets/975263d7-c371-400c-85b6-caf919c2ce2b" />

---

## 🎯 **Future Improvements**
- ✅ Themes
- ✅ Filter by location
- ✅ Add real user authentication
- ✅ Improve UI with ui libaries like shadcn/ui, MaterialUI...

