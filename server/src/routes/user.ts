import { UserController } from '@/controller/user';
import { Router } from 'express';

export class UserRoutes {
  private router: Router;
  private userController: UserController;

  constructor(userController: UserController) {
    this.router = Router();
    this.userController = userController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/users', this.userController.getAllUsers);
    this.router.get('/users/:id', this.userController.getUserById);
    this.router.post('/users', this.userController.createUser);
    this.router.put('/users/:id', this.userController.updateUser);
    this.router.delete('/users/:id', this.userController.deleteUser);

    this.router.get('/', (req, res) => {
      res.json({
        message: 'API is running!',
        version: '1.0.0',
        endpoints: {
          users: {
            'GET /api/users': 'Get all users',
            'GET /api/users/:id': 'Get user by ID',
            'POST /api/users': 'Create new user',
            'PUT /api/users/:id': 'Update user',
            'DELETE /api/users/:id': 'Delete user'
          }
        }
      });
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}