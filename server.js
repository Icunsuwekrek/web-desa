require("dotenv").config();

const express = require(`express`);
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;
const cors = require(`cors`);
const morgan = require("morgan");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

const adminRoute = require(`./routes/admin.route`);
const beritaRoute = require(`./routes/berita.route`);
const authRoute = require(`./routes/auth.route`);

/**define perfix for each route */
app.use(`/v1/admin`, adminRoute);
app.use(`/v1/news`, beritaRoute);
app.use(`/v1/auth`, authRoute);

/**run server based on define port */
app.listen(PORT, () => {
  console.log(`Server of Web Desa run on port ${PORT}`);
});
