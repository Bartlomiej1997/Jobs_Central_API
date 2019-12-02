const express = require("express");
const router = express.Router();

const checkAuth = require("../../middleware/checkAuth");
const JobOffer = require("../../models/JobOffer");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(new Error("File type not allowed"), false);
};
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter
});

/**
 * @swagger
 *
 * /job_offers:
 *  get:
 *     description: Get job offers
 *     produces:
 *      - application/json
 *     tags:
 *      - job_offers
 *     responses:
 *       200:
 *         description: Job offers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   authorId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   position:
 *                     type: string
 *                   firm:
 *                     type: string
 *                   dimensions:
 *                     type: string
 *                   description:
 *                     type: string
 *                   city:
 *                     type: string
 *                   street:
 *                     type: string
 *                   number:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items: 
 *                       type: string
 *                   date:
 *                     type: string
 */

router.get("/", (req, res) => {
  JobOffer.find()
    .sort({ date: 1 })
    .exec()
    .then(jobOffers => res.status(200).json(jobOffers))
    .catch(err => res.status(500).json({ error: err }));
});

/**
 * @swagger
 *
 * /job_offers/{id}:
 *  get:
 *     description: Get job offer
 *     produces:
 *      - application/json
 *     tags:
 *      - job_offers
 *     parameters:
 *       - name: id
 *         description: offer_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job offer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 authorId:
 *                   type: string
 *                 title:
 *                   type: string
 *                 position:
 *                   type: string
 *                 firm:
 *                   type: string
 *                 dimensions:
 *                   type: string
 *                 description:
 *                   type: string
 *                 city:
 *                   type: string
 *                 street:
 *                   type: string
 *                 number:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items: 
 *                     type: string
 *                 date:
 *                   type: string
 */
router.get("/:id", (req, res) => {
  JobOffer.findById(req.params.id)
    .exec()
    .then(jobOffer => {
      if (jobOffer) res.status(200).json(jobOffer);
      else
        res.status(404).json({ msg: "No valid entry found for provided ID" });
    })
    .catch(err => res.status(500).json({ error: err }));
});

/**
 * @swagger
 *
 * /job_offers/:
 *  post:
 *     description: Create job offer
 *     produces:
 *      - application/json
 *     security:
 *       - AuthAccessToken: []
 *     tags:
 *      - job_offers
 *     requestBody:
 *       description: Job offer
 *       requied: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               position:
 *                 type: string
 *               firm:
 *                 type: string
 *               dimensions:
 *                 type: string
 *               description:
 *                 type: string
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items: 
 *                   type: string
 *             example:
 *               title: Offer
 *               position: Manager
 *               firm: W gorącej wodzie Company
 *               dimensions: Full
 *               description: Manager in our company
 *               city: Kraków
 *               street: Warszawska
 *               number: 21
 *               tags:
 *                 - job
 *                 - manager
 * 
 *     responses:
 *       200:
 *         description: Job offer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 authorId:
 *                   type: string
 *                 title:
 *                   type: string
 *                 position:
 *                   type: string
 *                 firm:
 *                   type: string
 *                 dimensions:
 *                   type: string
 *                 description:
 *                   type: string
 *                 city:
 *                   type: string
 *                 street:
 *                   type: string
 *                 number:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items: 
 *                     type: string
 *                 date:
 *                   type: string
 */
router.post("/", checkAuth, upload.single("logo"), (req, res) => {
  const newJobOffer = new JobOffer({
    authorId: req.user.id,
    title: req.body.title,
    position: req.body.position,
    firm: req.body.firm,
    city: req.body.city,
    street: req.body.street,
    number: req.body.number,
    dimensions: req.body.dimensions,
    description: req.body.description,
    tags: req.body.tags
  });

  newJobOffer
    .save()
    .then(jobOffer => res.json({ jobOffer }))
    .catch(err => res.status(500).json({ error: err }));
});

// @route   PATCH api/jobOffers/:id
// @desc    Update JobOffers
// @access  Private
router.patch("/:id", checkAuth, (req, res) => {
  JobOffer.findById(req.params.id)
    .exec()
    .then(jobOffer => {
      if (jobOffer) {
        if (req.user.id !== jobOffer.authorId)
          return res.status(401).json({ msg: "No permission!" });
        const updateOps = {};
        for (const ops of req.body) {
          updateOps[ops.propName] = ops.value;
        }
        JobOffer.update({ _id: req.params.id }, { $set: updateOps })
          .exec()
          .then(result => res.status(200).json({ msg: "Updated successfully" }))
          .catch(err => res.status(500).json({ error: err }));
      } else
        res.status(404).json({ msg: "No valid entry found for provided ID" });
    })
    .catch(err => res.status(500).json({ error: err }));
});

/**
 * @swagger
 *
 * /job_offers/{id}:
 *  delete:
 *     description: Delete job offer
 *     produces:
 *      - application/json
 *     security:
 *       - AuthAccessToken: []
 *     tags:
 *      - job_offers
 *     parameters:
 *       - name: id
 *         description: offer_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
router.delete("/:id", checkAuth, (req, res) => {
  JobOffer.findById(req.params.id)
    .then(jobOffer => {
      if (req.user.id != 0)
        return res.status(401).json({ msg: "No permission!" });
      jobOffer
        .remove()
        .exec()
        .then(() => { res.status(204).json({ success: true }); console.log("204") })
        .catch(err => res.status(500).json({ error: err }));
    })
    .catch(err => { res.status(404).json({ success: false }); console.log("404") });
});

module.exports = router;
