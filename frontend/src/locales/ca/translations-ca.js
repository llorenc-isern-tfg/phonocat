export const TRANSLATIONS_CA = {
    generic: {
        fail: 'S\'ha produït un error, intenta-ho més tard',
        language: 'Idioma'
    },
    landingPage: {
        mainInfo: {
            title: 'Et donem la benvinguda a Phonocat',
            description: 'A aquest portal podràs enregistrar la teva col·lecció de discos, compartir-la amb altres usuaris i molt més!',
            imgText: 'Imatge decorativa'
        },
        share: 'Comparteix',
        share1: 'Mostra la teva col·lecció',
        share2: 'Connecta amb altres usuaris',
        share3: 'Descobreix nova música',
        catalogue: 'Cataloga',
        catalogue1: 'Enregistra la teva col·lecció',
        catalogue2: 'Revisa els teus àlbums',
        catalogue3: 'Autocompleta les seves dades',
        sell: 'Ven',
        sell1: 'Anuncia els teus vinils',
        sell2: 'Consulta discos en venda',
        sell3: 'Fes ofertes',
        join: 'Uneix-te a Phonocat',
    },
    footer: {
        title: 'Phonocat',
        desc: 'TFG 2021 - Llorenç Isern Martín',
        desc2: 'Grau en enginyeria informàtica UOC',
    },
    loginForm: {
        email: 'Correu electrònic',
        password: 'Contrasenya',
        signin: 'Identifica\'t',
        forgotPassword: 'No recordes la contrasenya?',
        signup: 'Encara no t\'has registrat?',
        fail: 'No s\'ha trobat cap usuari amb aquest email o password',
        google: 'Entra amb un compte de Google',
    },
    registerForm: {
        username: 'Nom d\'usuari',
        signup: 'Registra\'t',
        passwordConfirm: 'Confirma la contrasenya',
        login: 'Ja tens un compte? Identifica\'t',
        passwordConstrain: 'Introdueix una contrasenya de com a mínim {{min}} caràcters',
        differentPasswords: 'Les contrasenyes no coincideixen',
        duplicateUserName: 'Ja existeix un usuari amb aquest nom, escull un altre',
        userAlreadyExists: 'Ja existeix un usuari registrat amb aquest correu electrònic'
    },
    sideMenu: {
        home: 'Inici',
        profile: 'Perfil',
        lps: 'ALBUMS',
        lpCollection: 'Col·lecció',
        lpAdd: 'Nou disc',
        market: 'MERCAT',
        listedItems: 'En venda',
        offers: 'Ofertes',
        social: 'SOCIAL',
        users: 'Usuaris',
        conversations: 'Converses'
    },
    addLP: {
        title: 'Afegeix un nou LP',
        searchAlbum: 'Cerca un àlbum',
        completeAlbumData: 'Completa els detalls',
        addPictures: 'Afegeix una portada',
        saved: 'EL teu LP s\'ha desat correctament!',
        fail: 'El teu LP no s\'ha pogut desar'
    },
    searchAlbum: {
        title: 'Cerca un àlbum pel seu títol o autor',
        albumTitle: 'Títol de l\'àlbum',
        helpTitle: 'No trobes el que busques?',
        helpDescription: 'No et preocupis, avança al següent pas i introdueix les dades del teu LP manualment',
        preloadDataComplete: 'Hem trobat les següents dades del LP que has seleccionat. Ets lliure de modificar-les al teu gust',
        preloadDataNotFound: 'No s\'han trobat dades a precarregar d\'aquest LP',
        searching: 'Cercant...'
    },
    lpDetail: {
        title: 'Detalls de l\'àlbum',
        albumTitle: 'Títol',
        artist: 'Autor',
        discoLabel: 'Segell discogràfic',
        genre: 'Gènere',
        releaseYear: 'Any',
        releaseCountry: 'País',
        numDiscs: 'Nº de discs',
        condition: 'Condició de la teva còpia',
        weight: 'Qualitat del vinil',
        channel: 'Canal d\'audio',
        rating: 'Puntua aquest àlbum',
        comment: 'Ressenya',
        checkPublic: 'Vols que aquest LP sigui visible per la resta d\'usuaris?',
        visibility: 'Visibilitat',
        public: 'pública',
        private: 'privada',
        score: 'Puntuació',
        sell: {
            title: 'Vols posar aquest LP en venda?',
            priceInput: 'Indica a quin preu t\'agradaria vendre\'l',
            uploadPictures: 'Adjunta imatges on es vegi l\'estat del teu LP',
            forSale: 'Aquest LP està anunciat en venda per ',
            publish: 'Publica l\'anunci de venda',
            unpublish: 'Retira l\'anunci',
            listedSuccess: 'l\'anunci s\'ha publicat satisfactòriament',
            listedFail: 'No s\'ha pogut publicar l\'anunci'
        },
        changeVisibilityForSell: 'Si vols posar en venda aquest disc fes la seva visibilitat pública'
    },
    lpCover: {
        almostThere: 'Ja quasi està! Només falta afegir una imatge de la portada que t\'ajudarà a identificar el teu LP.',
        notMandatory: 'Si no vols associar cap imatge fes click a "Surt"',
        suggested: 'Hem trobat aquesta caràtula basant-nos en la teva cerca. Vols associar-la al teu LP?',
        notFound: 'No hem trobat cap caràtula amb les dades del teu LP',
        upload: 'Puja',
        discard: 'Descarta',
        uploaded: 'La portada s\'ha pujat correctament'
    },
    tracklist: {
        header: 'Llistat de cançons',
        title: 'Títol',
        position: 'Posició',
        duration: 'Duració'
    },
    lpCollection: {
        public: 'Públic',
        private: 'Privat',
        nonEditable: 'Retira l`\anunci de venda per poder modificar el LP',
        empty: 'Encara no has afegit cap LP. Comença a enregistrar la teva col·lecció!'
    },
    lpDelete: {
        title: 'Eliminar el LP?',
        message: 'Les dades del teu LP "{{lpTitle}}" s\'esborraran permanentment',
        success: 'L\'àlbum s\'ha esborrat',
        fail: 'No s\'ha pogut esborrar el LP'
    },
    lpEdit: {
        title: 'Edita les dades del teu LP',
        cover: 'Portada',
        success: 'Les dades s\'han desat correctament',
        fail: 'No s\'han pogut desar les dades correctament',
        editCover: 'Modifica la portada',
        nonEditable: 'Si vols modificar les dades d\'aquest LP, retira primer l\'anunci de venda'
    },
    form: {
        save: 'Desa',
        cancel: 'Cancel·la',
        next: 'Següent',
        back: 'Torna',
        noResults: 'No s\'han trobat resultats',
        edit: 'Edita',
        delete: 'Elimina',
        exit: 'Surt'
    },
    dropImage: {
        dragFile: 'Arrossega un fitxer o fes click per seleccionar-lo',
        dragFile_plural: 'Arrossega un màxim de {{count}} fitxers o fes click per seleccionar-los',
        invalidFile: 'Selecciona un fitxer de tipus imatge',
        invalidFile_plural: 'Selecciona com a màxim {{max}} fitxers de tipus imatge'
    },
    lastFm: {
        searchAlbum: {
            unavailable: 'El servei de cerca no es troba disponible. Intenta-ho més tard'
        }
    },
    session: {
        welcome: 'Hola {{username}}!',
        expired: 'La teva sessió s\'ha exhaurit. Torna a identificar-te si us plau'
    },
    userMenu: {
        profile: 'Perfil d\'usuari',
        signout: 'Tancar sessió',
    },
    profile: {
        title: 'Perfil d\'Usuari',
        picture: 'Imatge',
        editPicture: 'Modifica la imatge del teu perfil',
        pictureUploaded: 'La imatge s\'ha pujat correctament',
        userData: 'Dades personals',
        username: 'Nom d\'usuari',
        email: 'Correu electrònic',
        birthDate: 'Data de naixement',
        phoneNumber: 'Telèfon',
        bioLabel: 'Explica els teus interessos i presentat a la resta d\'usuaris',
        bio: 'Presentació',
        registerDate: 'Data de registre',
        address: 'Adreça',
        country: 'País',
        region: 'Provincia',
        city: 'Municipi',
        postalCode: 'Codi postal',
        language: 'Idioma de l\'aplicació'
    },
    editProfile: {
        success: 'El teu perfil s\'ha actualitzat correctament',
        fail: 'No s\'ha pogut actualitzar el teu perfil'
    },
    userList: {
        latestLps: 'Últims Lps',
        fail: 'No s\'ha pogut actualitzar el teu perfil',
        loading: 'Carregant usuari...'
    },
    userDetail: {
        follow: 'Seguir aquest usuari',
        unfollow: 'Deixar de seguir aquest usuari',
        collection: 'Col·lecció de Lps',
        emptyCollection: 'L\'usuari no te LPs amb visibilitat pública',
        usersFollowing: "{{count}} usuari segueix a {{username}}",
        usersFollowing_plural: "{{count}} usuaris segueixen a {{username}}",
        followingUser: "Ara segueixes a {{username}}!",
        unfollowingUser: "Ja no segueixes a {{username}}",
    },
    currency: {
        thousandSeparator: '.',
        decimalSeparator: ','
    },
    unlistLp: {
        title: 'Vols retirar l\'anunci de venda?',
        message: 'Totes les ofertes de compra rebudes es rebutjaran automàticament',
        unpublish: 'Retira',
        unlistedSuccess: 'l\'anunci s\'ha retirat',
        unlistedFail: 'No s\'ha pogut retirar l\'anunci'
    },
    listedItems: {
        tableTitle: 'LPs en venda',
        wantedPrice: 'Preu',
        detail: 'Veure detall',
        published: 'Publicat',
        filter: {
            title: 'Filtra els resultats',
            message: 'Pots filtrar per gènere i/o rang de preus',
            filter: 'Filtra',
            clear: 'Neteja',
            close: 'Surt',
            priceRange: 'Rang de preus',
            genreActive: 'gènere: {{genre}}',
            priceActive: 'preu: {{min}} - {{max}} €'
        },
        emptyTable: 'Actualment No hi ha LPs en venda',
        emptyResults: 'No hi ha resultats amb els filtres seleccionats'
    },
    listedItemDetail: {
        condition: 'Condició de la còpia',
        unknown: 'Desconegut',
        unknown_female: 'Desconeguda',
        pictures: 'Imatges de l\'anunci',
        publishedBy: 'Disc anunciat per {{name}}',
        makeOffer1: 'Aquest LP està anunciat per',
        makeOffer2: 'fes la teva oferta!',
        offerLabel: 'Indica quin preu vols pagar',
        sendOffer: 'Envia la teva oferta',
        nOffers: "{{count}} usuari ha fet una oferta per aquest LP",
        nOffers_plural: "{{count}} usuaris han fet una oferta per aquest LP",
        nOffers_interval: "(0){Cap usuari ha fet encara una oferta per aquest LP}",
        seeOffers: 'Veure ofertes',
        offerMade: 'Has fet una oferta per aquest LP per un import de {{ammount}} €',
        offerSuccess: 'La teva oferta s\'ha enviat'
    },
    offer: {
        status: {
            pending: 'Pendent d\'aprobació',
            accepted: 'Acceptada',
            rejected: 'Rebutjada'
        },
        rate: 'Valora aquesta transacció',
        rateButton: 'Envia',
        rateSuccess: 'La transacció s\'ha valorat correctament'
    },
    receivedOffers: {
        title: 'Ofertes rebudes',
        listedFor: 'Anunciat per {{price}} €',
        buyingOfferFor: '{{username}} ha fet una oferta per {{price}} €',
        accept: 'Accepta',
        reject: 'Rebutja',
        empty: 'No has rebut cap oferta',
        offerRejected: 'Has rebutjat l\'oferta',
        offerAccepted: 'Has acceptat l\'oferta'
    },
    sendedOffers: {
        title: 'Ofertes realitzades',
        sendedFor: 'Has fet una oferta per {{price}} €',
        inStatus: {
            pending: 'La teva oferta es troba pendent d\'acceptació',
            accepted: 'La teva oferta ha estat acceptada!',
            rejected: 'La teva oferta ha estat rebutjada',
        },
        empty: 'No has fet cap oferta'
    },
    pagination: {
        rowsPerPage: 'Reg. per pàgina',
        of: 'de'
    }
};