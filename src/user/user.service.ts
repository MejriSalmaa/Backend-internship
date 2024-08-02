/* eslint-disable prettier/prettier */
import {  Injectable , HttpException , HttpStatus,BadRequestException,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './user.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { LoginDto } from '../auth/dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/UpdateProfileDto.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    private readonly jwtService: JwtService,  // Inject JwtService here

  ) {}

  async loginUser(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ email: loginDto.email }).select('+password').lean();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(loginDto.password, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect password', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const payload = { _id: user._id,  email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async findUserById(id: string): Promise<UserEntity | undefined> {
    const objectId = new ObjectId(id);
    return await this.userModel.findOne({ _id: objectId }).exec();
  }
  async findEmails(search: string): Promise<string[]> {
    if (!search || typeof search !== 'string') {
      throw new BadRequestException('Invalid search parameter');
    }

    const formattedSearch = search.trim().toLowerCase();
    const regex = new RegExp(formattedSearch, 'i');

    try {
      const users = await this.userModel.find({ email: regex }).exec();
      return users.map(user => user.email);
    } catch (error) {
      console.error('Error finding emails:', error);
      throw new BadRequestException('Database query failed');
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).lean();
    if (existingUser) {
      throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // Handle file upload if picture is provided
    if (createUserDto.picture) {
      const file = createUserDto.picture;

      // Example path to store uploads
      const uploadPath = path.join(__dirname, '/uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadPath, fileName);

      if (file.buffer) {
        fs.writeFileSync(filePath, file.buffer);
        createUserDto.picture = `/uploads/${fileName}`; // Adjust this URL as per your setup
      } else {
        throw new HttpException('File buffer is not defined', HttpStatus.BAD_REQUEST);
      }
    } else {
      createUserDto.picture = 'uploads/anonymPicture.jpg'; // Set the default picture path
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }
  async findAll(): Promise<UserEntity[]> {
    return this.userModel.find().exec();
  } 

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // Find the user by ID
    const user = await this.userModel.findById(id).exec();

    // Throw an exception if user not found
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update user fields
    Object.assign(user, updateUserDto);

    // Save the updated user
    return user.save();
  }
  async removeUser(id: string): Promise<void> {
    // Find the user by ID
    const user = await this.userModel.findById(id).exec();

    // Throw an exception if user not found
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete the user
    await this.userModel.deleteOne({ _id: id }).exec();
  }

  async getProfile(email: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(email: string, updateProfileDto: UpdateProfileDto): Promise<UserEntity> {
    // Check if password needs to be hashed
    if (updateProfileDto.password) {
      updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, 10);
    }
  
    const user = await this.userModel.findOneAndUpdate(
      { email },
      {
        username: updateProfileDto.username,
        picture: updateProfileDto.picture,
        password: updateProfileDto.password,
      },
      { new: true }
    ).exec();
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }

}