# 📝 Secure Notes (Express + TypeScript)

A simple project inspired by PrivNote to share secure, self-destructing notes.  

## ⭐ Capabilities

**🔒 Encryption at rest:** notes are stored with a unique IV and an app-wide secret key feed into the application during startup. the notes are encrypted with _AES-256-GCM_ encryption
**📅 Auto expiration:** MongoDB TTL index deletes expired notes automatically once the expiration time is reached. 
**🔥 Burn after reading** Retrieval uses ```findOneAndDelete``` so a note is only ever read once.
**⚠️ Errors Codes:**
  - 404 (Note not found / expired)
  - 400 (bad request)
---
## 📔 Data Model
```
{
  _id: string,
  message: string,
  iv: string,
  alg: string,     // "aes-256-gcm"
  expiresAt: Date,
  createdAt: Date
}
```
_Indexes: TTL on ```expiresAt```_

---
## 🔃 API Flow
**📝 POST /api/notes**
  - Encrypts plaintext message, saves it and returns ```{id,url}```
  - id: the id of the note
  - url: the url to GET the note via API

**🗒️ GET /api/notes/:id**
  - Atomically finds and deetes the note, decrypts it and returns {message}
  - If missing or expired, it returns a 404 to prevent from disclosing if a note ever existed or not

---
## ⚙️Technical Notes
**🔒 Cryptography:** NODE ```crypto``` AES-256-GCM
**📔 Database:** MongoDB via Mongoose
**⚙️ Config:** ```.env``` with 
  - PORT: on which the apis are going to be served
  - MONGO_URI: the connection string URI for mongoDB
  - SECRET_KEY_BASE64: 32-byte base64 key
  - DEFAULT_EXPIRY_MINUTES: 60 mins by default

**🛡️ Security:** CORS, request body size limits
**🏁 Tests:** Jest + ts-jest for services & routes

