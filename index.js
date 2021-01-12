require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.static('public'))
app.set('view engine', 'ejs')
// Mongoose importieren
const mongoose = require('mongoose');
// die uri von MongoDB Website holen. Connection method: Connect your app
// Aufbau von einer Authenifizierungsurl:   userName:userPassword@url.blabla
// const dbUri = "mongodb+srv://supercode:supercode@superdb.uzhey.mongodb.net/SuperDb?retryWrites=true&w=majority"

const GalleryItem = require('./models/galleryItem')

// die Verbindung zur DB herstellen
// Das ist eine Asyncrone Funktion. Deswegen können wir .then und .catch daranhängen
// Die Verbindung sollte vor den app.get usw sein.
mongoose.connect(process.env.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('Connected to my DB')
        // Weil der Server erst laufen soll, wenn wir zur DB verbunden sind, machen wir das Listen hier!
        app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
    })
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/add-new', (req, res) => {

    // eine neue Instanz / Kopie von unserem Galleryitem
    const newGalleryItem = new GalleryItem({
        url: 'https://images.unsplash.com/photo-1610433586471-4f69080f1b08?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
        author: 'Evgeni Tcherkasski',
        rating: 9
    })
    newGalleryItem.save()
        .then(result => {
            // res.send(result)
            res.redirect('/')
        })
        .catch(err => console.log(err))
})

app.get('/gallery', (req, res) => {
    // DB abrufen, auch diese ist asyncron => then / catch
    GalleryItem.find()
        .then(result => {
            // res.send(result)
            res.render('gallery', { galleryData: result })
        })
        .catch(err => console.log(err))
})
app.get('/single', (req, res) => {
    // 5ffd71c11f0d9e22cec8e3f6
    GalleryItem.findById('5ffd71c11f0d9e22cec8e3f6')
        .then(result => {
            // res.send(result);
            res.render('single', { picture: result })
        })
        .catch(err => console.log(err))
})


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/add', (req, res) => {
    res.render('add')
})
app.post('/add-pic', (req, res) => {
    // console.log(req.body);
    const newGalleryItem = new GalleryItem({
        url: req.body.url,
        author: req.body.author,
        rating: req.body.rating
    })
    newGalleryItem.save()
        .then(result => {
            // res.send(result)
            res.redirect('/')
        })
        .catch(err => console.log(err))
})
app.get('/single/:pictureId', (req, res) => {
    // console.log(req.params.pictureId);
    GalleryItem.findById(req.params.pictureId)
        .then(result => {
            // res.send(result);
            res.render('single', { picture: result })
        })
        .catch(err => console.log(err))

    // res.end()
})