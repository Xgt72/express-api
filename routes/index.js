const { Router } = require('express');
const connection = require("../conf");

const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.json({
    title: 'Express'
  });
});

router.get("/api/cars", (req, res) => {
  connection.query("SELECT * FROM car", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des voitures");
    } else {
      res.json(results);
    }
  });
});

router.get("/api/cars/brands", (req, res) => {
  connection.query("SELECT DISTINCT brand FROM car", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des marques de voiture");
    } else {
      res.json(results);
    }
  });
});

router.get("/api/cars/models", (req, res) => {
  connection.query("SELECT DISTINCT model FROM car", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des modèles de voiture");
    } else {
      res.json(results);
    }
  });
});

router.get("/api/cars/colors", (req, res) => {
  connection.query("SELECT DISTINCT color FROM car", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des couleurs de voiture");
    } else {
      res.json(results);
    }
  });
});

router.get("/api/cars/brands/contains/:filter", (req, res) => {
  const filter = req.params.filter;
  const sqlQuery = "SELECT * FROM car WHERE brand LIKE " + connection.escape("%" + filter + "%");
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des marques contenant " + filter);
    } else {
      res.json(results);
    }
  });
});

router.get("/api/cars/brands/startby/:filter", (req, res) => {
  const filter = req.params.filter;
  const sqlQuery = "SELECT * FROM car WHERE brand LIKE " + connection.escape(filter + "%");
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des marques commençant par " + filter);
    } else {
      res.json(results);
    }
  });
});

router.get("/api/cars/release-date/:date", (req, res) => {
  const releaseDate = req.params.date;
  connection.query("SELECT * FROM car WHERE releaseDate > ?", releaseDate, (err, results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la récupération des voitures ayant une date de mise en circulation supérieur à ${releaseDate}`);
    } else {
      res.json(results);
    }
  });
});

router.get("/api/cars/brands/:order", (req, res) => {
  const order = req.params.order;
  const sqlQuery = "SELECT * FROM car ORDER BY brand " + order + " , model " + order;
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des voitures ordonnées par marque");
    } else {
      res.json(results);
    }
  });
});

router.get("/api/cars/colors/:order", (req, res) => {
  const order = req.params.order;
  const sqlQuery = "SELECT * FROM car ORDER BY color " + order;
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des voitures ordonnées par couleur");
    } else {
      res.json(results);
    }
  });
});

router.post("/api/cars", (req, res) => {
  const formData = req.body;
  connection.query("INSERT INTO car SET ?", formData, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la sauvegarde de la voiture");
    } else {
      res.json(results);
    }
  });
});

router.put("/api/cars/update/:id", (req, res) => {
  const carId = req.params.id;
  const formData = req.body;
  connection.query("UPDATE car SET ? WHERE id = ?", [formData, carId], (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la modification de la voiture");
    } else {
      res.sendStatus(200);
    }
  });
});

router.put("/api/cars/update-news/:id", (req, res) => {
  const carId = req.params.id;
  let result;
  connection.query("SELECT new FROM car WHERE id = ?", carId, (err, results) => {
    if (err) {
      res.status(500).send("Voiture inexistante");
    } else {
      result = results[0].new;
      connection.query("UPDATE car SET new = ? WHERE id = ?", [result == 1 ? 0 : 1, carId], (err) => {
        if (err) {
          res.status(500).send("Erreur lors de la modification de la voiture");
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

router.delete("/api/cars/delete/:id", (req, res) => {
  const carId = req.params.id;
  connection.query("DELETE FROM car WHERE id = ?", carId, (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de la voiture id=" + carId);
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete("/api/cars/delete-old", (req, res) => {
  connection.query("DELETE FROM car WHERE new = false", (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression des voitures d'occasion");
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
