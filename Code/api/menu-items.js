const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const values = {$menuItemId: menuItemId};
  db.get(sql, values, (error, menuItem) => {
    if (error) {
      next(error);
    } else if (menuItem) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

menuItemsRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
  const values = { $menuId: req.params.menuId};
  db.all(sql, values, (error, menuItems) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({menuItems: menuItems});
    }
  });
});

menuItemsRouter.post('/', (req, res, next) => {
  const id = req.body.menuItem.id,
        name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.inventory,
        price = req.body.mennuItem.price
    if (error) {
      next(error);
    } else {
      if (!id || !name || !description || !inventory || !price) {
        return res.sendStatus(400);
      }

      const sql = 'INSERT INTO MenuItem (id, name, description, inventory, price, menu_id)' +
          'VALUES ($id, $name, $description, $inventory, $price, $menuId)';
      const values = {
        $id: id,
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: req.params.menuId
      };

      db.run(sql, values, function(error) {
        if (error) {
          next(error);
        } else {
          db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`,
            (error, menuItem) => {
              res.status(201).json({menuItem: menuItem});
            });
        }
      });
    }
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  const id = req.body.menuItem.id,
        name = req.body.menuItem.name,
        description = req.body.menuItem.description,
        inventory = req.body.menuItem.publicationDate,
        price = req.body.menuItem.price;
  if (error) {
      next(error);
    } else {
      if (!id || !name || !description || !inventory || !price) {
        return res.sendStatus(400);
      }

      const sql = 'UPDATE MenuItem SET id = $id, name = $name, description = $description, ' +
          'inventory = $inventory, price = $price ' +
          'WHERE MenuItem.id = $menuItemId';
      const values = {
        $id: id,
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: req.params.menu_id
      };

      db.run(sql, values, function(error) {
        if (error) {
          next(error);
        } else {
          db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
            (error, menuItem) => {
              res.status(200).json({menuItem: menuItem});
            });
        }
      });
    }
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  const sql = 'DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const values = {$menuItemId: req.params.menuItemId};

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = menuItemsRouter;
