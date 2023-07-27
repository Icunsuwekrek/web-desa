const express = require(`express`)
const app = express()
const PORT = 7000
const cors = require(`cors`)

app.use(cors())
const adminRoute = require(`./routes/admin.route`)
const beritaRoute = require(`./routes/berita.route`)
// const authRoute = require(`./routes/auth.route`)

/**define perfix for each route */
app.use(`/admin`, adminRoute)
app.use(`/berita`, beritaRoute)
// app.use( authRoute)

/**run server based on define port */
app.listen(PORT,() =>{
    console.log(`Server of Web Desa run on port ${PORT}`)
})