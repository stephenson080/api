import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Axios } from 'axios';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { v4 as uuid } from 'uuid';
import { createWriteStream, unlinkSync } from 'fs';
import { join } from 'path';

import {OrderInitiateDto} from '../transaction/transactionDto'
import { TransactionCurrency,MessageResponseDto } from 'src/utils/types';

type uploadfile = { path: string; type: string };

@Injectable()
export class UtilService {
  transporter: Transporter;
  paystackHTTP: Axios;
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('API_KEY'),
      api_secret: this.configService.get('API_SECRET'),
    });

    this.paystackHTTP = new Axios({
      headers: {
        
        Authorization: `Bearer ${this.configService.get('PAYSTACK_KEY')}`,
      },
    });
  }
  sendMail(
    email: string,
    subject: string,
    message: string,
    html?: boolean,
    url?: string,
    btnTitle?: string,
  ) {
    this.transporter.sendMail(
      {
        from: 'blockplot@support.com',
        to: email,
        subject: subject,
        text: !html ? message : undefined,
        html: html
          ? `<div
        
      >
        <h5>${message}</h5>
        <br/>
        <div style="
        display: flex;
        justify-content: center;
        align-items: center;
      ">
          <a
              href="${url}"
            style="
              background-color: navy;
              padding: 8px 20px;
              outline: none;
              color: white;
              cursor: pointer;
              border-radius: 30px;
              border: none;
              text-decoration: none;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
            "
          >
            ${btnTitle}
        </a>
        </div>`
          : undefined,
      },
      (err: any, info: any) => {
        // console.log(err, info);
      },
    );
  }

  async uploadFileToCloudinary(file: { path: string; type: string }) {
    // todo: use secure url on production
    return await new Promise(
      (
        res: (val: UploadApiResponse) => void,
        rej: (err: UploadApiErrorResponse) => void,
      ) => {
        cloudinary.uploader.upload(
          file.path,
          {
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            resource_type: 'auto',
          },
          (err, result) => {
            if (err) rej(err);
            res(result);
          },
        );
      },
    );
  }

  async uploadPropertyImage(file: Express.Multer.File) {
    return new Promise(
      (res: ({ path, type }: uploadfile) => void, rej: (err: any) => void) => {
        if (
          file.mimetype !== 'image/png' &&
          file.mimetype !== 'image/jpeg' &&
          file.mimetype !== 'image/jpg'
        ) {
          throw new BadRequestException({
            message: 'Upload must be an image',
          });
        }
        if (file.size > 6000000)
          throw new BadRequestException({
            // to remember to change value of upload
            message: 'Image must not be greater tham 6MB',
          });
        const fileArray = file.originalname
          .replace(' ', '')
          .toLowerCase()
          .split('.');
        const filePath = `${fileArray[0]}-${uuid().toString()}.${fileArray[1]}`;
        const ws = createWriteStream(join('upload', `${filePath}`));
        ws.write(file.buffer, (err) => {
          if (err) rej(err);
          res({
            path: ws.path.toString(),
            type: ws.path.toString().split('.').pop(),
          });
        });
      },
    );
  }

  async uploadPropertyImages(files: Express.Multer.File[]) {
    const filesUploadedUrl: uploadfile[] = [];
    try {
      for (let file of files) {
        const upload = await this.uploadPropertyImage(file);
        filesUploadedUrl.push(upload);
      }
      return filesUploadedUrl;
    } catch (error) {
      throw error;
    }

    // const message = await this.userService.userKyc(req.user.userId, userKyc, ws.path.toString())
    // deleting file from server
    // if (ws.path.toString() ){
    //   unlinkSync(ws.path.toString())
    // }
  }

  validateFilesUpload(files: any) {
    const filesUploadedUrl: { path: string; type: string }[] = [];
    const uploadedFiles = Object.keys(files);
    for (let file of uploadedFiles) {
      if (!files[file] || files[file].length <= 0)
        throw new BadRequestException({ message: `${file} is Required` });
      if (
        files[file][0].fieldname === 'image_url' ||
        files[file][0].fieldname === 'document_url'
      ) {
        const fileObj: Express.Multer.File = files[file][0];
        if (
          fileObj.mimetype !== 'image/png' &&
          fileObj.mimetype !== 'image/jpeg' &&
          fileObj.mimetype !== 'image/jpg'
        )
          throw new BadRequestException({
            message: `${file} must be an image`,
          });
        if (fileObj.size > 2000000) // change file size to 200kb
          throw new BadRequestException({
            message: `${file} should not be more than 200kb`,
          });
      } else {
        const fileObj: Express.Multer.File = files[file][0];
        // if (
        //   fileObj.mimetype !== 'video/x-flv' &&
        //   fileObj.mimetype !== 'video/mp4' &&
        //   fileObj.mimetype !== 'application/x-mpegURL' &&
        //   fileObj.mimetype !== 'video/MP2T' &&
        //   fileObj.mimetype !== 'video/3gpp' &&
        //   fileObj.mimetype !== 'video/quicktime' &&
        //   fileObj.mimetype !== 'video/MP2T' &&
        //   fileObj.mimetype !== 'video/3gpp' &&
        //   fileObj.mimetype !== 'video/x-msvideo' &&
        //   fileObj.mimetype !== 'video/x-ms-wmv'
        // )
        //   throw new BadRequestException({
        //     message: `${file} Must be a video file`,
        //   });
        if (fileObj.size > 10000000)
          throw new BadRequestException({
            message: `${file} should not be more than 10mb`,
          });
      }
      const fileObject: Express.Multer.File = files[file][0];
      const fileArray = fileObject.originalname
        .replace(' ', '')
        .toLowerCase()
        .split('.');
      const filePath = `${fileArray[0]}-${uuid().toString()}.${
        fileArray[1]
      }`.replace(' ', '');
      const ws = createWriteStream(join('upload', `${filePath}`));
      ws.write(fileObject.buffer, (err) => {
        if (err) throw new BadRequestException({ message: err.message });
      });
      filesUploadedUrl.push({
        path: ws.path.toString(),
        type: ws.path.toString().split('.').pop(),
      });
    }
    return filesUploadedUrl;
  }

  async deleteFileFromCloudinary(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }

  async initiatePaystackPayment(email: string, amount: string, currency: TransactionCurrency) : Promise<OrderInitiateDto> {
    try {
      const res = await this.paystackHTTP.post(
        `https://api.paystack.co/transaction/initialize`,
        JSON.stringify({email, amount, currency}),
      );
      
      return JSON.parse(res.data)
    } catch (error) {
      throw new UnprocessableEntityException({ message: error.message });
    }
  }

  async verifyPaystackPayment(reference: string){
    try {
      const res = await this.paystackHTTP.get(`https://api.paystack.co/transaction/verify/${reference}`)
      const data = JSON.parse(res.data)
      if (data.status === 'success'){
        return new MessageResponseDto('Success', 'Payment Successful')
      }
      return new MessageResponseDto('Success', res.data.data.status)
    } catch (error) {
      throw new UnprocessableEntityException({message: error.message})
    }
  }
}
