## `DevMatch` (Backend)

This is the backend codebase of the **DevMatch** platform – a real-time matchmaking system for developers.

---

<img width="1917" height="874" alt="Screenshot 2025-07-11 194431" src="https://github.com/user-attachments/assets/39162f83-b28c-4214-afca-6a7bfdd321da" />

---



## 🚀 Features

- 🔐 JWT & cookie-based session authentication
- 📤 Email reminders using Amazon SES
- 📇 Profile management (CRUD)
- 🧭 Matchmaking logic via `/feed`
- 💌 Connection requests (interested / ignored / accepted / rejected)
- 💬 Real-time chat with Socket.io
- 🌍 Hosted on Amazon EC2, reverse proxied with NGINX
- 🔁 PM2 for process management

---

## 🛠️ Tech Stack

| Tech        | Description                             |
|-------------|------------------------------------------|
| Node.js     | Server runtime                           |
| Express.js  | Web framework                            |
| MongoDB     | NoSQL database                           |
| Mongoose    | MongoDB ORM                              |
| JWT         | Token-based authentication               |
| Amazon SES  | Sending emails                           |
| Socket.io   | Real-time communication engine           |
| PM2         | Node process manager                     |
| NGINX       | Reverse proxy for deployment             |

---

