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
## 🏗️Structure

```bash
privnotecloneServer/
├─ docs/                            # Open api documentation    
├─ src/
│  ├─ dto/note.dto.ts               # DTO 
│  ├─ middleware/validate.ts        # middleware for Scheme validation 
│  ├─ models/Note.ts                # mongoose schema
│  ├─ routes/(notes.ts, health.ts)  # POST and GET routes
│  ├─ services/notes.service.ts     # Create note and read once
│  ├─ utils/ (crypto.ts, time.ts)   # encrypt, decrypt, TTL logic
│  ├─ db.ts                         # Database connectivity
│  ├─ index.ts                      # app bootstrap
│  └─ config/                       # env, logger, cors, security headers
├─ tests/
├─ tsconfig.json
├─ package.json
└─ Dockerfile
```
---
## 📔 Data Model
```js
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
## 🌐Build and Serve
In Docker, the app is built node and express

From inside privnotecloneServer folder:

```bash
# build image, tag it "privnote-api"
docker build -t privnote-api .
```

Run it:

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e MONGO_URI="mongodb://host.docker.internal:27017/privnote" \
  -e SECRET_KEY_BASE64="$(openssl rand -base64 32)" \
  -e DEFAULT_EXPIRY_MINUTES=60 \
  privnote-api
```

---
## ⚙️Technical Notes
**🧱 Stack:** Node.js + Express + Typescript + MongoDB
**🔒 Cryptography:** NODE ```crypto``` AES-256-GCM
**📔 Database:** MongoDB via Mongoose
**⚙️ Config:** ```.env``` with 
  - PORT: on which the apis are going to be served
  - MONGO_URI: the connection string URI for mongoDB
  - SECRET_KEY_BASE64: 32-byte base64 key
  - DEFAULT_EXPIRY_MINUTES: 60 mins by default

**🛡️ Security:** CORS, request body size limits
**🏁 Tests:** Jest + ts-jest for services & routes

