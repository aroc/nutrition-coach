import stream from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { ElevenLabsClient } from "elevenlabs";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import AudioFile from '#models/audio_file'

const AUDIO_DURATION_SECS = 8;
const PROMPT_INFLUENCE = 0.3;
const S3_SUBFOLDER = 'audio_files';
const ELEVEN_FILE_CONTENT_TYPE = 'audio/mpeg';
const ELEVEN_FILE_EXTENSION = 'mp3';

export default class AudioFilesController {

  getFileKey() {
    return `${S3_SUBFOLDER}/${Date.now()}-${uuidv4()}.${ELEVEN_FILE_EXTENSION}`;
  }

  async uploadFileToS3(readableStream: stream.Readable, fileKey: string) {
    // Convert stream to buffer
    const chunks: any[] = [];
    for await (const chunk of readableStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // S3 client
    const accessKeyId = env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = env.get('AWS_SECRET_ACCESS_KEY');
    
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are not configured');
    }

    const s3Client = new S3Client({
      region: 'us-west-1',
      credentials: { accessKeyId, secretAccessKey }
    });

    // Define the upload parameters
    const uploadParams = {
      Bucket: env.get('AWS_BUCKET_NAME'),
      Key: fileKey,
      Body: buffer, // Using buffer instead of stream
      ContentType: ELEVEN_FILE_CONTENT_TYPE // Set the content type if needed
    };

    try {
      const data = await s3Client.send(new PutObjectCommand(uploadParams));
      console.log('File uploaded successfully', data);
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err; // Re-throw the error to handle it in the calling function
    }
  }

  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail();

    const audioFiles = await AudioFile
      .query()
      .withScopes((scopes) => scopes.notDeleted())
      .withScopes((scopes) => scopes.confirmed())
      .where((query) => {
        query.where('user_id', user.id)
            .orWhere('is_system_file', true)
      });
    return audioFiles;
  }

  async store({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail();

    const eleventClient = new ElevenLabsClient({
      apiKey: env.get('ELEVEN_LABS_KEY')
    });

    // TODO: Add a system prompt so that we:
    // * Ignore any requests for things that sound liek true music, etc.
    const response = await eleventClient.textToSoundEffects.convert({
      text: request.input('user_prompt'),
      duration_seconds: AUDIO_DURATION_SECS,
      prompt_influence: PROMPT_INFLUENCE
    });

    const fileKey = this.getFileKey();
    await this.uploadFileToS3(response, fileKey);

    // Create a new row in the audio_files table for this user
    const audioFile = await AudioFile.create({
      userId: user.id,
      userPrompt: request.input('user_prompt'),
      fileUrl: fileKey,
      fileName: fileKey.split('/').pop(),
      fileType: 'audio/mpeg',
    });

    return audioFile;
  }

  async update({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail();
    const id = request.input('id');
    const audioFile = await AudioFile.findOrFail(id);

    if (!audioFile || audioFile.userId !== user.id || audioFile.confirmed) {
      response.status(404).send("Audio file not found");
      return
    }

    audioFile.confirmed = request.input('confirmed');
    await audioFile.save();
    return audioFile;
  }

  async delete({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail();
    const id = params.id;
    
    if (!id) {
      response.status(400).send("ID is required");
      return;
    }

    const audioFile = await AudioFile.findOrFail(id);

    if (!audioFile || audioFile.userId !== user.id) {
      response.status(404).send("Audio file not found");
      return;
    }

    audioFile.deletedAt = DateTime.now();
    await audioFile.save();

    return audioFile;
  }
}
