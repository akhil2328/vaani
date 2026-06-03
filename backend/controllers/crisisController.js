import Crisis from "../models/Crisis.js";

// ======================
// GET ALL CRISIS
// ======================

export const getAllCrisis =
  async (req, res) => {

    try {

      const data =
        await Crisis.find().sort({
          createdAt: -1,
        });

      res.json(data);

    } catch (err) {

      console.log(
        "GET CRISIS ERROR:",
        err
      );

      res.status(500).json({
        error:
          "Failed to fetch crisis data",
      });

    }

  };

// ======================
// MARK AS COMPLETED
// ======================

export const markCompleted =
  async (req, res) => {

    try {

      const { id } = req.params;

      const updated =
        await Crisis.findByIdAndUpdate(

          id,

          {
            status: "completed",
          },

          {
            returnDocument:
              "after",
          }

        );

      res.json(updated);

    } catch (err) {

      console.log(
        "COMPLETE ERROR:",
        err
      );

      res.status(500).json({
        error:
          "Failed to update crisis",
      });

    }

  };

// ======================
// DELETE COMPLETED
// ======================

export const deleteCompleted =
  async (req, res) => {

    try {

      await Crisis.deleteMany({
        status: "completed",
      });

      res.json({
        message:
          "Completed tasks removed",
      });

    } catch (err) {

      console.log(
        "DELETE ERROR:",
        err
      );

      res.status(500).json({
        error:
          "Failed to delete completed tasks",
      });

    }

  };