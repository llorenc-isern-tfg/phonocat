# phonocat

Phonocat és una aplicació per enregistrar discos de vinil, compartir-los amb altres usuaris i fer ofertes de compra / venda.

## Requisits

Per executar en local cal configurar les següents variables d'entorn i claus d'API

phonocat/.env

```bash
EXEC_ENV = development
PORT = 5000
MONGO_URI = connexió a una instancia de MongoDb

JWT_SECRET = clau secreta per a encriptar JWT
JWT_EXPIRATION_TIME = temps expiració token

GOOGLE_OAUTH_CLIENT_ID = clau propia google auth
GOOGLE_OAUTH_CLIENT_SECRET = secret propi google auth

DISCOGS_API_URL = https://api.discogs.com
DISCOGS_API_KEY = clau propia discogs
DISCOGS_API_SECRET = secret propi google auth

CLOUDINARY_CLOUD_NAME = identificador cloudinary
CLOUDINARY_API_KEY = key cloudinary
CLOUDINARY_API_SECRET = secret cloudinary
```

phonocat/frontend/.env

```bash
REACT_APP_LASTFM_URL = https://ws.audioscrobbler.com/2.0
REACT_APP_LASTFM_KEY = key lastfm
REACT_APP_GOOGLE_CLIENT_ID = cliend id google auth
```

## Instal·lació

Cal tenir instal·lats node 15 i npm 7. I executar npm install dins del directori arrel phonocat i el direcori phonocat/frontend
A continuació executar el següent script:

```bash
node run dev
```
