import { Request, Response } from "express";

interface User {
  id: number;
  name: string;
  email: string;
}

export class UserController {
  private users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  public getAllUsers = (req: Request, res: Response): void => {
    try {
      res.status(200).json({
        success: true,
        data: this.users,
        count: this.users.length,
      });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch users");
    }
  };

  public getUserById = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id);
      const user = this.users.find((u) => u.id === id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch user");
    }
  };

  public createUser = (req: Request, res: Response): void => {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({
          success: false,
          message: "Name and email are required",
        });
        return;
      }

      const newUser: User = {
        id: this.users.length + 1,
        name,
        email,
      };

      this.users.push(newUser);

      res.status(201).json({
        success: true,
        data: newUser,
        message: "User created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create user");
    }
  };

  public updateUser = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id);
      const { name, email } = req.body;

      const userIndex = this.users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      if (name) this.users[userIndex].name = name;
      if (email) this.users[userIndex].email = email;

      res.status(200).json({
        success: true,
        data: this.users[userIndex],
        message: "User updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update user");
    }
  };

  public deleteUser = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id);
      const userIndex = this.users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      const deletedUser = this.users.splice(userIndex, 1)[0];

      res.status(200).json({
        success: true,
        data: deletedUser,
        message: "User deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete user");
    }
  };

  private handleError(res: Response, error: any, message: string): void {
    console.error(`Error: ${message}`, error);
    res.status(500).json({
      success: false,
      message,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
}
