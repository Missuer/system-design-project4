const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('./user');
const Bicycle = require('./bicycle');
const cors = require('cors');
const axiso = require('axios');
const PORT = 8080;
const jwtSecret = "jwtSecret"
const expireTime = 1800; //seconds

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://sam:85526620@cluster0.egjns.mongodb.net/bicycle?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, async (err) => {
    if (err)
        console.log(err);
    console.log("connected");


    // let bi = new Bicycle({
    //     name: 'Aethos Dura-Ace Di2',
    //     addr: 'Toronto',
    //     store: 'bikedepot',
    //     link: 'https://www.bikedepot.com/product/specialized-s-works-aethos-dura-ace-di2-384182-1.html',
    //     price: 15299,
    //     image: 'Picture1.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'Kona-Rove ST - 2021',
    //     addr: 'Toronto',
    //     store: `SWEET PETE'S BIKE SHOP`,
    //     link: 'https://www.sweetpetes.com/product/kona-rove-st-20919.html',
    //     price: 1599.99,
    //     image: 'Picture2.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'creo SL Comp Carbon',
    //     addr: 'Toronto',
    //     store: `bikedepot`,
    //     link: 'https://www.bikedepot.com/product/specialized-turbo-creo-sl-comp-carbon-365039-1.html',
    //     price: 8999,
    //     image: 'Picture3.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'Trek-Verve+ 2 Lowstep - 2021',
    //     addr: 'Toronto',
    //     store: 'Kona-Rove ST - 2021',
    //     link: 'https://www.sweetpetes.com/product/trek-verve-2-lowstep-365895-1.html',
    //     price: 3469.99,
    //     image: 'Picture4.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'Venge ViAs Disc eTap',
    //     addr: 'Toronto',
    //     store: `bikedepot`,
    //     link: 'https://www.bikedepot.com/product/specialized-s-works-venge-vias-disc-etap-276104-1.html',
    //     price: 15369,
    //     image: 'Picture5.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'TRANCE X E+ PRO 29 1',
    //     addr: 'Toronto',
    //     store: `GIANT`,
    //     link: 'https://www.gianttoronto.com/ca/trance-x-eplus-pro-29-1-2021',
    //     price: 7559,
    //     image: 'Picture6.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'STP 20 FS LIV',
    //     addr: 'Toronto',
    //     store: `GIANT`,
    //     link: 'https://www.gianttoronto.com/ca/stp-20-fs-liv-2021',
    //     price: 719,
    //     image: 'Picture7.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'Kona-Sutra - 2021',
    //     addr: 'Toronto',
    //     store: `SWEET PETE'S BIKE SHOP`,
    //     link: 'https://www.sweetpetes.com/product/kona-sutra-21031.html',
    //     price: 1999.99,
    //     image: 'Picture8.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'Creo SL E5 Comp',
    //     addr: 'Toronto',
    //     store: `bikedepot`,
    //     link: 'https://www.bikedepot.com/product/specialized-turbo-creo-sl-e5-comp-373226-1.html',
    //     price: 6789,
    //     image: 'Picture9.png'
    // })
    // await bi.save();
    // bi = new Bicycle({
    //     name: 'SEDONA DX',
    //     addr: 'Toronto',
    //     store: `GIANT`,
    //     link: 'https://www.gianttoronto.com/ca/sedona-dx',
    //     price: 649,
    //     image: 'Picture10.png'
    // })
    // await bi.save();

});

const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

app = new express();

app.use(express.json())

app.use(cookieParser());

app.use(cors());

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.post('/api/login', (req, res) => {

    User.findOne({ username: req.body.username })
        .then((user) => {

            if (!user) {
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Username dosenot exist' }]
                });
            } else {
                if (!(user.validatePassword(req.body.password))) {
                    res.status(401).send({
                        errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
                    });
                } else {
                    //AUTHENTICATION SUCCESS
                    const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, { expiresIn: expireTime });
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                    res.json({ id: user.id, username: user.username });
                }
            }
        }).catch(
            // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            (err) => new Promise((resolve) => { console.log(err); setTimeout(resolve, 1000) }).then(
                () => res.status(401).send({ msg: err })
            )
        );
});

app.get('/api/map', async (req, res) => {
    const { lat, lng } = req.query;
    let response = await axiso.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=4000&type=bicycle_store&keyword=cruise&key=AIzaSyCqIAlQpyecPGoONZ1w4CMQLgBtmdeRS_A`)
    let stores = response.data.results.map((store) => { return { id: store.place_id, pos: store.geometry.location, ...store } })
    return res.json(stores)
})

app.post('/api/signup', async (req, res) => {
    let user = await User.findOne({ username: req.body.username })
    if (user) {
        return res.status(400).send({
            errors: [{ 'param': 'Server', 'msg': 'Username already exist!!' }]
        })
    }
    try {
        user = new User({
            username: req.body.username,
            pass: req.body.password,
        });
        await user.save();
        return res.json(user);
    } catch (e) {
        res.status(400).send({
            errors: [{ 'param': 'Server', 'msg': e.message }]
        });
    }
})

app.get('/api/users', async (req, res) => {
    let users = await User.find({});
    return res.json(users);
});

app.get('/api/bicycles', async (req, res) => {
    let bicycles = await Bicycle.find({});
    return res.json(bicycles);
})


app.use(jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
}));

//GET /user
app.get('/api/user', (req, res) => {
    const user = req.user && req.user.user;
    console.log(user)
    User.findById(user)
        .then((user) => {
            res.json({ id: user.id, username: user.username });
        }).catch(
            (err) => {
                res.status(401).json(authErrorObj);
            }
        );
});

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});
app.listen(PORT);